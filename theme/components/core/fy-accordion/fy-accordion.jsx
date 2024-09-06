import React, { useState } from "react";
import SvgWrapper from "../svgWrapper/SvgWrapper";
import styles from "./fy-accordion.less";

function FyAccordion({ isOpen: initialIsOpen, children }) {
  const [isOpenState, setIsOpenState] = useState(initialIsOpen);

  const toggleAccordion = () => {
    setIsOpenState(!isOpenState);
  };

  return (
    <div className={styles.accordion}>
      <button
        type="button"
        className={`${styles.flexAlignCenter} ${styles.justifyBetween} ${styles.accordionHead}`}
        onClick={toggleAccordion}
      >
        <div>{children[0]}</div>
        <div className={styles.accordion__icon}>
          <SvgWrapper svgSrc={isOpenState ? "minus" : "add"} />
        </div>
      </button>
      <div
        className={styles.accordion__content}
        style={{ display: isOpenState ? "block" : "none" }}
      >
        {children[1]}
      </div>
    </div>
  );
}

export default FyAccordion;
