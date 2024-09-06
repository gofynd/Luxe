import React, { useState, useEffect } from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import styles from "./scroll-to-top.less";
import { isRunningOnClient } from "../../helper/utils";

const ScrollToTop = () => {
  const [isToTopActive, setIsToTopActive] = useState(false);

  useEffect(() => {
    if (isRunningOnClient) {
      const handleScroll = () => {
        setIsToTopActive(window.scrollY > 200);
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    window?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };
  return (
    isToTopActive && (
      <button
        type="button"
        className={styles["back-top"]}
        onClick={scrollToTop}
      >
        <SvgWrapper
          className={styles["arrow-top-icon"]}
          svgSrc="back-top"
        ></SvgWrapper>
        <span className={`${styles.text} ${styles["caption-normal"]} fontBody`}>
          Back to top
        </span>
      </button>
    )
  );
};

export default ScrollToTop;
