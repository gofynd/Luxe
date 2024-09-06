import React from "react";
import styles from "./loader.less";

function Loader(props) {
  return (
    <div className={styles["page-loader-container"]}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loader;
