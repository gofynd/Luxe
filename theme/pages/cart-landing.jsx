import React from "react";
import Cart from "../page-layouts/cart/cart";

function CartPage({ fpi }) {
  return <Cart fpi={fpi} />;
}

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "share_cart",
      label: "Share Cart",
      default: true,
      info: "Allows Sharing oIf Cart",
    },
  ],
});

CartPage.serverFetch = () => {};

// CartPage.authGuard = isLoggedIn;
export const sections = JSON.stringify([]);

export default CartPage;
