import React, { useEffect, useState } from "react";

import { FDKLink } from "fdk-core/components";
import Loader from "../components/loader/loader";
// import ProductCard from "../components/product-card/product-card";
import styles from "../styles/categories.less";
import CardList from "../components/card-list/card-list";
import useCategories from "../page-layouts/categories/useCategories";
import { detectMobileWidth } from "../helper/utils";
import ScrollToTop from "../components/scroll-to-top/scroll-to-top";
import EmptyState from "../components/empty-state/empty-state";

function Categories({ fpi }) {
  const {
    categories,
    pageConfig,
    fetchAllCategories,
    globalConfig,
    isLoading,
  } = useCategories(fpi);
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    fetchAllCategories();
    setIsMobile(detectMobileWidth());
  }, []);
  //   const { page, items = [], loading } = product_lists || {};
  if (!isLoading && categories.length == 0) {
    return <EmptyState />;
  }

  return (
    <div
      className={`${styles.categories} ${styles.basePageContainer} ${styles.margin0auto} fontBody`}
    >
      <div
        className={`${styles.categories__breadcrumbs} ${styles.desktop} ${styles.captionNormal}`}
      >
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span className={styles.active}>Categories</span>
      </div>

      {!isLoading ? (
        <div>
          {pageConfig?.heading && (
            <h1 className={`${styles.categories__title} fontHeader`}>
              {pageConfig?.heading}
            </h1>
          )}
          {pageConfig?.description && (
            <div
              className={`${styles.categories__description} ${isMobile ? styles.b2 : styles.b1}`}
            >
              <p>{pageConfig?.description}</p>
            </div>
          )}
          <div className={styles.categories__cards}>
            <CardList
              cardList={categories}
              cardType="CATEGORIES"
              showOnlyLogo={!!pageConfig.logo_only}
              globalConfig={globalConfig}
            />
          </div>
        </div>
      ) : (
        <Loader />
      )}
      <div
        className={`${styles.categories__breadcrumbs} ${styles.mobile} ${styles.captionNormal}`}
      >
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span className={styles.active}>Categories</span>
      </div>
      {!!pageConfig?.back_top && <ScrollToTop />}
    </div>
  );
}
// Brands.serverFetch = async ({ fpi }) => {
//   fpi.executeGraphQL(BRAND_LISTING);
// };

export const settings = JSON.stringify({
  props: [
    {
      type: "text",
      id: "heading",
      default: "",
      label: "Heading",
    },
    {
      type: "textarea",
      id: "description",
      default: "",
      label: "Description",
    },
    {
      type: "checkbox",
      id: "back_top",
      label: "Back to top",
      default: true,
    },
  ],
});

export const sections = JSON.stringify([]);

export default Categories;
