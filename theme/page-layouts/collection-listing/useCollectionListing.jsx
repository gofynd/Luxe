import React, { useMemo, useState, useRef, useEffect } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useWishlist, useAccounts } from "../../helper/hooks";
import useSortModal from "./useSortModal";
import useFilterModal from "./useFilterModal";
import { COLLECTION, COLLECTION_ITEMS } from "../../queries/collectionsQuery";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../helper/utils";
import useAddToCartModal from "../plp/useAddToCartModal";
import { useThemeConfig } from "../../helper/hooks";

const PAGE_SIZE = 12;
const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;

const useCollectionListing = ({ fpi, slug }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleWishlist, followedIdList } = useWishlist({ fpi });

  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const listingPrice =
    CONFIGURATION?.app_features?.common?.listing_price?.value || "range";

  const { globalConfig, pageConfig } = useThemeConfig({
    fpi,
    page: "collection-listing",
  });

  const collectionData = useGlobalStore(fpi?.getters?.COLLECTION);
  const { isCollectionsSsrFetched } = useGlobalStore(fpi.getters.CUSTOM_VALUE);

  const { name: collectionName, description: collectionDesc } =
    collectionData?.collection || {};
  const {
    filters = [],
    sort_on: sortOn,
    page: pageInfo,
    items,
  } = collectionData?.item || {};

  const [productList, setProductList] = useState(items || undefined);
  // const [pageNo, setPageNo] = useState(productsListData?.page?.current);
  const currentPage = pageInfo?.current ?? 1;
  const [apiLoading, setApiLoading] = useState(!isCollectionsSsrFetched);
  const [isPageLoading, setIsPageLoading] = useState(!isCollectionsSsrFetched);

  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);
  const { user_plp_columns } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) ?? {};
  const [columnCount, setColumnCount] = useState(
    user_plp_columns ?? {
      desktop: Number(pageConfig?.grid_desktop) || 2,
      tablet: Number(pageConfig?.grid_tablet) || 3,
      mobile: Number(pageConfig?.grid_mob) || 1,
    }
  );

  const [isResetFilterDisable, setIsResetFilterDisable] = useState(false);

  const addToCartModalProps = useAddToCartModal({ fpi, pageConfig });

  const breadcrumb = useMemo(
    () => [
      { label: "Home", link: "/" },
      { label: "Collections", link: "/collections" },
      { label: collectionName },
    ],
    [collectionName]
  );

  const isClient = useMemo(() => isRunningOnClient(), []);

  useEffect(() => {
    if (!isCollectionsSsrFetched) {
      fetchCollection({
        slug,
      });
    }
  }, [slug]);

  useEffect(() => {
    fpi.custom.setValue("isCollectionsSsrFetched", false);
  }, []);

  useEffect(() => {
    if (!isCollectionsSsrFetched) {
      const searchParams = isClient
        ? new URLSearchParams(location?.search)
        : null;

      const pageNo = Number(searchParams?.get("page_no"));

      const payload = {
        slug,
        pageType: "number",
        first: PAGE_SIZE,
        search: appendDelimiter(searchParams?.toString()) || undefined,
        sortOn: searchParams?.get("sort_on") || undefined,
      };

      if (pageConfig?.loading_options === "pagination")
        payload.pageNo = pageNo || 1;
      fetchProducts(payload);

      const resetableFilterKeys =
        Array.from(searchParams?.keys?.() ?? [])?.filter?.(
          (i) => !["q", "sort_on", "page_no"].includes(i)
        ) ?? [];
      setIsResetFilterDisable(!resetableFilterKeys?.length);
    }
  }, [location?.search, locationDetails, slug]);

  const fetchCollection = (payload) => {
    fpi
      .executeGQL(COLLECTION, payload)
      .then(() => {})
      .catch((err) => {});
  };

  const fetchProducts = (payload, append = false) => {
    setApiLoading(true);

    fpi
      .executeGQL(COLLECTION_ITEMS, payload)
      .then((res) => {
        if (res.errors) {
          throw res.errors[0];
        }
        if (append) {
          setProductList((prevState) => {
            return prevState.concat(res?.data?.collectionItems?.items || []);
          });
        } else {
          setProductList(res?.data?.collectionItems?.items || []);
        }
        setApiLoading(false);
      })
      .finally(() => {
        setIsPageLoading(false);
        setApiLoading(false);
      });
  };

  const handleLoadMoreProducts = () => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    const payload = {
      slug,
      pageNo: currentPage + 1,
      pageType: "number",
      first: PAGE_SIZE,
      search: appendDelimiter(searchParams?.toString()) || undefined,
      sortOn: searchParams?.get("sort_on") || undefined,
    };
    fetchProducts(payload, true);
  };

  function appendDelimiter(queryString) {
    const searchParams = isClient ? new URLSearchParams(queryString) : null;
    const params = Array.from(searchParams?.entries() || []);

    const result = params.reduce((acc, [key, value]) => {
      if (key !== "page_no" && key !== "sort_on") {
        acc.push(`${key}:${value}`);
      }
      return acc;
    }, []);
    // Append ::: to each parameter except the last one
    return result.join(":::");
  }

  const handleFilterUpdate = ({ filter, item }) => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    const {
      key: { name, kind },
    } = filter;
    const { value, is_selected } = item;

    if (kind === "range") {
      searchParams?.set(name, value);
    } else if (!searchParams?.has(name, value) && !is_selected) {
      searchParams?.append(name, value);
    } else {
      searchParams?.delete(name, value);
    }
    searchParams?.delete("page_no");
    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  };

  const handleSortUpdate = (value) => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    if (value) {
      searchParams?.set("sort_on", value);
    } else {
      searchParams?.delete("sort_on");
    }
    searchParams?.delete("page_no");
    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  };

  function resetFilters() {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    filters.forEach((filter) => {
      searchParams?.delete(filter.key.name);
    });
    searchParams?.delete("page_no");
    navigate?.({
      pathname: location?.pathname,
      search: searchParams?.toString(),
    });
  }

  const getPageUrl = (pageNo) => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    searchParams?.set("page_no", pageNo);
    return `${location?.pathname}?${searchParams?.toString()}`;
  };

  const getStartPage = ({ current, totalPageCount }) => {
    const index = Math.max(current - PAGE_OFFSET, 1);
    const lastIndex = Math.max(totalPageCount - PAGES_TO_SHOW + 1, 1);

    if (index <= 1) {
      return 1;
    }
    if (index > lastIndex) {
      return lastIndex;
    }
    return index;
  };

  const paginationProps = useMemo(() => {
    if (!pageInfo) {
      return;
    }
    const {
      current,
      has_next: hasNext,
      has_previous: hasPrevious,
      item_total,
    } = pageInfo || {};
    const totalPageCount = Math.ceil(item_total / PAGE_SIZE);
    const startingPage = getStartPage({ current, totalPageCount });

    const displayPageCount = Math.min(totalPageCount, PAGES_TO_SHOW);

    const pages = [];
    for (let i = 0; i < displayPageCount; i++) {
      pages.push({
        link: getPageUrl(startingPage + i),
        index: startingPage + i,
      });
    }

    return {
      current: current || 1,
      hasNext,
      hasPrevious,
      prevPageLink: hasPrevious ? getPageUrl(current - 1) : "",
      nextPageLink: hasNext ? getPageUrl(current + 1) : "",
      pages,
    };
  }, [pageInfo]);

  useEffect(() => {
    if (user_plp_columns) {
      setColumnCount(user_plp_columns);
    }
  }, [user_plp_columns]);

  const handleColumnCountUpdate = ({ screen, count }) => {
    fpi.custom.setValue("user_plp_columns", {
      ...columnCount,
      [screen]: count,
    });
  };

  const filterList = useMemo(() => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;

    return (filters ?? []).map((filter) => {
      const isNameInQuery =
        searchParams?.has(filter?.key?.name) ||
        filter?.values?.some(({ is_selected }) => is_selected);
      return { ...filter, isOpen: isNameInQuery };
    });
  }, [filters, location?.search]);

  const isFilterOpen = filterList.some((filter) => filter.isOpen);

  if (!isFilterOpen && filterList.length > 0) {
    filterList[0].isOpen = true;
  }

  const { openSortModal, ...sortModalProps } = useSortModal({
    sortOn,
    handleSortUpdate,
  });
  const { openFilterModal, ...filterModalProps } = useFilterModal({
    filters: filterList,
    resetFilters,
    handleFilterUpdate,
  });
  const { isLoggedIn, openLogin } = useAccounts({ fpi });

  const handleWishlistToggle = (data) => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    toggleWishlist(data);
  };

  const selectedFilters = useMemo(() => {
    const searchParams = isRunningOnClient()
      ? new URLSearchParams(location?.search)
      : null;

    return filterList?.reduce((acc, curr) => {
      const selectedValues = curr?.values?.filter(
        (filter) =>
          searchParams?.getAll(curr?.key?.name).includes(filter?.value) ||
          filter?.is_selected
      );

      if (selectedValues.length > 0) {
        return [...acc, { key: curr?.key, values: selectedValues }];
      }

      return acc;
    }, []);
  }, [filterList]);

  return {
    isProductCountDisplayed: pageConfig?.product_number,
    isScrollTop: pageConfig?.back_top,
    isBrand: !pageConfig?.hide_brand,
    isSaleBadge: globalConfig?.show_sale_badge,
    isPrice: globalConfig?.show_price,
    isHdimgUsed: false,
    isResetFilterDisable,
    isProductOpenInNewTab: pageConfig?.in_new_tab,
    breadcrumb,
    title: collectionName,
    description: collectionDesc || "",
    productCount: pageInfo?.item_total,
    columnCount,
    filterList,
    selectedFilters,
    sortList: sortOn,
    productList: productList || items,
    isProductLoading: apiLoading,
    isPageLoading,
    loadingOption: pageConfig.loading_options,
    listingPrice,
    paginationProps,
    sortModalProps,
    filterModalProps,
    followedIdList,
    isImageFill: globalConfig?.img_fill,
    imageBackgroundColor: globalConfig?.img_container_bg,
    showImageOnHover: globalConfig?.show_image_on_hover,
    showAddToCart: pageConfig?.show_add_to_cart && !globalConfig?.disable_cart,
    addToCartModalProps,
    globalConfig,
    aspectRatio: getProductImgAspectRatio(globalConfig),
    onResetFiltersClick: resetFilters,
    onColumnCountUpdate: handleColumnCountUpdate,
    onSortUpdate: handleSortUpdate,
    onFilterUpdate: handleFilterUpdate,
    onFilterModalBtnClick: openFilterModal,
    onSortModalBtnClick: openSortModal,
    onWishlistClick: handleWishlistToggle,
    onViewMoreClick: handleLoadMoreProducts,
    onLoadMoreProducts: handleLoadMoreProducts,
  };
};

export default useCollectionListing;
