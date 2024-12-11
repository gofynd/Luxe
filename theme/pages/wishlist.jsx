import React from "react";
import Wishlist from "fdk-react-templates/pages/wishlist/wishlist";
import useWishlist from "../page-layouts/wishlist/useWishlist";
import styles from "../styles/wishlist.less";
import { isLoggedIn } from "../helper/auth-guard";
import Loader from "../components/loader/loader";
import "fdk-react-templates/pages/wishlist/wishlist.css";

function WishlistPage({ fpi }) {
  const { loading, ...wishlistProps } = useWishlist({ fpi });

  return (
    <div className="basePageContainer margin0auto">
      <div className={`${styles.wishlistWrap} ${styles.flexColumn}`}>
        {loading ? <Loader /> : <Wishlist {...wishlistProps} />}
      </div>
    </div>
  );
}

WishlistPage.authGuard = isLoggedIn;

export const sections = JSON.stringify([]);

export default WishlistPage;
