import React, { useEffect, useState, useMemo } from "react";
import { useGlobalStore, useGlobalTranslation } from "fdk-core/utils";
import { useLocation, useNavigate } from "react-router-dom";
import useSortModal from "./useSortModal";
import useFilterModal from "./useFilterModal";
import { PLP_PRODUCTS } from "../../queries/plpQuery";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../helper/utils";
import placeholder from "../../assets/images/placeholder3x4.png";
import useAddToCartModal from "./useAddToCartModal";
import {
  useAccounts,
  useWishlist,
  useThemeConfig,
  useThemeFeature,
} from "../../helper/hooks";
import useInternational from "../../components/header/useInternational";

const PAGE_SIZE = 12;
const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;

const useProductListing = ({ fpi }) => {
  const { t } = useGlobalTranslation("translation");
  const location = useLocation();
  const navigate = useNavigate();
  const { i18nDetails, defaultCurrency } = useInternational({
    fpi,
  });

  const { globalConfig, pageConfig, listingPrice } = useThemeConfig({
    fpi,
    page: "product-listing",
  });
  const { isInternational } = useThemeFeature({ fpi });

  const { isPlpSsrFetched, customProductList: productsListData } =
    useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);

  const { filters = [], sort_on: sortOn, page, items } = productsListData || {};

  const [productList, setProductList] = useState(items || undefined);
  const currentPage = productsListData?.page?.current ?? 1;
  const [apiLoading, setApiLoading] = useState(!isPlpSsrFetched);
  const [isPageLoading, setIsPageLoading] = useState(!isPlpSsrFetched);
  const { user_plp_columns } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) ?? {};
  const [columnCount, setColumnCount] = useState(
    user_plp_columns ?? {
      desktop: Number(pageConfig?.grid_desktop) || 2,
      tablet: Number(pageConfig?.grid_tablet) || 3,
      mobile: Number(pageConfig?.grid_mob) || 1,
    }
  );
  const [isResetFilterDisable, setIsResetFilterDisable] = useState(false);

  const isAlgoliaEnabled = globalConfig?.algolia_enabled;

  const breadcrumb = useMemo(
    () => [{ label: t("resource.common.breadcrumb.home"), link: "/" }, { label: t("resource.common.breadcrumb.products") }],
    []
  );

  const isClient = useMemo(() => isRunningOnClient(), []);

  const addToCartModalProps = useAddToCartModal({ fpi, pageConfig });

  const pincode = useMemo(() => {
    if (!isClient) {
      return "";
    }
    return (
      pincodeDetails?.localityValue ||
      locationDetails?.pincode ||
      locationDetails?.sector ||
      ""
    );
  }, [pincodeDetails, locationDetails]);

  useEffect(() => {
    fpi.custom.setValue("isPlpSsrFetched", false);
  }, []);

  useEffect(() => {
    if (!isPlpSsrFetched || locationDetails) {
      const searchParams = isClient
        ? new URLSearchParams(location?.search)
        : null;
      const pageNo = Number(searchParams?.get("page_no"));
      const payload = {
        pageType: "number",
        first: PAGE_SIZE,
        filterQuery: appendDelimiter(searchParams?.toString()) || undefined,
        sortOn: searchParams?.get("sort_on") || undefined,
        search: searchParams?.get("q") || undefined,
      };

      const loadingOptions =
        pageConfig?.loading_options === undefined
          ? "pagination"
          : pageConfig?.loading_options;

      if (loadingOptions === "pagination") payload.pageNo = pageNo || 1;

      fetchProducts(payload);

      const resetableFilterKeys =
        Array.from(searchParams?.keys?.() ?? [])?.filter?.(
          (i) => !["q", "sort_on", "page_no"].includes(i)
        ) ?? [];
      setIsResetFilterDisable(!resetableFilterKeys?.length);
    }
  }, [location?.search, pincode, locationDetails]);

  const convertQueryParamsForAlgolia = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(location?.search);
    const filterParams = [];

    const skipKeys = new Set(["sort_on", "siteTheme", "page_no", "q"]);

    params.forEach((value, key) => {
      if (skipKeys.has(key)) return;

      const decodedValue = decodeURIComponent(value);

      // Check if the key already exists in the filterParams
      const existingParam = filterParams.find((param) =>
        param.startsWith(`${key}:`)
      );

      if (existingParam) {
        // If the key already exists, append the new value using "||"
        const updatedParam = `${existingParam}||${decodedValue}`;
        filterParams[filterParams.indexOf(existingParam)] = updatedParam;
      } else {
        // Otherwise, add the key-value pair
        filterParams.push(`${key}:${decodedValue}`);
      }
    });

    // Join all the filters with ":::"
    return filterParams.join(":::");
  };

  const fetchProducts = (payload, append = false) => {
    setApiLoading(true);

    if (isAlgoliaEnabled) {
      const BASE_URL = `${window.location.origin}/ext/algolia/application/api/v1.0/products`;

      const url = new URL(BASE_URL);
      url.searchParams.append(
        "page_id",
        payload?.pageNo === 1 || !payload?.pageNo ? "*" : payload?.pageNo - 1
      );
      url.searchParams.append("page_size", payload?.first);

      const filterQuery = convertQueryParamsForAlgolia();

      if (payload?.sortOn) {
        url.searchParams.append("sort_on", payload?.sortOn);
      }
      if (filterQuery) {
        url.searchParams.append("f", filterQuery);
      }
      if (payload?.search) {
        url.searchParams.append("q", payload?.search);
      }

      fetch(url, {
        headers: {
          "x-location-detail": JSON.stringify({
            country_iso_code: i18nDetails?.countryCode || "IN",
          }),
          "x-currency-code":
            i18nDetails?.currency?.code || defaultCurrency?.code,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const productDataNormalization = data.items?.map((item) => ({
            ...item,
            media: item.medias,
          }));

          data.page.current = payload?.pageNo;

          const productList = {
            filters: data?.filters,
            items: productDataNormalization,
            page: data?.page,
            sort_on: data?.sort_on,
          };
          setApiLoading(false);
          fpi.custom.setValue("customProductList", productList);
          if (append) {
            setProductList((prevState) => {
              return prevState.concat(productList?.items || []);
            });
          } else {
            setProductList(productList?.items || []);
          }
        })
        .finally(() => {
          setApiLoading(false);
          setIsPageLoading(false);
        });
    } else {
      fpi
        .executeGQL(PLP_PRODUCTS, payload, { skipStoreUpdate: false })
        .then((res) => {
          if (append) {
            setProductList((prevState) => {
              return prevState.concat(res?.data?.products?.items || []);
            });
          } else {
            setProductList(res?.data?.products?.items || []);
          }
          fpi.custom.setValue("customProductList", res?.data?.products);
          setApiLoading(false);
        })
        .finally(() => {
          setApiLoading(false);
          setIsPageLoading(false);
        });
    }
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
      search: searchParams?.get("q") || undefined,
    };
    fetchProducts(payload, true);
  };

  function appendDelimiter(queryString) {
    const searchParams = isClient ? new URLSearchParams(queryString) : null;
    const params = Array.from(searchParams?.entries() || []);

    const result = params.reduce((acc, [key, value]) => {
      if (key !== "page_no" && key !== "sort_on" && key !== "q") {
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
      if (value) searchParams?.set(name, value);
      else searchParams?.delete(name);
    } else if (!searchParams?.has(name, value) && !is_selected) {
      searchParams?.append(name, value);
    } else {
      searchParams?.delete(name, value);
    }
    searchParams?.delete("page_no");
    navigate?.(location?.pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""));
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
    navigate?.(location?.pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""));
  };

  function resetFilters() {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    filters?.forEach((filter) => {
      searchParams?.delete(filter.key.name);
    });
    searchParams?.delete("page_no");
    navigate?.(location?.pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""));
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
    selectedFilters,
    sortList: sortOn,
    productList: productList || items || [],
    columnCount,
    isProductOpenInNewTab: pageConfig?.in_new_tab,
    isBrand: !pageConfig?.hide_brand,
    isSaleBadge: globalConfig?.show_sale_badge,
    isPrice: globalConfig?.show_price,
    globalConfig,
    isHdimgUsed: false,
    isResetFilterDisable,
    aspectRatio: getProductImgAspectRatio(globalConfig),
    isWishlistIcon: true,
    followedIdList,
    isProductLoading: apiLoading,
    banner: {
      desktopBanner: pageConfig?.desktop_banner,
      mobileBanner: pageConfig?.mobile_banner,
      redirectLink: pageConfig?.banner_link,
    },
    isPageLoading,
    listingPrice,
    loadingOption: pageConfig.loading_options,
    paginationProps,
    sortModalProps,
    filterModalProps,
    addToCartModalProps,
    isImageFill: globalConfig?.img_fill,
    imageBackgroundColor: globalConfig?.img_container_bg,
    showImageOnHover: globalConfig?.show_image_on_hover,
    imagePlaceholder: placeholder,
    showAddToCart:
      !isInternational &&
      pageConfig?.show_add_to_cart &&
      !globalConfig?.disable_cart,
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
