import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import {
  ADD_TO_CART,
  CHECK_PINCODE,
  GET_PRODUCT_DETAILS,
  OFFERS,
  PRODUCT_SIZE_PRICE,
} from "../../../queries/pdpQuery";
import useHeader from "../../../components/header/useHeader";
import {
  ADD_WISHLIST,
  CART_ITEMS_COUNT,
  FOLLOWED_PRODUCTS_IDS,
  REMOVE_WISHLIST,
} from "../../../queries/wishlistQuery";
import { useSnackbar } from "../../../helper/hooks";
import { LOCALITY } from "../../../queries/logisticsQuery";
import { isEmptyOrNull } from "../../../helper/utils";
import { fetchCartDetails } from "../../cart/useCart";

const useProductDescription = (fpi, slug) => {
  const PRODUCT = useGlobalStore(fpi.getters.PRODUCT);
  const LoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "product-description")?.settings
      ?.props || {};

  const { isPdpSsrFetched } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPincode, setCurrentPincode] = useState("");
  const [currentSize, setCurrentSize] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectPincodeError, setSelectPincodeError] = useState(false);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState("");
  const { product_details, product_meta, product_price_by_slug } = PRODUCT;
  const { sizes, loading: productMetaLoading } = product_meta || {};
  const { loading: productDetailsLoading } = product_details || {};
  const [isPageLoading, setIsPageLoading] = useState(!isPdpSsrFetched);

  const { wishlistIds } = useHeader(fpi);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPriceBySize, setIsLoadingPriceBySize] = useState(false);
  // const isLoading =
  //   productMetaLoading ||
  //   productDetailsLoading ||
  //   productPriceBySlugLoading ||
  //   false;

  useEffect(() => {
    fpi.custom.setValue("isPdpSsrFetched", false);
  }, []);

  useEffect(() => {
    if (!isPdpSsrFetched) {
      setIsLoading(true);
      if (
        Object.keys?.(PRODUCT?.product_details)?.length &&
        slug === PRODUCT?.product_details?.slug
      ) {
        if (product_meta?.sizes?.sellable && pageConfig?.show_offers) {
          getOffers(slug);
          setIsLoading(false);
        }
        setIsLoading(false);
        setIsPageLoading(false);
        return;
      }
      const values = {
        slug,
      };
      fpi
        .executeGQL(GET_PRODUCT_DETAILS, values)
        .then((res) => {
          if (res) {
            setCoupons(res?.data?.coupons?.available_coupon_list || []);
            setPromotions(res?.data?.promotions?.available_promotions);
            setCurrentPincode(localStorage?.getItem("pincode") || "");
            setIsLoading(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsPageLoading(false);
        });
    }
  }, [slug]);

  useEffect(() => {
    setFollowed(wishlistIds?.includes(product_details?.uid));
  }, [LoggedIn, wishlistIds, product_details]);

  function getOffers(slug) {
    fpi.executeGQL(OFFERS, { slug }).then((res) => {
      setCoupons(res?.data?.coupons?.available_coupon_list || []);
      setPromotions(res?.data?.promotions?.available_promotions);
      setCurrentPincode(localStorage?.getItem("pincode") || "");
    });
  }

  const fetchProductPrice = () => {
    if (currentSize !== null && currentPincode?.length < 6) {
      const values = {
        slug,
        size: currentSize?.value.toString(),
        pincode: "",
      };
      setIsLoadingPriceBySize(true);
      fpi.executeGQL(PRODUCT_SIZE_PRICE, values).then((res) => {
        setIsLoadingPriceBySize(false);
        return res;
      });
    } else if (
      currentSize !== null &&
      pageConfig?.mandatory_pincode &&
      currentPincode?.length === 6
    ) {
      setIsLoadingPriceBySize(true);
      const values = {
        slug,
        size: currentSize?.value.toString(),
        pincode: currentPincode.toString(),
      };
      setTimeout(() => {
        fpi.executeGQL(PRODUCT_SIZE_PRICE, values).then((res) => {
          setIsLoadingPriceBySize(false);
          if (isEmptyOrNull(res.data.productPrice)) {
            setPincodeErrorMessage(
              "Product is not serviceable at given locality"
            );
          }
        });
      }, 700);
    }
  };

  useEffect(() => {
    fetchProductPrice();
  }, [currentSize, currentPincode]);

  function addToWishList(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!LoggedIn) {
      showSnackbar("Please Login first.");
      navigate("/auth/login");
      return;
    }
    const values = {
      collectionType: "products",
      collectionId: product_details?.uid?.toString(),
    };
    fpi.executeGQL(ADD_WISHLIST, values).then((OutRes) => {
      if (OutRes?.data?.followById?.message) {
        fpi.executeGQL(FOLLOWED_PRODUCTS_IDS, null).then((res) => {
          showSnackbar(
            OutRes?.data?.followById?.message || "Added to Wishlist",
            "success"
          );
        });
      }
    });
  }

  function removeFromWishlist(event) {
    if (event) {
      event.stopPropagation();
    }
    const values = {
      collectionType: "products",
      collectionId: product_details?.uid?.toString(),
    };
    fpi.executeGQL(REMOVE_WISHLIST, values).then((OutRes) => {
      if (OutRes?.data?.unfollowById?.message) {
        fpi.executeGQL(FOLLOWED_PRODUCTS_IDS, null).then((res) => {
          showSnackbar(
            OutRes?.data?.followById?.message || "Removed from Wishlist",
            "success"
          );
        });
      }
    });
  }

  const checkPincode = (postCode) => {
    fpi
      .executeGQL(LOCALITY, {
        locality: `pincode`,
        localityValue: `${postCode}`,
      })
      .then((res) => {
        if (res?.data?.locality) {
          fetchProductPrice();
          localStorage?.setItem("pincode", postCode);
          setCurrentPincode(postCode);
        } else {
          localStorage?.removeItem("pincode");
          setPincodeErrorMessage(
            res?.errors?.[0]?.message || "Pincode verification failed"
          );
        }
      });
  };

  function getQty() {
    const moq = product_details?.moq || false;

    const availableQty = currentSize?.quantity;
    if (moq) {
      return availableQty > moq?.increment_unit
        ? moq?.increment_unit
        : (moq?.minimum ?? 1);
    }
  }

  function addProductForCheckout(event, size, buyNow = false) {
    if (event) {
      event.stopPropagation();
    }
    if (
      pageConfig?.mandatory_pincode &&
      (currentPincode?.length !== 6 || pincodeErrorMessage.length)
    ) {
      setSelectPincodeError(true);
      setPincodeErrorMessage("");
      showSnackbar(
        "Please enter valid Pincode before Add to cart/ Buy now",
        "error"
      );
      return;
    }
    if (
      !pageConfig?.mandatory_pincode &&
      ((currentPincode?.length > 0 && currentPincode?.length < 6) ||
        pincodeErrorMessage.length)
    ) {
      setSelectPincodeError(true);
      setPincodeErrorMessage("");
      showSnackbar(
        "Please enter valid Pincode before Add to cart/ Buy now",
        "error"
      );
      return;
    }
    if (
      !pageConfig?.mandatory_pincode &&
      (!currentPincode?.length || !currentPincode?.length === 6) &&
      !pincodeErrorMessage.length
    ) {
      setSelectPincodeError(false);
      setPincodeErrorMessage("");
    }

    if (!size) {
      showSnackbar("Please select the size first.", "error");
      return;
    }
    if (product_price_by_slug !== null) {
      const payload = {
        buyNow,
        areaCode: currentPincode?.toString(),
        addCartRequestInput: {
          items: [
            {
              article_assignment: {
                level: `${product_price_by_slug?.article_assignment?.level}`,
                strategy: `${product_price_by_slug?.article_assignment?.strategy}`,
              },
              article_id: product_price_by_slug?.article_id?.toString(),
              item_id: product_details?.uid,
              item_size: size?.toString(),
              quantity: getQty(),
              seller_id: product_price_by_slug?.seller?.uid,
              store_id: product_price_by_slug?.store?.uid,
            },
          ],
        },
      };
      return fpi.executeGQL(ADD_TO_CART, payload).then((outRes) => {
        if (outRes?.data?.addItemsToCart?.success) {
          // fpi.executeGQL(CART_ITEMS_COUNT, null).then((res) => {
          fetchCartDetails(fpi);
          showSnackbar(
            outRes?.data?.addItemsToCart?.message || "Added to Cart",
            "success"
          );
          if (buyNow) {
            navigate(
              `/cart/checkout/?buy_now=true&id=${outRes?.data?.addItemsToCart?.cart?.id}`
            );
          }
          // });
        } else {
          showSnackbar(
            outRes?.data?.addItemsToCart?.message || "Failed to add to cart",
            "error"
          );
        }
        return outRes;
      });
    }
  }

  return {
    productDetails: product_details || {},
    productMeta: product_meta?.sizes || {},
    productPriceBySlug: product_price_by_slug || null,
    currentImageIndex,
    currentSize,
    currentPincode,
    coupons: coupons || [],
    promotions: promotions || [],
    isLoading,
    isPageLoading,
    isLoadingPriceBySize,
    pageConfig,
    globalConfig,
    followed,
    selectPincodeError,
    pincodeErrorMessage,
    setCurrentSize,
    setCurrentImageIndex,
    setCurrentPincode,
    addToWishList,
    removeFromWishlist,
    addProductForCheckout,
    checkPincode,
    setPincodeErrorMessage,
  };
};

export default useProductDescription;
