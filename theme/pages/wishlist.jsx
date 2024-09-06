import React from "react";
import useWishlist from "../page-layouts/wishlist/useWishlist";
import styles from "../styles/wishlist.less";
import { FETCH_FOLLOWED_PRODUCTS } from "../queries/wishlistQuery";
import { isLoggedIn } from "../helper/auth-guard";
import Loader from "../components/loader/loader";
import Wishlist from "fdk-react-templates/pages/wishlist/wishlist";
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

WishlistPage.serverFetch = async ({ fpi }) => {
  const payload = {
    collectionType: "products",
    pageSize: 12,
  };
  return fpi.executeGQL(FETCH_FOLLOWED_PRODUCTS, payload);
};

WishlistPage.authGuard = isLoggedIn;

export default WishlistPage;
