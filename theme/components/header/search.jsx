import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isRunningOnClient, debounce } from "../../helper/utils";

import FyImage from "../core/fy-image/fy-image";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

import styles from "./styles/search.less";
import useHeader from "./useHeader";
import { SEARCH_PRODUCT } from "../../queries/headerQuery";

function Search({ screen, onSearchOpened, globalConfig, fpi }) {
  const [searchData, setSearchData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const isDoubleRowHeader = globalConfig?.header_layout === "double";

  const openSearch = () => {
    setShowSearch(!showSearch);

    if (!showSearch) {
      // onSearchOpened();
      setTimeout(() => {
        if (isRunningOnClient()) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const closeSearch = () => {
    setShowSearch(false);
    setSearchText("");
    setIsSearchFocused(false);
    if (inputRef?.current) inputRef.current.value = "";
  };

  const getEnterSearchData = (searchText) => {
    const payload = {
      pageNo: 1,
      search: searchText,
      filterQuery: "",
      enableFilter: false,
      sortOn: "",
      first: 8,
      after: "",
      pageType: "number",
    };
    fpi
      .executeGQL(SEARCH_PRODUCT, payload, { skipStoreUpdate: true })
      .then((res) => {
        setSearchData(res?.data?.products?.items);
      });
  };

  const setEnterSearchData = debounce((e) => {
    setSearchText(e.target.value);
    getEnterSearchData(e.target.value);
  }, 250);
  const redirectToProduct = (link) => {
    navigate(link);
    closeSearch();
    setSearchText("");
    if (inputRef?.current) inputRef.current.value = "";
  };

  const getProductSearchSuggestions = (results) => results?.slice(0, 4);

  const checkInput = () => {
    if (searchText) {
      return;
    }
    setIsSearchFocused(false);
  };

  const getDisplayData = (product) => {
    let displayName;

    if (screen === "mobile" && product.name.length > 40) {
      displayName = `${product.name.substring(0, 40)}...`;
    } else if (product.name.length > 95) {
      displayName = `${product.name.substring(0, 95)}...`;
    } else {
      displayName = product.name;
    }

    // Use displayName in your JSX
    return <div>{displayName}</div>;
  };

  const getImage = (product) => {
    if (Array.isArray(product?.media)) {
      return product.media?.find((item) => item.type === "image") || "";
    }
    return "";
  };

  return (
    <div
      className={
        isDoubleRowHeader
          ? styles["double-row-search"]
          : styles["single-row-search"]
      }
    >
      <button onClick={openSearch} aria-label="search" type="button">
        <SvgWrapper
          className={`${styles.searchIcon} ${styles.headerIcon}`}
          svgSrc={isDoubleRowHeader ? "search" : "single-row-search"}
        />
      </button>
      <div>
        <motion.div
          className={`${styles.search}`}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: showSearch ? 1 : 0,
            opacity: showSearch ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            transformOrigin: "top",
          }}
        >
          <div className={styles.search__wrapper}>
            <div className={styles.search__input}>
              <input
                ref={inputRef}
                className={styles["search__input--text"]}
                type="text"
                id="searchInput"
                autoComplete="off"
                defaultValue={searchText}
                placeholder={isDoubleRowHeader ? "Search" : ""}
                onChange={(e) => setEnterSearchData(e)}
                onKeyUp={(e) =>
                  e.key === "Enter" &&
                  searchData?.length > 0 &&
                  redirectToProduct(`/products/?q=${searchText}`)
                }
                onFocus={() => setIsSearchFocused(true)}
                onBlur={checkInput}
                aria-labelledby="search-input-label"
                aria-label="search-input-label"
              />
              <SvgWrapper
                className={styles["search__input--search-icon"]}
                svgSrc="search"
                onClick={() => getEnterSearchData(searchText)}
              />
              {/* eslint-disable jsx-a11y/label-has-associated-control */}
              <label
                htmlFor="searchInput"
                id="search-input-label"
                className={`${styles["search__input--label"]} ${styles.b1} ${
                  styles.fontBody
                } ${isSearchFocused ? styles.active : ""}`}
                style={{ display: !isDoubleRowHeader ? "block" : "none" }}
              >
                Search
              </label>
            </div>
            <SvgWrapper
              className={`${styles["search--closeIcon"]} ${styles.headerIcon}`}
              svgSrc="close"
              onClick={closeSearch}
            />
            <div
              className={styles.search__suggestions}
              style={{ display: searchText ? "block" : "none" }}
            >
              <div className={styles["search__suggestions--products"]}>
                <div
                  className={`${styles.b1} ${styles["search__suggestions--title"]} ${styles.fontBody}`}
                  style={{
                    display:
                      !isDoubleRowHeader && searchData?.length > 0
                        ? "block"
                        : "none",
                  }}
                >
                  PRODUCTS
                </div>
                <ul
                  style={{
                    display: searchData?.length > 0 ? "block" : "none",
                  }}
                >
                  {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
                  {getProductSearchSuggestions(searchData).map(
                    (product, index) => (
                      <li
                        key={index}
                        className={`${styles["search__suggestions--item"]} ${styles.flexAlignCenter}`}
                        onClick={() =>
                          redirectToProduct(`/product/${product.slug}`)
                        }
                      >
                        <div className={styles.productThumb}>
                          <FyImage
                            src={getImage(product)?.url}
                            alt={getImage(product)?.alt}
                            sources={[{ width: 56 }]}
                            globalConfig={globalConfig}
                          />
                        </div>
                        <div
                          className={`${styles.productTitle} ${styles.b1} ${styles.fontBody}`}
                        >
                          {getDisplayData(product)}
                        </div>
                      </li>
                    )
                  )}
                </ul>
                <ul
                  style={{
                    display:
                      searchData?.length === 0 && showSearch ? "block" : "none",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      redirectToProduct(`/products/?q=${searchText}`)
                    }
                  >
                    <li
                      className={`${styles["search__suggestions--item "]} ${styles.flexAlignCenter} ${styles.noResult} ${styles.fontBody}`}
                    >
                      No match found
                    </li>
                  </button>
                </ul>
                <div
                  className={styles["search__suggestions--button"]}
                  style={{
                    display: searchData?.length > 0 ? "block" : "none",
                  }}
                >
                  <button
                    type="button"
                    className={`${styles.btnLink} fontBody`}
                    onClick={() =>
                      redirectToProduct(`/products/?q=${searchText}`)
                    }
                  >
                    <span>VIEW ALL</span>
                    <SvgWrapper
                      className={styles.showMoreIcon}
                      svgSrc="arrow-left-long"
                      style={{
                        display:
                          globalConfig?.header_layout === "single"
                            ? "block"
                            : "none",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Search;
