import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PRODUCT_COMPARISON, SEARCH_PRODUCT } from "../../queries/compareQuery";
import { useSnackbar } from "../../helper/hooks";
import { debounce } from "../../helper/utils";

const useCompare = (fpi) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const initializeSlugs = () => {
    try {
      const storedSlugs = JSON.parse(localStorage?.getItem("compare_slugs"));
      return Array.isArray(storedSlugs) ? storedSlugs : [];
    } catch (err) {
      return [];
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [category, setCategory] = useState({});
  const [existingSlugs, setExistingSlugs] = useState(initializeSlugs);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const getCategoryKeyValue = (action) => {
    const key = Object.keys(action?.page?.query)?.[0];
    const value = action?.page?.query[key];
    return { key, value, firstValue: value?.[0] ?? "" };
  };

  const getCategoryUrl = (action) => {
    let url = `/${action?.page?.type}`;
    const { key, value } = getCategoryKeyValue(action);
    url = `${url}?${key}=${value?.join?.(`&${key}=`)}`;
    return url;
  };

  const fetchCompareProduct = () => {
    setIsLoading(true);
    return fpi
      .executeGQL(PRODUCT_COMPARISON, { slug: existingSlugs })
      .then((res) => {
        if (res?.data?.productComparison) {
          const items = res?.data?.productComparison?.items;
          const firstCategory = items[0]?.categories?.[0];
          const category = {
            url: getCategoryUrl(firstCategory?.action),
            name: firstCategory?.name,
            keyValue: getCategoryKeyValue(firstCategory?.action),
          };
          setCategory(category);
          setProducts(items ?? []);
          setAttributes(res?.data?.productComparison?.attributes_metadata);
        } else {
          showSnackbar("Something went wrong!", "error");
        }
        setIsLoading(false);
      });
  };

  const fetchSuggestions = () => {
    try {
      const values = { enableFilter: true };
      if (searchText) values.search = searchText;
      if (category?.keyValue?.firstValue)
        values.filterQuery = `${category.keyValue.key}:${category.keyValue.firstValue}`;

      fpi
        .executeGQL(SEARCH_PRODUCT, values, { skipStoreUpdate: true })
        .then((res) => {
          setSuggestions(res?.data?.products?.items);
        });
    } catch (error) {
      showSnackbar(
        "Something went wrong, unable to fetch suggestions!",
        "error"
      );
    }
  };

  const handleInputChange = debounce((t) => {
    setSearchText(t);
  }, 200);

  const handleAdd = (slug) => {
    const items = [slug, ...(existingSlugs ?? [])];
    localStorage?.setItem("compare_slugs", JSON.stringify(items));
    setExistingSlugs(items);
  };

  const handleRemove = (slug) => {
    const filteredSlug = existingSlugs?.filter((s) => s !== slug);
    localStorage?.setItem("compare_slugs", JSON.stringify(filteredSlug));
    setExistingSlugs(filteredSlug);
    if (products.length === 1) {
      setProducts([]);
      setCategory({});
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (existingSlugs.length) {
      fetchCompareProduct();
    }
    const query = existingSlugs.join("&id=");
    navigate(`${location.pathname}${query ? `?id=${query}` : ""}`, {
      replace: true,
    });
  }, [existingSlugs]);

  useEffect(() => {
    fetchSuggestions();
  }, [category?.keyValue?.firstValue, searchText]);

  useEffect(() => {
    const items = suggestions?.filter?.(
      (i) => !existingSlugs?.includes(i.slug)
    );
    setFilteredSuggestions(items);
  }, [suggestions, existingSlugs]);

  return {
    isLoading,
    products,
    attributes,
    category,
    handleAdd,
    handleRemove,
    showSearch,
    setShowSearch,
    searchText,
    handleInputChange,
    setSuggestions,
    filteredSuggestions,
  };
};

export default useCompare;
