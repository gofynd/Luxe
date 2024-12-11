import React from "react";
import Compare from "fdk-react-templates/page-layouts/compare/compare";
import useCompare from "./useCompare";
import styles from "./compare.less";
import "fdk-react-templates/page-layouts/compare/compare.css";

function CompareProducts({ fpi }) {
  const compareProps = useCompare(fpi);

  return (
    <div
      className={`${styles.compare} ${styles.basePageContainer} ${styles.margin0auto} ${styles.fontBody}`}
    >
      <Compare {...compareProps} />
    </div>
  );
}

export default CompareProducts;
