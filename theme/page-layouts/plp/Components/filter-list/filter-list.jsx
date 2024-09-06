import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import InputRangeSlider from "../range-slider/range-slider";
import styles from "./filter-list.less";

function FilterList({
  filter,
  isMobileView = false,
  reset,
  updateFilter,
  sliderQuery,
  customClass,
}) {
  const [searchText, setSearchText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const MAX_ITEM_COUNT = 7;
  const navigate = useNavigate();

  const getFilteredItems = (searchStr) => {
    if (!searchStr) {
      return filter.values;
    }
    return filter.values.filter(
      (item) =>
        item.display.toLowerCase().indexOf(searchStr.toLowerCase()) !== -1
    );
  };

  const expandFilter = () => {
    if (filter.key.name === "category" || filter.key.name === "brand") {
      setShowPopup(true);
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const filterClicked = (filterItem) => {
    // if (!isMobileView) {
    //   navigate(filterItem.url);
    //   return;
    // }
    updateFilter(filterItem, filter);
  };

  const onSliderQuery = (event, sliderData) => {
    if (!isMobileView) {
      sliderData.replaceQuery(event, filter);
      return;
    }
    sliderQuery(event);
  };

  const getGroupedValues = () => {
    const groupedFilterValues = {
      "#": [],
      A: [],
      B: [],
      C: [],
      D: [],
      E: [],
      F: [],
      G: [],
      H: [],
      I: [],
      J: [],
      K: [],
      L: [],
      M: [],
      N: [],
      O: [],
      P: [],
      Q: [],
      R: [],
      S: [],
      T: [],
      U: [],
      V: [],
      W: [],
      X: [],
      Y: [],
      Z: [],
    };

    getFilteredItems(searchText).forEach((item) => {
      const firstChar = item.display[0].toUpperCase();
      if (!groupedFilterValues[firstChar]) {
        groupedFilterValues["#"].push(item);
      } else {
        groupedFilterValues[firstChar].push(item);
      }
    });
    return groupedFilterValues;
  };

  const showViewMore = filter.values.length > MAX_ITEM_COUNT;
  const showSearch =
    filter.key.name === "category" || filter.key.name === "brand";

  // const filteredValues = getFilteredItems(searchText);
  const groupedValues = getGroupedValues();

  function getFilteredValues() {
    const filteredItem = getFilteredItems(searchText);
    if (!showViewMore) {
      return filteredItem;
    }
    return isExpanded ? filteredItem : filteredItem.slice(0, MAX_ITEM_COUNT);
  }

  return (
    <div
      className={`${styles.filter__list} ${
        !filter.isOpen ? styles.open : ""
      } ${customClass}`}
    >
      {/* Multivalued filter */}
      {filter.key.kind === "multivalued" && (
        <div>
          {showSearch && (
            <div
              className={`${styles["filter__list--search"]} ${styles.flexAlignCenter}`}
            >
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className={`${styles.text}`}
              />
              <SvgWrapper
                className={styles["search-icon"]}
                svgSrc="searchFilter"
              />
            </div>
          )}
          <div className={styles["filter-items-container"]}>
            <ul className={`${styles["filter__list--items"]}`} id="scroll-bar">
              {getFilteredValues().map((filterItem, index) => (
                <li
                  key={`filter-${index}`}
                  className={styles["filter__list--item"]}
                >
                  <button
                    type="button"
                    className={`${styles.filter__item} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                    onClick={() => filterClicked(filterItem)}
                  >
                    <div>
                      {filterItem.is_selected && (
                        <SvgWrapper
                          className={`${styles.icon} ${styles["checkbox-icon"]} ${styles.selected}`}
                          svgSrc="checkbox-selected"
                        />
                      )}
                      {!filterItem.is_selected && (
                        <SvgWrapper
                          svgSrc="checkbox"
                          className={`${styles.icon} ${styles["checkbox-icon"]}`}
                        />
                      )}
                    </div>
                    {filter.key.name === "primary_color" && (
                      <div
                        className={`
                  ${styles["filter__item--color"]} ${
                    filterItem.value.toLowerCase() === "none"
                      ? styles.multiIcon
                      : ""
                  }
                `}
                        style={{ backgroundColor: `#${filterItem.value}` }}
                      />
                    )}
                    <div
                      className={`${styles["filter__item--value"]} ${
                        styles["caption-normal"]
                      } ${filterItem.is_selected ? styles.active : ""}`}
                    >
                      {filterItem.display}
                    </div>
                    <div
                      className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                    >
                      ({filterItem.count || 0})
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {showViewMore && (
            <button
              type="button"
              className={`${styles["view-more"]} ${styles.flexAlignCenter}`}
              onClick={expandFilter}
            >
              <span className={styles.label}>
                {isExpanded && <span>View Less</span>}
                {!isExpanded && <span>View More</span>}
              </span>
              <SvgWrapper
                className={`${styles["arrow-icon"]} ${
                  isExpanded ? styles.expanded : ""
                }`}
                svgSrc="arrow-down"
              />
            </button>
          )}
        </div>
      )}

      {/* Range filter */}
      {filter.key.kind === "range" && filter.values.length > 0 && (
        <div className={styles["filter-items-container"]}>
          <div className={styles["filter__list--items"]}>
            {/* <InputRangeSlider
              filterItem={filter}
              reset={reset}
              showSliderText={false}
              showTextBox
              onSliderQuery={(e) => onSliderQuery(e, sliderData)}
            /> */}
          </div>
        </div>
      )}

      {/* Singlevalued filter */}
      {filter.key.kind === "singlevalued" && filter.values.length > 0 && (
        <div className={styles["filter-items-container"]}>
          <div className={styles["filter__list--items"]}>
            <div className={styles["filter__list--item"]}>
              <button
                type="button"
                className={`${styles.filter__item} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                onClick={() => filterClicked(filter.values[0])}
              >
                <div>
                  {filter.values[0].is_selected && (
                    <SvgWrapper
                      className={`${styles.icon} ${styles["checkbox-icon"]} ${styles.selected}`}
                      svgSrc="checkbox-selected"
                    />
                  )}
                  {!filter.values[0].is_selected && (
                    <SvgWrapper
                      svgSrc="checkbox"
                      className={`${styles.icon} ${styles["checkbox-icon"]}`}
                    />
                  )}
                </div>

                <div
                  className={`${styles["filter__item--value"]} ${
                    styles["caption-normal"]
                  } ${
                    filter.values[0].is_selected === true ? styles.active : ""
                  }`}
                >
                  {filter.values[0].display}
                </div>
                <div
                  className={`${styles["filter__item--count"]} ${styles["caption-normal"]} `}
                >
                  ({filter.values[0].count || 0})
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter popup */}
      {showPopup && (
        <div className={styles.filter__popup}>
          <div
            className={`${styles["filter__popup--header"]} ${styles.flexAlignCenter}`}
          >
            <div className={styles.search}>
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search"
                className={styles.search__input}
              />
            </div>
            <ul className={styles.alphabets}>
              {Object.keys(groupedValues).map((alphabet, index) => (
                <li
                  key={`alphabet-${index}`}
                  className={`${
                    groupedValues[alphabet].length === 0 ? styles.disabled : ""
                  }`}
                >
                  <a href={`#${alphabet}`}>{alphabet}</a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={styles["close-icon"]}
              onClick={closePopup}
              aria-label="Close Modal"
            >
              <SvgWrapper svgSrc="close" />
            </button>
          </div>
          <ul className={styles["filter__popup--content"]}>
            {Object.keys(groupedValues).map((alphabet) => (
              <React.Fragment key={alphabet}>
                {groupedValues[alphabet].length !== 0 && (
                  <li id={alphabet} className={styles["alphabet-label"]}>
                    <h4>{alphabet}</h4>
                  </li>
                )}
                {groupedValues[alphabet].map((filterItem) => (
                  <li key={`${alphabet}${filterItem.value}`} className="filter">
                    <fdk-link link={filterItem.url}>
                      <div
                        className={`${styles.filter__item} ${styles.flexAlignCenter} ${styles["caption-normal"]}`}
                      >
                        <div>
                          <SvgWrapper
                            className={`${styles.icon} ${styles["checkbox-icon"]}`}
                            svgSrc={
                              filterItem.is_selected
                                ? "checkbox-selected"
                                : "checkbox"
                            }
                          />
                        </div>
                        <div
                          className={`${styles["filter__item--value"]} ${
                            styles["caption-normal"]
                          } ${filterItem.is_selected ? styles.active : ""}`}
                        >
                          {filterItem.display}
                        </div>
                        <div
                          className={`${styles["filter__item--count"]} ${styles["caption-normal"]}`}
                        >
                          ({filterItem.count || 0})
                        </div>
                      </div>
                    </fdk-link>
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </div>
      )}

      {/* Overlay */}
      {/* eslint-disable jsx-a11y/no-static-element-interactions */}
      {showPopup && <div className={styles.overlay} onClick={closePopup} />}
    </div>
  );
}

export default FilterList;
