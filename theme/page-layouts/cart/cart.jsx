import React from "react";
import CartNew from "fdk-react-templates/pages/cart/cart";
import styles from "./cart.less";
import "fdk-react-templates/pages/cart/cart.css";
// import PriceBreakup from "fdk-react-templates/components/price-breakup.js";
// import "fdk-react-templates/components/price-breakup.css";
import Loader from "../../components/loader/loader";
import EmptyState from "../../components/empty-state/empty-state";
import useCart from "./useCart";
import useCartDeliveryLocation from "./useCartDeliveryLocation";
import useCartShare from "./useCartShare";
import useCartComment from "./useCartComment";
import useCartGst from "./useCartGst";
import useCartCoupon from "./useCartCoupon";

function Cart({ fpi }) {
  const { isLoading, cartData, currencySymbol, ...restProps } = useCart(fpi);

  const cartDeliveryLocation = useCartDeliveryLocation({ fpi });
  const cartShare = useCartShare({ fpi, cartData });
  const cartComment = useCartComment({ fpi, cartData });
  const cartGst = useCartGst({ fpi, cartData });
  const cartCoupon = useCartCoupon({ fpi, cartData });

  if (isLoading) {
    return <Loader />;
  }

  if (cartData?.items?.length === 0) {
    return <EmptyState title="Your Shopping Bag is empty" />;
  }

  return (
    <div
      className={`${styles.cart} ${styles.basePageContainer} ${styles.margin0auto}`}
    >
      <CartNew
        {...restProps}
        cartData={cartData}
        currencySymbol={currencySymbol}
        deliveryLocationProps={cartDeliveryLocation}
        cartCouponProps={{
          ...cartCoupon,
          currencySymbol,
        }}
        cartGstProps={{ ...cartGst, currencySymbol }}
        cartCommentProps={cartComment}
        cartShareProps={cartShare}
      />
    </div>
  );
}

export default Cart;
