import React from "react";
import Compare from "@gofynd/theme-template/page-layouts/compare/compare";
import useCompare from "./useCompare";
import styles from "./compare.less";
import "@gofynd/theme-template/page-layouts/compare/compare.css";

function CompareProducts({ fpi }) {
  const compareProps = useCompare(fpi);

  return (
    <div
      className={`${styles.compare} basePageContainer margin0auto ${styles.fontBody}`}
    >
      <Compare {...compareProps} />
    </div>
  );
}

export default CompareProducts;
