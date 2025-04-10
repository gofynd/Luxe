import React, { useState, useEffect } from "react";
// import ProductCard from "../components/product-card/product-card";
import styles from "../styles/brands.less";
import useBrandListing from "../page-layouts/brands/useBrandListing";
import CardList from "../components/card-list/card-list";
import InfiniteLoader from "../components/infinite-loader/infinite-loader";
import ScrollToTop from "../components/scroll-to-top/scroll-to-top";
import { detectMobileWidth } from "../helper/utils";
import { BRAND_LISTING } from "../queries/brandsQuery";
import { FDKLink } from "fdk-core/components";
import { useGlobalTranslation } from "fdk-core/utils";
import EmptyState from "../components/empty-state/empty-state";

function Brands({ fpi }) {
  const { t } = useGlobalTranslation("translation");
  const { brands, isLoading, pageConfig, pageData, fetchBrands, globalConfig } =
    useBrandListing(fpi);
  const { title, description, infinite_scroll, logo_only, back_top } =
    pageConfig ?? {};

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);
  //   const { page, items = [], loading } = product_lists || {};

  if (!isLoading && !brands?.length) {
    return <EmptyState title={t("resource.brand.no_brand_found")} />;
  }

  return (
    <div className={`${styles.brands} basePageContainer margin0auto fontBody`}>
      <div className={`${styles.brands__breadcrumbs} captionNormal`}>
        <span>
          <FDKLink to="/">{t("resource.common.breadcrumb.home")}</FDKLink>&nbsp; / &nbsp;
        </span>
        <span className={styles.active}>{t("resource.common.breadcrumb.brands")}</span>
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
          {pageData?.has_next && !infinite_scroll && (
            <div className={`${styles.viewMoreBtnWrapper} flex-center`}>
              <button
                onClick={() => fetchBrands()}
                className={`${styles.viewMoreBtn} btn-secondary`}
              >
                {t("resource.facets.view_more")}
              </button>
            </div>
          )}
        </div>
      </div>
      {!!back_top && <ScrollToTop />}
    </div >
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
      label: "t:resource.common.infinity_scroll",
      default: true,
      info: "t:resource.common.infinite_scroll_info",
    },
    {
      type: "checkbox",
      id: "back_top",
      label: "t:resource.common.back_to_top",
      default: true,
    },
    {
      type: "checkbox",
      id: "logo_only",
      default: false,
      label: "t:resource.sections.brand_listing.only_logo",
      info: "t:resource.common.show_logo_of_brands",
    },
    {
      type: "text",
      id: "title",
      default: "",
      label: "t:resource.common.heading",
    },
    {
      type: "textarea",
      id: "description",
      default: "",
      label: "t:resource.common.description",
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

export const sections = JSON.stringify([]);

export default Brands;
