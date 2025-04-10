import React from "react";
import useCompare from "./useCompare";
import styles from "./compare.less";
import Compare from "fdk-react-templates/page-layouts/compare/compare";
import "fdk-react-templates/page-layouts/compare/compare.css";

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
