import React, { useState, useEffect } from "react";
import { FDKLink } from "fdk-core/components";
import styles from "./empty-state.less";
import { detectMobileWidth } from "../../helper/utils";

const EmptyState = ({
  title = "No Data Found",
  description,
  btnLink = "/",
  btnTitle = "RETURN TO HOMEPAGE",
  iconSrc,
}) => {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);
  return (
    <div className={`${styles.error} fontBody`}>
      {iconSrc && <img src={iconSrc} alt="" />}
      <h3 className={`${styles.heading} fontHeader`}>{title}</h3>
      {description && (
        <div
          className={`${styles.description} ${isMobile ? styles.b2 : styles.b1}`}
        >
          <p>{description}</p>
        </div>
      )}
      <FDKLink
        to={btnLink}
        className={`${styles.button} ${styles["btn-secondary"]}`}
      >
        {btnTitle}
      </FDKLink>
    </div>
  );
};

export default EmptyState;
