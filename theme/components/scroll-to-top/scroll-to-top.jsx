import React, { useState, useEffect } from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import styles from "./scroll-to-top.less";
import { isRunningOnClient } from "../../helper/utils";
import { useGlobalTranslation } from "fdk-core/utils";

const ScrollToTop = () => {
  const { t } = useGlobalTranslation("translation");
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
          {t("resource.common.back_to_top")}
        </span>
      </button>
    )
  );
};

export default ScrollToTop;
