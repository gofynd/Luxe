import React, { useState, useMemo, useEffect } from "react";
import { useFPI } from "fdk-core/utils";
import { BlockRenderer } from "fdk-core/components";
import PriceBreakup from "fdk-react-templates/components/price-breakup/price-breakup";
import DeliveryLocation from "fdk-react-templates/page-layouts/cart/Components/delivery-location/delivery-location";
import Coupon from "fdk-react-templates/page-layouts/cart/Components/coupon/coupon";
import Comment from "fdk-react-templates/page-layouts/cart/Components/comment/comment";
import GstCard from "fdk-react-templates/page-layouts/cart/Components/gst-card/gst-card";
import ChipItem from "fdk-react-templates/page-layouts/cart/Components/chip-item/chip-item";
import ShareCart from "fdk-react-templates/page-layouts/cart/Components/share-cart/share-cart";
import StickyFooter from "fdk-react-templates/page-layouts/cart/Components/sticky-footer/sticky-footer";
import RemoveCartItem from "fdk-react-templates/page-layouts/cart/Components/remove-cart-item/remove-cart-item";
import "fdk-react-templates/pages/cart/cart.css";

import styles from "../styles/sections/cart-landing.less";
import Loader from "../components/loader/loader";
import EmptyState from "../components/empty-state/empty-state";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import useCart from "../page-layouts/cart/useCart";
import useCartDeliveryLocation from "../page-layouts/cart/useCartDeliveryLocation";
import useCartShare from "../page-layouts/cart/useCartShare";
import useCartComment from "../page-layouts/cart/useCartComment";
import useCartGst from "../page-layouts/cart/useCartGst";
import useCartCoupon from "../page-layouts/cart/useCartCoupon";
import { useThemeConfig, useThemeFeature } from "../helper/hooks";
import { useGlobalTranslation } from "fdk-core/utils";
import { useNavigate } from "fdk-core/utils";

export function Component({ blocks }) {
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const {
    isLoading,
    cartData,
    currencySymbol,
    isCartUpdating,
    isLoggedIn = false,
    cartItems,
    cartItemsWithActualIndex,
    breakUpValues,
    isAnonymous,
    isValid,
    isNotServicable,
    isOutOfStock,
    onUpdateCartItems,
    isGstInput = true,
    isPlacingForCustomer,
    cartShareProps,
    isRemoveModalOpen = false,
    isPromoModalOpen = false,
    customerCheckoutMode,
    checkoutMode,
    buybox = {},
    onGotoCheckout = () => { },
    onRemoveIconClick = () => { },
    onRemoveButtonClick = () => { },
    onWishlistButtonClick = () => { },
    onCloseRemoveModalClick = () => { },
    onPriceDetailsClick = () => { },
    updateCartCheckoutMode = () => { },
    onOpenPromoModal = () => { },
    onClosePromoModal = () => { },
  } = useCart(fpi);
  const { globalConfig } = useThemeConfig({ fpi });
  const { isInternational } = useThemeFeature({ fpi });
  const cartDeliveryLocation = useCartDeliveryLocation({ fpi });
  const cartShare = useCartShare({ fpi, cartData });
  const cartComment = useCartComment({ fpi, cartData });
  const cartGst = useCartGst({ fpi, cartData });
  const cartCoupon = useCartCoupon({ fpi, cartData });

  const [sizeModal, setSizeModal] = useState(null);
  const [currentSizeModalSize, setCurrentSizeModalSize] = useState(null);
  const [removeItemData, setRemoveItemData] = useState(null);
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/auth/login?redirectUrl=/cart/bag");
  };

  const cartItemsArray = Object.keys(cartItems || {});
  const sizeModalItemValue = cartItems && sizeModal && cartItems[sizeModal];

  useEffect(() => {
    const isOtherCustomer = blocks?.some(
      (block) => block?.type === "order_for_customer"
    );
    if (!isOtherCustomer && checkoutMode === "other") {
      updateCartCheckoutMode("self");
    }
  }, [checkoutMode, blocks]);

  const totalPrice = useMemo(
    () => breakUpValues?.display?.find((val) => val.key === "total")?.value,
    [breakUpValues]
  );

  const handleRemoveIconClick = (data) => {
    setRemoveItemData(data);
    onRemoveIconClick();
  };

  const isShareCart = useMemo(() => {
    return !!blocks?.find((block) => block?.type === "share_cart");
  }, [blocks]);

  if (isLoading) {
    return <Loader />;
  } else if (cartData?.items?.length === 0) {
    return (
      <EmptyState
        Icon={
          <div>
            <SvgWrapper svgSrc="empty-cart" />
          </div>
        }
        title={t("resource.section.order.empty_state_title")}
      />
    );
  }

  return (
    <div className={`${styles.cart} basePageContainer margin0auto`}>
      <div className={styles.cartMainContainer}>
        {cartData?.message && cartData?.items && (
          <div className={styles.errContainer}>
            <span className={styles.errorIcon}>
              <SvgWrapper svgSrc="error-info-icon" />
            </span>
            <span className={styles.errMsg}>{cartData.message}</span>
          </div>
        )}
        <div className={styles.cartWrapper}>
          <div className={styles.cartItemDetailsContainer}>
            <DeliveryLocation {...cartDeliveryLocation} />
            <div className={styles.cartTitleContainer}>
              <div className={styles.bagDetailsContainer}>
                <span className={styles.bagCountHeading}>
                  {t("resource.section.cart.your_bag")}
                </span>
                <span className={styles.bagCount}>
                  {cartItemsArray?.length || 0}
                  {cartItemsArray?.length > 1 ? ` ${t("resource.common.items")}` : ` ${t("resource.common.item")}`}
                </span >
              </div >
    { isShareCart && (
      <div className={styles.shareCartTablet}>
        <ShareCart {...cartShare} />
      </div>
    )
}
            </div >
  { cartItemsArray?.length > 0 &&
  cartItemsArray?.map((singleItem, itemIndex) => {
    const singleItemDetails = cartItems[singleItem];
    const productImage =
      singleItemDetails?.product?.images?.length > 0 &&
      singleItemDetails?.product?.images[0]?.url?.replace(
        "original",
        "resize-w:250"
      );

    const currentSize = singleItem?.split("_")[1];
    return (
      <ChipItem
        key={`${singleItemDetails?.product?.uid}_${singleItemDetails?.article?.store?.uid}`}
        isCartUpdating={isCartUpdating}
        isDeliveryPromise={!globalConfig?.is_hyperlocal}
        singleItemDetails={singleItemDetails}
        productImage={productImage}
        onUpdateCartItems={onUpdateCartItems}
        currentSize={currentSize}
        itemIndex={itemIndex}
        sizeModalItemValue={sizeModalItemValue}
        currentSizeModalSize={currentSizeModalSize}
        setCurrentSizeModalSize={setCurrentSizeModalSize}
        setSizeModal={setSizeModal}
        sizeModal={sizeModal}
        singleItem={singleItem}
        cartItems={cartItems}
        buybox={buybox}
        cartItemsWithActualIndex={cartItemsWithActualIndex}
        onRemoveIconClick={handleRemoveIconClick}
        isPromoModalOpen={isPromoModalOpen}
        onOpenPromoModal={onOpenPromoModal}
        onClosePromoModal={onClosePromoModal}
      />
    );
  })}
          </div >

{
  breakUpValues?.display.length > 0 && (
    <div className={styles.cartItemPriceSummaryDetails}>
      {blocks &&
        blocks.map((block) => {
          switch (block.type) {
            case "coupon":
              return (
                <Coupon
                  {...cartCoupon}
                  currencySymbol={currencySymbol}
                />
              );

            case "comment":
              return <Comment {...cartComment} />;

            case "gst_card":
              return (
                <>
                  {isGstInput && (
                    <GstCard
                      {...cartGst}
                      currencySymbol={currencySymbol}
                      key={cartData}
                    />
                  )}
                </>
              );

            case "price_breakup":
              return (
                <PriceBreakup
                  breakUpValues={breakUpValues?.display || []}
                  cartItemCount={cartItemsArray?.length || 0}
                  currencySymbol={currencySymbol}
                  isInternationalTaxLabel={isInternational}
                />
              );
            case "order_for_customer":
              return (
                <>
                  {isPlacingForCustomer && (
                    <div
                      className={styles.checkoutContainer}
                      onClick={() => updateCartCheckoutMode()}
                    >
                      <SvgWrapper
                        svgSrc={
                          customerCheckoutMode === "other"
                            ? "radio-selected"
                            : "radio"
                        }
                      />
                      <span>{t("resource.section.cart.order_on_behalf")}</span>
                    </div>
                  )}
                </>
              );
            case "checkout_buttons":
              return (
                <>
                  {!isLoggedIn ? (
                    <>
                      <button
                        className={styles.priceSummaryLoginButton}
                        onClick={redirectToLogin}
                      >
                        {t("resource.auth.login.login_caps")}
                      </button>
                      {isAnonymous && (
                        <button
                          className={styles.priceSummaryGuestButton}
                          disabled={
                            !isValid || isOutOfStock || isNotServicable
                          }
                          onClick={onGotoCheckout}
                        >
                          {t(
                            "resource.section.cart.continue_as_guest_caps"
                          )}
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      className={styles.priceSummaryLoginButton}
                      disabled={
                        !isValid || isOutOfStock || isNotServicable
                      }
                      onClick={onGotoCheckout}
                    >
                      {t(
                        "resource.section.cart.checkout_button"
                      )}
                    </button>
                  )}
                </>
              );

            case "share_cart":
              return (
                <div className={styles.shareCartDesktop}>
                  <ShareCart showCard={true} {...cartShare} />
                </div>
              );

            case "extension-binding":
              return <BlockRenderer block={block} />;

            default:
              return (
                <div>
                  {t("resource.common.invalid_block")}
                </div>
              );
          }
        })}
    </div>
  )
}
        </div >
        <StickyFooter
          isLoggedIn={isLoggedIn}
          isValid={isValid}
          isOutOfStock={isOutOfStock}
          isNotServicable={isNotServicable}
          isAnonymous={isAnonymous}
          totalPrice={totalPrice}
          currencySymbol={currencySymbol}
          onLoginClick={redirectToLogin}
          onCheckoutClick={onGotoCheckout}
          onPriceDetailsClick={onPriceDetailsClick}
        />
        <RemoveCartItem
          isOpen={isRemoveModalOpen}
          cartItem={removeItemData?.item}
          onRemoveButtonClick={() => onRemoveButtonClick(removeItemData)}
          onWishlistButtonClick={() => onWishlistButtonClick(removeItemData)}
          onCloseDialogClick={onCloseRemoveModalClick}
        />
      </div >
    </div >
  );
}

export const settings = {
  label: "t:resource.sections.cart_landing.cart_landing",
  props: [],
  blocks: [
    {
      type: "coupon",
      name: "t:resource.sections.cart_landing.coupon",
      props: [],
    },
    {
      type: "comment",
      name: "t:resource.sections.cart_landing.comment",
      props: [],
    },
    {
      type: "gst_card",
      name: "t:resource.sections.cart_landing.gst_card",
      props: [
        {
          type: "header",
          value: "t:resource.sections.cart_landing.orders_india_only",
        },
      ],
    },
    {
      type: "price_breakup",
      name: "t:resource.sections.cart_landing.price_breakup",
      props: [],
    },
    {
      type: "order_for_customer",
      name: "t:resource.sections.cart_landing.behalf_of_customer",
      props: [],
    },
    {
      type: "checkout_buttons",
      name: "t:resource.sections.cart_landing.login_checkout_buttons",
      props: [],
    },
    {
      type: "share_cart",
      name: "t:resource.sections.cart_landing.share_cart",
      props: [],
    },
  ],
  preset: {
    blocks: [
      {
        name: "t:resource.sections.cart_landing.coupon",
      },
      {
        name: "t:resource.sections.cart_landing.comment",
      },
      {
        name: "t:resource.sections.cart_landing.gst_card",
      },
      {
        name: "t:resource.sections.cart_landing.behalf_of_customer",
      },
      {
        name: "t:resource.sections.cart_landing.price_breakup",
      },
      {
        name: "t:resource.sections.cart_landing.login_checkout_buttons",
      },
      {
        name: "t:resource.sections.cart_landing.share_cart",
      },
    ],
  },
};
export default Component;
