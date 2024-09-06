import { useState, useMemo, useRef } from "react";
import { useGlobalStore } from "fdk-core/utils";
import {
  ADD_WISHLIST,
  REMOVE_WISHLIST,
  FOLLOWED_PRODUCTS_ID,
} from "../../queries/wishlistQuery";
import { useSnackbar } from "./hooks";

export const useWishlist = ({ fpi }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pageSizeRef = useRef(500);
  const followedlList = useGlobalStore(fpi.getters.FOLLOWED_LIST);
  const { showSnackbar } = useSnackbar();
  // console.log({
  //   FOLLOWED_LIST: useGlobalStore(fpi.getters.FOLLOWED_LIST),
  //   FOLLOWED_PRODUCTS: useGlobalStore(fpi.getters.FOLLOWED_PRODUCTS),
  //   FOLLOWER_COUNT_BY_ID: useGlobalStore(fpi.getters.FOLLOWER_COUNT_BY_ID),
  //   FOLLOW_BY_ID: useGlobalStore(fpi.getters.FOLLOW_BY_ID),
  //   FOLLOW_IDS: useGlobalStore(fpi.getters.FOLLOW_IDS),
  // });

  function fetchFollowdProductsId() {
    const payload = {
      collectionType: "products",
      pageSize: pageSizeRef.current,
    };
    return fpi.executeGQL(FOLLOWED_PRODUCTS_ID, payload).then((res) => {
      return res;
    });
  }

  function addToWishList(product) {
    setIsLoading(true);
    const payload = {
      collectionType: "products",
      collectionId: product?.uid?.toString(),
    };
    return fpi
      .executeGQL(ADD_WISHLIST, payload)
      .then((res) => {
        if (res?.data?.followById?.message) {
          showSnackbar(
            res?.data?.followById?.message || "Added to wishlist",
            "success"
          );
          return fetchFollowdProductsId().then(() => res?.data?.followById);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function removeFromWishlist(product, fromWishlist = false) {
    setIsLoading(true);
    const payload = {
      collectionType: "products",
      collectionId: product?.uid?.toString(),
    };
    if (fromWishlist) {
      return fpi.executeGQL(REMOVE_WISHLIST, payload).finally(() => {
        setIsLoading(false);
        showSnackbar("Products Removed From Wishlist", "success");
      });
    } else {
      return fpi
        .executeGQL(REMOVE_WISHLIST, payload)
        .then((res) => {
          if (res?.data?.unfollowById?.message) {
            showSnackbar(
              res?.data?.unfollowById?.message ||
                "Products Removed From Wishlist",
              "success"
            );
            return fetchFollowdProductsId().then(() => res?.data?.unfollowById);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  function toggleWishlist({ product, isFollwed }) {
    if (isLoading) {
      return;
    }
    if (isFollwed) {
      removeFromWishlist(product);
    } else {
      addToWishList(product);
    }
  }

  // useEffect(() => {
  //   if (followedlList?.items) {
  //     fetchFollowdProductsId();
  //   }
  // }, []);

  const followedIdList = useMemo(() => {
    return followedlList?.items?.map((item) => item.uid) || [];
  }, [followedlList]);

  return {
    isLoading,
    followedIdList,
    followedCount: followedlList?.page?.item_total || 0,
    addToWishList,
    removeFromWishlist,
    toggleWishlist,
  };
};
