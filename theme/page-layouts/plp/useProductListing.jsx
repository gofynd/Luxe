import React, { useEffect, useState, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccounts, useWishlist } from "../../helper/hooks";
import useSortModal from "./useSortModal";
import useFilterModal from "./useFilterModal";
import { PLP_PRODUCTS } from "../../queries/plpQuery";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../helper/utils";
import placeholder from "../../assets/images/placeholder3x4.png";

const PAGE_SIZE = 12;
const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;

const useProductListing = ({ fpi }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const THEME = useGlobalStore(fpi.getters.THEME);
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const listingPrice =
    CONFIGURATION?.app_features?.common?.listing_price?.value || "range";
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "product-listing")?.settings?.props ||
    {};

  const productsListData = useGlobalStore(fpi?.getters?.PRODUCTS);
  const { isPlpSsrFetched } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const { filters = [], sort_on: sortOn, page, items } = productsListData || {};

  const [productList, setProductList] = useState(items || undefined);
  const currentPage = productsListData?.page?.current ?? 1;
  const [apiLoading, setApiLoading] = useState(!isPlpSsrFetched);
  const [isPageLoading, setIsPageLoading] = useState(!isPlpSsrFetched);

  const [columnCount, setColumnCount] = useState({
    desktop: Number(pageConfig?.grid_desktop) || 2,
    tablet: Number(pageConfig?.grid_tablet) || 3,
    mobile: Number(pageConfig?.grid_mob) || 1,
  });
  const [isResetFilterDisable, setIsResetFilterDisable] = useState(false);

  const breadcrumb = useMemo(
    () => [{ label: "Home", link: "/" }, { label: "Products" }],
    []
  );

  const isClient = useMemo(() => isRunningOnClient(), []);

  useEffect(() => {
    fpi.custom.setValue("isPlpSsrFetched", false);
  }, []);

  useEffect(() => {
    if (!isPlpSsrFetched) {
      const searchParams = isClient
        ? new URLSearchParams(location?.search)
        : null;
      const pageNo = Number(searchParams?.get("page_no"));
      const payload = {
        pageType: "number",
        first: PAGE_SIZE,
        filterQuery: appendDelimiter(searchParams?.toString()) || undefined,
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
  }, [location?.search]);

  const fetchProducts = (payload, append = false) => {
    setApiLoading(true);

    fpi
      .executeGQL(PLP_PRODUCTS, payload)
      .then((res) => {
        if (append) {
          setProductList((prevState) => {
            return prevState.concat(res?.data?.products?.items || []);
          });
        } else {
          setProductList(res?.data?.products?.items || []);
        }
        setApiLoading(false);
      })
      .finally(() => {
        setApiLoading(false);
        setIsPageLoading(false);
      });
  };

  const handleLoadMoreProducts = () => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    const payload = {
      pageNo: currentPage + 1,
      pageType: "number",
      first: PAGE_SIZE,
      filterQuery: appendDelimiter(searchParams?.toString()) || undefined,
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
    filters?.forEach((filter) => {
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
    } else if (index > lastIndex) {
      return lastIndex;
    } else {
      return index;
    }
  };

  const paginationProps = useMemo(() => {
    if (!productsListData?.page) {
      return;
    }
    const {
      current,
      has_next: hasNext,
      has_previous: hasPrevious,
      item_total,
    } = productsListData?.page || {};
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
  }, [productsListData?.page]);

  useEffect(() => {
    const savedColumnCount = localStorage?.getItem("user_plp_columns");
    if (savedColumnCount) {
      setColumnCount(JSON?.parse(savedColumnCount));
    }
  }, []);

  const handleColumnCountUpdate = ({ screen, count }) => {
    setColumnCount((prev) => {
      const updatedColumnCount = { ...prev, [screen]: count };
      localStorage?.setItem?.(
        "user_plp_columns",
        JSON?.stringify(updatedColumnCount)
      );
      return updatedColumnCount;
    });
  };

  const { openSortModal, ...sortModalProps } = useSortModal({
    sortOn,
    handleSortUpdate,
  });

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

  const { openFilterModal, ...filterModalProps } = useFilterModal({
    filters: filterList ?? [],
    resetFilters,
    handleFilterUpdate,
  });
  const { toggleWishlist, followedIdList } = useWishlist({ fpi });
  const { isLoggedIn, openLogin } = useAccounts({ fpi });

  const handleWishlistToggle = (data) => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    toggleWishlist(data);
  };

  return {
    breadcrumb,
    isProductCountDisplayed: pageConfig?.product_number,
    productCount: page?.item_total,
    isScrollTop: pageConfig?.back_top,
    title: "",
    description: pageConfig.description || "",
    filterList,
    sortList: sortOn,
    productList: productList || items,
    columnCount,
    isProductOpenInNewTab: pageConfig?.in_new_tab,
    isBrand: !pageConfig?.hide_brand,
    isSaleBadge: globalConfig?.show_sale_badge,
    isPrice: globalConfig?.show_price,
    isHdimgUsed: false,
    isResetFilterDisable,
    aspectRatio: getProductImgAspectRatio(globalConfig),
    isWishlistIcon: true,
    followedIdList,
    isProductLoading: apiLoading,
    isPageLoading,
    listingPrice,
    loadingOption: pageConfig.loading_options,
    paginationProps,
    sortModalProps,
    filterModalProps,
    isImageFill: globalConfig?.img_fill,
    imageBackgroundColor: globalConfig?.img_container_bg,
    showImageOnHover: globalConfig?.show_image_on_hover,
    imagePlaceholder: placeholder,
    onResetFiltersClick: resetFilters,
    onColumnCountUpdate: handleColumnCountUpdate,
    onFilterUpdate: handleFilterUpdate,
    onSortUpdate: handleSortUpdate,
    onFilterModalBtnClick: openFilterModal,
    onSortModalBtnClick: openSortModal,
    onWishlistClick: handleWishlistToggle,
    onViewMoreClick: handleLoadMoreProducts,
    onLoadMoreProducts: handleLoadMoreProducts,
  };
};

export default useProductListing;
