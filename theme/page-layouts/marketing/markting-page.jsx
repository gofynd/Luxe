import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { HTMLContent } from "./HTMLContent";
import { GET_PAGE } from "../../queries/marketingQuery";
import styles from "../../styles/main.less";
import PageNotFound from "../../components/page-not-found/page-not-found";
import Loader from "../../components/loader/loader";
import { getHelmet } from "../../providers/global-provider";

function MarketingPage({ fpi, defaultSlug, id: sectionId }) {
  let { slug } = useParams();
  if (defaultSlug) slug = defaultSlug;
  const containerRef = useRef(null);
  const customPage = useGlobalStore(fpi.getters.CUSTOM_PAGE) || {};
  const contentData = useGlobalStore(fpi.getters.CUSTOM_VALUE) || {};
  const [content, setContent] = useState(
    contentData?.[`marketingData-${sectionId}`] || null
  );
  const { content_path, type } = customPage;

  useEffect(() => {
    if (customPage?.slug !== slug) {
      const payload = {
        slug,
      };
      fpi.executeGQL(GET_PAGE, payload).then((res) => {
        fetch(res?.data?.customPage?.content_path).then(async (res) => {
          const text = await res.text();
          setContent(text);
        });
      });
    }
  }, [slug]);

  const { seo = {}, error } = customPage || {};

  const pageNotFound =
    error?.name === "FDKServerResponseError" &&
    error?.message === "Sorry, document not found";

  if (pageNotFound) {
    return <h2>Page Not Found</h2>;
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
  if (pageResponse?.data?.customPage?.content_path) {
    const contentResponse = await fetch(
      pageResponse?.data?.customPage?.content_path
    );
    const content = await contentResponse.text();
    fpi.custom.setValue(`marketingData-${id}`, content);
  }
  return pageResponse;
};
export default MarketingPage;
