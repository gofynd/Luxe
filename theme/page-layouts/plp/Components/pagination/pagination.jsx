import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import styles from "./pagination.less";
import useProductListing from "../../useProductListing";
import { isRunningOnClient } from "../../../../helper/utils";

const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;

function Pagination({ value, fpi }) {
  const { setPageNo } = useProductListing(fpi);
  const { total, has_previous, has_next } = value;
  const location = useLocation();
  const [current, setCurrent] = useState(1);
  useEffect(() => {
    const d =
      parseInt(new URLSearchParams(location?.search).get("page_no"), 10) || 1;
    setCurrent(d);
    setPageNo(d);
    let tout = null;
    if (isRunningOnClient()) {
      tout = setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth", // Smooth scrolling behavior
        });
      }, 100);
    }
    return () => {
      clearTimeout(tout);
    };
  }, [location.pathname, location.search, setPageNo]);

  const getPageUrl = (pageNo) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page_no", pageNo);
    return `${location.pathname}?${searchParams.toString()}`;
  };

  const getStartPage = () => {
    let startingPage = 1;
    const maxStartingPage = total - PAGES_TO_SHOW + PAGE_OFFSET + 1;

    if (current >= maxStartingPage) {
      startingPage =
        maxStartingPage - PAGE_OFFSET > 0 ? maxStartingPage - PAGE_OFFSET : 1;
    } else if (current > PAGE_OFFSET) {
      startingPage = current - PAGE_OFFSET;
    }
    return startingPage;
  };

  function getPagesButton() {
    if (total && current) {
      return total > PAGES_TO_SHOW ? PAGES_TO_SHOW : total;
    }
  }

  return (
    <div className={styles.pagination}>
      <FDKLink
        to={getPageUrl(current - 1)}
        className={`${!has_previous ? styles.disable : ""}`}
      >
        <SvgWrapper
          className={`${!has_previous ? styles.disable : ""} ${
            styles["arrow-icon"]
          } ${styles["left-arrow"]}`}
          svgSrc="arrow-down"
        />
      </FDKLink>
      <div className={styles["page-container"]}>
        {[...Array(getPagesButton()).keys()].map((index) => (
          <FDKLink
            key={index}
            className={`${styles["page-btn"]} ${styles.b1} ${
              current === getStartPage() + index ? styles.active : ""
            }`}
            to={getPageUrl(getStartPage() + index)}
          >
            {getStartPage() + index}
          </FDKLink>
        ))}
      </div>
      <FDKLink
        className={`${!has_next ? styles.disable : ""}`}
        to={getPageUrl(current + 1)}
      >
        <SvgWrapper
          className={`${styles["arrow-icon"]} ${styles["right-arrow"]}`}
          svgSrc="arrow-down"
        />
      </FDKLink>
    </div>
  );
}

export default Pagination;
