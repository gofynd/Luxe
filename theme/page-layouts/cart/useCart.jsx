import React, { useEffect, useMemo, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useNavigate } from "react-router-dom";
import {
  CART_DETAILS,
  CART_UPDATE,
  CART_META_UPDATE,
} from "../../queries/cartQuery";
import { useAccounts, useWishlist, useSnackbar } from "../../helper/hooks";
import useHeader from "../../components/header/useHeader";

const useCart = (fpi) => {
  const [checkoutMode, setCheckoutMode] = useState("");
  const CART = useGlobalStore(fpi.getters.CART);
  const appFeatures = useGlobalStore(fpi.getters.APP_FEATURES);
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const pageConfig =
    mode?.page?.find((f) => f.page === "cart-landing")?.settings?.props || {};
  const isLoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const { cartItemCount } = useHeader(fpi);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [isCartUpdating, setIsCartUpdating] = useState(false);
  const { buy_now_cart_items, cart_items, cart_items_count } = CART || {};
  const {
    breakup_values,
    loading: cartItemsLoading,
    items,
    id: cartId,
  } = cart_items || {};
  const { loading: buyNowCartItemsLoading } = buy_now_cart_items || {};
  const { loading: cartItemsCountLoading } = cart_items_count || {};
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  const { openLogin } = useAccounts({ fpi });
  const { addToWishList } = useWishlist({ fpi });

  useEffect(() => {
    setCheckoutMode(cart_items?.checkoutMode ?? "");
  }, [cart_items]);

  const fetchCartDetails = () => {
    const payload = {
      buyNow: false,
      includeAllItems: true,
      includeCodCharges: true,
      includeBreakup: true,
    };
    return fpi.executeGQL(CART_DETAILS, payload);
  };
  useEffect(() => {
    setIsLoading(true);
    fetchCartDetails().then(() => setIsLoading(false));
  }, [fpi]);

  const isAnonymous = appFeatures?.landing_page?.continue_as_guest;
  const isGstInput = appFeatures?.cart?.gst_input;
  const isPlacingForCustomer = appFeatures?.cart?.placing_for_customer;

  const cartItemsByItemId = useMemo(() => {
    if (items?.length > 0) {
      const cartItemsObj = {};
      items.forEach((singleItem) => {
        if (singleItem?.key) {
          cartItemsObj[singleItem.key] = singleItem;
        }
      });
      return cartItemsObj;
    }
    return {};
  }, [items]);

  const isOutOfStock = useMemo(() => {
    const outofstock = items?.find(
      (item) => item?.availability?.out_of_stock === true
    );
    return !!outofstock;
  }, [items]);

  const isNotServicable = useMemo(() => {
    const notservicable = items?.find(
      (item) => item?.availability?.deliverable === false
    );
    return !!notservicable;
  }, [items]);

  const currencySymbol = useMemo(
    () => cart_items?.currency?.symbol || "₹",
    [cart_items]
  );

  function updateCartItems(
    event,
    itemDetails,
    itemSize,
    totalQuantity,
    itemIndex,
    operation
  ) {
    if (event) {
      event.stopPropagation();
    }

    const payload = {
      b: true,
      i: true,
      updateCartRequestInput: {
        items: [
          {
            article_id: `${itemDetails?.product?.uid}_${itemSize}`,
            item_id: itemDetails?.product?.uid,
            item_size: itemSize,
            item_index: itemIndex,
            quantity: totalQuantity,
            identifiers: {
              identifier: itemDetails?.identifiers?.identifier,
            },
          },
        ],
        operation,
      },
    };
    setIsCartUpdating(true);
    return fpi
      .executeGQL(CART_UPDATE, payload, { skipStoreUpdate: true })
      .then((res) => {
        setIsCartUpdating(false);
        if (res?.data?.updateCart?.success) {
          showSnackbar(
            res?.data?.updateCart?.message || "Cart is updated",
            "success"
          );
          fetchCartDetails();
        } else {
          showSnackbar(
            res?.data?.updateCart?.message || "Cart is updated",
            "error"
          );
        }
        return res?.data?.updateCart;
      });
  }

  function gotoCheckout() {
    if (cart_items?.id) {
      navigate({
        pathname: "/cart/checkout",
        search: `id=${cart_items?.id}`,
      });
    } else {
      navigate({
        pathname: "/cart/bag",
      });
    }
  }

  function openRemoveModal() {
    setIsRemoveModalOpen(true);
  }

  function closeRemoveModal() {
    setIsRemoveModalOpen(false);
  }

  function handleRemoveItem(data) {
    if (!data) {
      return;
    }
    const { item, size, index } = data;
    updateCartItems(null, item, size, 0, index, "remove_item").then(() => {
      closeRemoveModal();
    });
  }
  const handleMoveToWishlist = (data) => {
    if (!data) {
      return;
    }

    if (isLoggedIn) {
      addToWishList(data.item.product).then(() => {
        handleRemoveItem(data);
      });
    } else {
      closeRemoveModal();
      openLogin();
    }
  };
  function onOpenPromoModal() {
    setIsPromoModalOpen(true);
  }
  function onClosePromoModal(e) {
    setIsPromoModalOpen(false);
  }

  function onPriceDetailsClick() {
    const element = document.getElementById("price-breakup-container-id");
    if (element) {
      element.scrollIntoView?.({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  const updateCartCheckoutMode = () => {
    const mode = checkoutMode === "other" ? "self" : "other";
    const payload = {
      cartMetaRequestInput: {
        checkout_mode: mode,
      },
    };
    setCheckoutMode(mode);
    fpi.executeGQL(CART_META_UPDATE, payload);
  };

  return {
    isLoading,
    isCartUpdating,
    isLoggedIn,
    cartData: cart_items,
    checkoutMode,
    cartItems: cartItemsByItemId,
    cartItemsWithActualIndex: items,
    breakUpValues: breakup_values,
    cartItemCount,
    currencySymbol,
    isAnonymous,
    isValid: cart_items?.is_valid,
    isNotServicable,
    isOutOfStock,
    isGstInput,
    isPlacingForCustomer,
    isShareCart: pageConfig?.share_cart ?? true,
    isRemoveModalOpen,
    isPromoModalOpen,
    onUpdateCartItems: updateCartItems,
    onGotoCheckout: gotoCheckout,
    onRemoveIconClick: openRemoveModal,
    onRemoveButtonClick: handleRemoveItem,
    onWishlistButtonClick: handleMoveToWishlist,
    onCloseRemoveModalClick: closeRemoveModal,
    onPriceDetailsClick,
    updateCartCheckoutMode,
    onOpenPromoModal,
    onClosePromoModal,
  };
};

export default useCart;
