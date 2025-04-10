import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { HTMLContent } from "./HTMLContent";
import { GET_PAGE } from "../../queries/marketingQuery";
import styles from "../../styles/main.less";
import PageNotFound from "../../components/page-not-found/page-not-found";
import Loader from "../../components/loader/loader";
import { useGlobalStore, useGlobalTranslation } from "fdk-core/utils";
import { getHelmet } from "../../providers/global-provider";
import EmptyState from "../../components/empty-state/empty-state";

function MarketingPage({ fpi, defaultSlug, id: sectionId }) {
  const { t } = useGlobalTranslation("translation");
  let { slug } = useParams();
  if (defaultSlug) slug = defaultSlug;
  const containerRef = useRef(null);
  const customPage = useGlobalStore(fpi.getters.CUSTOM_PAGE) || {};
  const contentData = useGlobalStore(fpi.getters.CUSTOM_VALUE) || {};
  const [content, setContent] = useState(
    contentData?.[`marketingData-${sectionId}`] || null
  );
  const { content_path, type } = customPage;

  const [pageNotFound, setPageNotFound] = useState(false);

  useEffect(() => {
    if (customPage?.slug !== slug) {
      const payload = {
        slug,
      };
      fpi
        .executeGQL(GET_PAGE, payload)
        .then((res) => {
          if (res?.data) {
            const customPageData = res?.data?.customPage;
            if (!customPageData || !customPageData?.published) {
              setPageNotFound(true);
              return;
            }
            fetch(customPageData?.content_path).then(async (res) => {
              const text = await res.text();
              setContent(text);
            });
          }

          if (res?.errors) {
            setPageNotFound(true);
          }
        })
        .catch(() => {
          setPageNotFound(true);
        });
    }
  }, [slug]);

  const { seo = {} } = customPage || {};

  if (pageNotFound) {
    return <EmptyState title={t("resource.common.page_not_found")} />;
  }
  const { title, description } = seo;

  const renderContent = (type, value) => {
    if (["html", "rawhtml"].includes(type)) {
      return <HTMLContent ref={containerRef} key={type} content={value} />;
    }

    if (type === "markdown") {
      return <HTMLContent ref={containerRef} key={type} content={value} />;
    }

    if (type === "css") {
      return (
        <style data-testid="cssStyle" key={type}>
          {value}
        </style>
      );
    }
    return null;
  };

  return (
    <>
      {getHelmet({ seo })}
      <div id="custom-page-container" className="basePageContainer margin0auto">
        {renderContent(type, content)}
      </div>
    </>
  );
}

MarketingPage.serverFetch = async ({ router, fpi, id }) => {
  const { slug } = router?.params ?? {};
  const payload = {
    slug,
  };
  const pageResponse = await fpi.executeGQL(GET_PAGE, payload);
  const customPageData = pageResponse?.data?.customPage;
  if (!customPageData || !customPageData?.published) {
    return { error: "Page Not Found" }; // Returning error state
  }
  if (customPageData?.content_path) {
    try {
      const contentResponse = await fetch(customPageData?.content_path);
      if (!contentResponse.ok) throw new Error("Failed to fetch content");

      const content = await contentResponse.text();
      fpi.custom.setValue(`marketingData-${id}`, content);
    } catch (error) {
      console.error("Error fetching marketing content:", error);
      return { error: "Content Fetch Failed" };
    }
  }
  return pageResponse;
};
export default MarketingPage;
