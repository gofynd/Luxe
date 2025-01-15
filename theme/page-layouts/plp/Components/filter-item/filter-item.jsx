import React, { useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import FilterList from "../filter-list/filter-list";
import styles from "./filter-item.less";

function FilterItem({ filter, isMobileView, updateFilter }) {
  const [isActive, setIsActive] = useState(true);

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={styles.filter}>
      {filter.values.length > 0 && (
        <button
          type="button"
          className={`${styles.filter__title} ${styles.flexAlignCenter} ${styles.justifyBetween}`}
          onClick={toggleActive}
        >
          <p className={`${styles.name} b2`}>{filter.key.display}</p>
          <div>
            <SvgWrapper
              className={`${styles["arrow-icon"]} ${
                isActive ? styles.isOpen : ""
              }`}
              svgSrc="arrow-down"
            />
          </div>
        </button>
      )}
      <div
        className={`${styles.filter__list} ${!isActive ? styles.collapse : ""} 
        }`}
      >
        <FilterList
          filter={filter}
          isMobileView={isMobileView}
          updateFilter={updateFilter}
        />
      </div>
    </div>
  );
}

export default FilterItem;
