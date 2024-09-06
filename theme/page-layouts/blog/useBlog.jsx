import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { FETCH_BLOGS_LIST, GET_BLOG } from "../../queries/blogQuery";

const useBlog = ({ fpi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [blogs, setBlogs] = useState(null);
  const [blogDetails, setBlogDetails] = useState(null);

  const THEME = useGlobalStore(fpi?.getters?.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "blog")?.settings?.props || {};

  const footerProps = useMemo(
    () => ({
      button_link: pageConfig.button_link,
      button_text: pageConfig.button_text,
      description: pageConfig.description,
      title: pageConfig.title,
    }),
    [pageConfig]
  );

  const sliderProps = useMemo(
    () => ({
      show_filters: pageConfig.show_filters || "",
      show_recent_blog: pageConfig.show_recent_blog || "",
      show_search: pageConfig.show_search || "",
      show_tags: pageConfig.show_tags || "",
      show_top_blog: pageConfig.show_top_blog || "",
      fallback_image: pageConfig.fallback_image || "",
      button_text: pageConfig.button_text || "",
    }),
    [pageConfig]
  );

  const contactInfo = useGlobalStore(fpi.getters.CONTACT_INFO);

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const pageNo = queryParams.get("pageNo") || "1";
      const pageSize = queryParams.get("pageSize") || "12";
      const values = {
        pageNo: Number(pageNo),
        pageSize: Number(pageSize),
      };
      const tags = queryParams.get("tags") || "";
      if (tags) values.tags = tags;
      const search = queryParams.get("search") || "";
      if (search) values.search = search;
      fetchBlogs(values, true);
    } catch (error) {
      console.log({ error });
    }
  }, [location.search]);

  function fetchBlogs(values, updateStore) {
    return fpi.executeGQL(FETCH_BLOGS_LIST, values).then((res) => {
      if (res?.data?.applicationContent) {
        const data = res?.data?.applicationContent?.blogs;
        if (updateStore) setBlogs(data);
        return data;
      }
    });
  }

  function getBlog(slug) {
    try {
      const values = {
        slug: slug || "",
      };
      return fpi.executeGQL(GET_BLOG, values).then((res) => {
        if (res?.data?.blog) {
          const data = res?.data?.blog;
          setBlogDetails(data);
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  return {
    blogs,
    blogDetails,
    footerProps,
    sliderProps,
    contactInfo,
    getBlog,
    fetchBlogs,
  };
};

export default useBlog;
