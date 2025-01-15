import React, { useEffect, useState } from "react";

import { FDKLink } from "fdk-core/components";
import Loader from "../components/loader/loader";
// import ProductCard from "../components/product-card/product-card";
import styles from "../styles/collections.less";
import CardList from "../components/card-list/card-list";
import useCollections from "../page-layouts/collections/useCollections";
import { detectMobileWidth } from "../helper/utils";
import EmptyState from "../components/empty-state/empty-state";
import InfiniteLoader from "../components/infinite-loader/infinite-loader";
import ScrollToTop from "../components/scroll-to-top/scroll-to-top";
import { COLLECTIONS } from "../queries/collectionsQuery";

function Collections({ fpi }) {
  const {
    collections,
    pageConfig,
    isLoading,
    pageData,
    fetchCollection,
    globalConfig,
  } = useCollections(fpi);
  const { title, description, infinite_scroll, logo_only, back_top } =
    pageConfig;
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(detectMobileWidth());
  }, []);
  //   const { page, items = [], loading } = product_lists || {};

  return (
    <div
      className={`${styles.collections} basePageContainer margin0auto fontBody`}
    >
      {isLoading && !collections?.length ? (
        <Loader />
      ) : (
        <>
          <div
            className={`${styles.collections__breadcrumbs} ${styles.desktop} captionNormal`}
          >
            <span>
              <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
            </span>
            <span className={styles.active}>Collections</span>
          </div>
          <div>
            {title && (
              <h1 className={`${styles.collections__title} fontHeader`}>
                {title}
              </h1>
            )}
            {description && (
              <div
                className={`${styles.collections__description} ${isMobile ? styles.b2 : styles.b1}`}
              >
                <p>{description}</p>
              </div>
            )}
            {collections?.length ? (
              <div className={styles.collections__cards}>
                <InfiniteLoader
                  isLoading={isLoading}
                  infiniteLoaderEnabled={infinite_scroll}
                  hasNext={pageData?.has_next}
                  loadMore={fetchCollection}
                >
                  <CardList
                    cardList={collections}
                    cardType="COLLECTIONS"
                    showOnlyLogo={!!logo_only}
                    globalConfig={globalConfig}
                  />
                </InfiniteLoader>
              </div>
            ) : (
              !isLoading &&
              !collections?.length && <EmptyState title="No collection found" />
            )}
          </div>
          <div
            className={`${styles.collections__breadcrumbs} ${styles.mobile} captionNormal`}
          >
            <span>
              <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
            </span>
            <span className={styles.active}>Collections</span>
          </div>
          {!!back_top && <ScrollToTop />}
        </>
      )}
    </div>
  );
}

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

export const sections = JSON.stringify([]);

Collections.serverFetch = async ({ fpi, props }) => {
  try {
    const payload = {
      pageNo: 1,
      pageSize: 12,
    };
    await fpi.executeGQL(COLLECTIONS, payload).then((res) => {
      return res;
    });
  } catch (err) {
    console.log(err);
  }
};

export default Collections;
