import React, { useEffect, useState, useMemo, useRef } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { FETCH_FOLLOWED_PRODUCTS } from "../../queries/wishlistQuery";
import { useWishlist } from "../../helper/hooks/index";
import EmptyState from "../../components/empty-state/empty-state";
import { getProductImgAspectRatio } from "../../helper/utils";

const useWishlistPage = ({ fpi }) => {
  const followedlList = useGlobalStore(fpi.getters.FOLLOWED_LIST);
  const [productList, setProductList] = useState([]);
  const userLoggedin = useGlobalStore(fpi.getters.LOGGED_IN);
  const [loading, setLoading] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const pageSizeRef = useRef(12);

  const THEME = useGlobalStore(fpi.getters.THEME);
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const listingPrice =
    CONFIGURATION?.app_features?.common?.listing_price?.value || "range";

  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );

  const globalConfig = mode?.global_config?.custom?.props;

  const breadcrumb = useMemo(
    () => [{ label: "Home", link: "/" }, { label: "Wishlist" }],
    []
  );

  const fetchProducts = (payload = {}, append = false) => {
    setIsFetchingProducts(true);
    const wishlistPayload = {
      ...payload,
      collectionType: "products",
      pageSize: pageSizeRef.current,
    };
    return fpi
      .executeGQL(FETCH_FOLLOWED_PRODUCTS, wishlistPayload)
      .then((res) => {
        if (res?.errors) {
          throw res?.errors?.[0];
        }
        if (append) {
          setProductList((prevState) => {
            return prevState.concat(res?.data?.followedListing?.items || []);
          });
        } else {
          setProductList(res?.data?.followedListing?.items || []);
        }
        return res?.data?.followedListing;
      })
      .catch((err) => {
        // Do Nothing
      })
      .finally(() => {
        setIsFetchingProducts(false);
      });
  };

  const handleLoadmore = () => {
    fetchProducts(
      {
        pageId: followedlList?.page?.next_id,
      },
      true
    );
  };
  useEffect(() => {
    console.log(followedlList, "followedlList");
    if (!followedlList.items?.[0]?.name) {
      setLoading(true);
      fetchProducts().finally(() => {
        setLoading(false);
      });
    } else {
      setProductList(followedlList?.items || []);
    }
  }, []);

  const EmptyStateComponent = () => (
    <EmptyState
      title="You do not have any product added to wishlist"
      description="Add products to wishilst"
      btnTitle="CONTINUE SHOPPING"
    />
  );
  const { removeFromWishlist } = useWishlist({ fpi });

  const handleWishistClick = ({ product }) => {
    removeFromWishlist(product, true).then(() => fetchProducts());
  };

  // const getFollowIds = () => fpi.executeGQL(FOLLOWED_PRODUCTS_IDS);

  return {
    loading,
    breadcrumb,
    productList,
    title: "Wishlist",
    totalCount: followedlList?.page?.item_total || 0,
    isImageFill: globalConfig?.img_fill,
    imageBackgroundColor: globalConfig?.img_container_bg,
    isBrand: true,
    isSaleBadge: globalConfig?.show_sale_badge,
    isPrice: globalConfig?.show_price,
    isHdimgUsed: false,
    aspectRatio: getProductImgAspectRatio(globalConfig),
    isProductOpenInNewTab: false,
    listingPrice: "range",
    hasNext: !!followedlList?.page?.has_next,
    isLoading: isFetchingProducts,
    onLoadMore: handleLoadmore,
    EmptyStateComponent,
    onWishlistClick: handleWishistClick,
  };
};

export default useWishlistPage;
