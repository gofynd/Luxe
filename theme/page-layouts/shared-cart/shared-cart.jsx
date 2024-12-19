import React from "react";
import SharedCartLib from "@gofynd/theme-template/pages/shared-cart/shared-cart";
import styles from "./shared-cart.less";
import "@gofynd/theme-template/pages/shared-cart/shared-cart.css";
import useSharedCart from "./useSharedCart";

function SharedCart({ fpi }) {
  const sharedCartProps = useSharedCart(fpi);
  return (
    <div className={styles.sharedCartPageWrapper}>
      <SharedCartLib {...sharedCartProps} />
    </div>
  );
}

export default SharedCart;
