import React, { useState } from "react";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../../../../helper/utils";
import styles from "./sort.less";

function Sort({ filteredSorts = [], customClass, updateSelection }) {
  const [sortOpen, setSortOpen] = useState(false);
  function selectedSort() {
    if (filteredSorts?.length) {
      const selectedFilter = filteredSorts.filter((x) => x.is_selected);
      if (selectedFilter.length > 0) {
        return selectedFilter[0].name;
      }
      return filteredSorts[1].name;
    }
  }

  function checkMobile() {
    if (isRunningOnClient()) {
      return window.innerWidth > 480;
    }
    return false;
  }
  function closeSortOption(event) {
    if (event && event.target.id !== "sortopt") {
      setSortOpen(false);
    }
  }

  function updateSortOption(event, sortValue) {
    updateSelection(sortValue);
    closeSortOption(event);
  }

  return (
    <OutsideClickHandler onOutsideClick={(e) => closeSortOption(e)}>
      <div className={` ${styles.items} ${styles["sort-list"]} ${customClass}`}>
        <span className={` ${styles["dd-label"]} ${styles.b1}`}>Sort by: </span>
        <button
          type="button"
          className={`${styles.selected} ${styles.b1} ${styles.flexAlignCenter} ${styles.justifyStart}`}
          onClick={() => setSortOpen(!sortOpen)}
        >
          <span className={styles.selectedSort}> {selectedSort()} </span>
          <SvgWrapper
            className={`${styles.icon} ${styles["arrow-icon"]} ${
              styles.open && styles.sortOpen
            }`}
            svgSrc="arrow-down"
          />
        </button>

        {sortOpen && checkMobile() && (
          <ul className={styles.menu} id="sortopt">
            {filteredSorts?.map((sortType, index) => (
              <li key={sortType.value + index}>
                <button
                  type="button"
                  onClick={(event) => updateSortOption(event, sortType.value)}
                >
                  {sortType.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </OutsideClickHandler>
  );
}

export default Sort;
