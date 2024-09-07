import React, { useState, useEffect } from "react";

import { FDKLink } from "fdk-core/components";
import styles from "../styles/brands.less";
import useBrandListing from "../page-layouts/brands/useBrandListing";
import CardList from "../components/card-list/card-list";
import InfiniteLoader from "../components/infinite-loader/infinite-loader";
import ScrollToTop from "../components/scroll-to-top/scroll-to-top";
import { detectMobileWidth } from "../helper/utils";
import { BRAND_LISTING } from "../queries/brandsQuery";

function Brands({ fpi }) {
  const { brands, isLoading, pageConfig, pageData, fetchBrands, globalConfig } =
    useBrandListing(fpi);
  const { title, description, infinite_scroll, logo_only, back_top } =
    pageConfig ?? {};

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);

  return (
    <div
      className={`${styles.brands} ${styles.basePageContainer} ${styles.margin0auto} fontBody`}
    >
      <div
        className={`${styles.brands__breadcrumbs} ${styles.desktop} ${styles.captionNormal}`}
      >
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span className={styles.active}>Brands</span>
      </div>
      <div>
        {title && (
          <h1 className={`${styles.brands__title} fontHeader`}>{title}</h1>
        )}
        {description && (
          <div
            className={`${styles.brands__description} ${isMobile ? styles.b2 : styles.b1}`}
          >
            <p>{description}</p>
          </div>
        )}
        <div className={styles.brands__cards}>
          <InfiniteLoader
            isLoading={isLoading}
            infiniteLoaderEnabled={infinite_scroll}
            hasNext={pageData?.has_next}
            loadMore={fetchBrands}
          >
            <CardList
              cardList={brands || []}
              cardType="BRANDS"
              showOnlyLogo={!!logo_only}
              globalConfig={globalConfig}
            />
          </InfiniteLoader>
        </div>
      </div>
      <div
        className={`${styles.brands__breadcrumbs} ${styles.mobile} ${styles.captionNormal}`}
      >
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span className={styles.active}>Brands</span>
      </div>
      {!!back_top && <ScrollToTop />}
    </div>
  );
}
// Brands.serverFetch = async ({ fpi }) => {
//   fpi.executeGraphQL(BRAND_LISTING);
// };

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "infinite_scroll",
      label: "Infinity Scroll",
      default: true,
      info: "If it is enabled, view more button will not be shown, only on scroll products will be displayed",
    },
    {
      type: "checkbox",
      id: "back_top",
      label: "Back to top",
      default: true,
    },
    {
      type: "checkbox",
      id: "logo_only",
      default: false,
      label: "Only Logo",
      info: "Show Logo of brands",
    },
    {
      type: "text",
      id: "title",
      default: "",
      label: "Heading",
    },
    {
      type: "textarea",
      id: "description",
      default: "",
      label: "Description",
    },
  ],
});

Brands.serverFetch = async ({ fpi }) => {
  try {
    const values = {
      pageNo: 1,
      pageSize: 12,
    };
    return fpi.executeGQL(BRAND_LISTING, values);
  } catch (error) {
    console.log({ error });
  }
};

export default Brands;
