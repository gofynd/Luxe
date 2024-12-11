import React from "react";
import SharedCartLib from "fdk-react-templates/pages/shared-cart/shared-cart";
import styles from "./shared-cart.less";
import "fdk-react-templates/pages/shared-cart/shared-cart.css";
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
