import React from "react";
import { FDKLink } from "fdk-core/components";
import FyButton from "@gofynd/theme-template/components/core/fy-button/fy-button";
import styles from "./page-not-found.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import "@gofynd/theme-template/components/core/fy-button/fy-button.css";

function PageNotFound({ title }) {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.container}>
        <SvgWrapper svgSrc="notFound" />
        <h3 className={`${styles.fontHeader} ${styles.title}`}>
          Oops! Looks like the page you&apos;re looking for doesn&apos;t exist
        </h3>
        <FDKLink to="/">
          <FyButton
            className="btnPrimary"
            variant="outlined"
            size="large"
            color="secondary"
            fullWidth={true}
          >
            Return to Homepage
          </FyButton>
        </FDKLink>
      </div>
    </div>
  );
}
PageNotFound.defaultProps = {
  title: "Page Not Found",
};

export default PageNotFound;
