import { useEffect, useState, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { FETCH_BLOGS_LIST, GET_BLOG } from "../../queries/blogQuery";
import { isRunningOnClient } from "../../helper/utils";

const PAGE_SIZE = 12;
const PAGES_TO_SHOW = 5;
const PAGE_OFFSET = 2;

const useBlog = ({ fpi }) => {
  const location = useLocation();
  const { slug = "" } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const THEME = useGlobalStore(fpi?.getters?.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "blog")?.settings?.props || {};

  const isClient = useMemo(() => isRunningOnClient(), []);

  const {
    blogProps: { sliderBlogsData, filterQuery },
    isBlogSsrFetched,
  } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const blogsData = useGlobalStore(fpi?.getters?.BLOGS);

  const [isBlogPageLoading, setIsBlogPageLoading] = useState(!isBlogSsrFetched);
  const [blogs, setBlogs] = useState(blogsData || undefined);
  const [sliderBlogs, setSliderBlogs] = useState(sliderBlogsData || undefined);

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
      show_filters: pageConfig?.show_filters || "",
      show_recent_blog: pageConfig?.show_recent_blog || "",
      show_search: pageConfig?.show_search || "",
      show_tags: pageConfig?.show_tags || "",
      show_top_blog: pageConfig?.show_top_blog || "",
      fallback_image: pageConfig?.fallback_image || "",
      button_text: pageConfig?.button_text || "",
      autoplay: pageConfig?.autoplay || false,
      slide_interval: pageConfig?.slide_interval || 3.5,
      btn_text: pageConfig?.btn_text || "",
      loadingOption: pageConfig?.loading_options || "",
      show_blog_slide_show: pageConfig?.show_blog_slide_show || "",
      recentBlogs: pageConfig.recent_blogs || [],
      topViewedBlogs: pageConfig.top_blogs || [],
    }),
    [pageConfig]
  );

  const contactInfo = useGlobalStore(fpi.getters.CONTACT_INFO);
  const { blogDetails } = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const [isBlogDetailsLoading, setIsBlogDetailsLoading] = useState(
    !blogDetails?.[slug]
  );

  const getPageUrl = (pageNo) => {
    const searchParams = isClient
      ? new URLSearchParams(location?.search)
      : null;
    searchParams?.set("page_no", pageNo);
    return `${location?.pathname}?${searchParams?.toString()}`;
  };

  const getStartPage = ({ current, totalPageCount }) => {
    const index = Math.max(current - PAGE_OFFSET, 1);
    const lastIndex = Math.max(totalPageCount - PAGES_TO_SHOW + 1, 1);

    if (index <= 1) {
      return 1;
    }
    if (index > lastIndex) {
      return lastIndex;
    }
    return index;
  };

  const paginationProps = useMemo(() => {
    if (!blogs?.page) {
      return;
    }
    const {
      current,
      has_next: hasNext,
      has_previous: hasPrevious,
      item_total,
    } = blogs?.page || {};
    const totalPageCount = Math.ceil(item_total / PAGE_SIZE);
    const startingPage = getStartPage({ current, totalPageCount });

    const displayPageCount = Math.min(totalPageCount, PAGES_TO_SHOW);

    const pages = [];
    for (let i = 0; i < displayPageCount; i++) {
      pages.push({
        link: getPageUrl(startingPage + i),
        index: startingPage + i,
      });
    }

    return {
      current: current || 1,
      hasNext,
      hasPrevious: hasPrevious || current > 1,
      prevPageLink: hasPrevious || current > 1 ? getPageUrl(current - 1) : "",
      nextPageLink: hasNext ? getPageUrl(current + 1) : "",
      pages,
    };
  }, [blogs?.page]);

  const handleLoadMoreProducts = () => {
    const queryParams = isClient ? new URLSearchParams(location.search) : null;

    const values = {
      pageNo: (blogs?.page?.current ?? 1) + 1,
    };
    const tags = queryParams?.get("tags") || "";
    if (tags) values.tags = tags;
    const search = queryParams?.get("search") || "";
    if (search) values.search = search;
    fetchBlogs(values, true, true);
  };

  useEffect(() => {
    fpi.custom.setValue("isBlogSsrFetched", false);
  }, []);

  useEffect(() => {
    if (!isBlogSsrFetched) {
      const queryParams = isClient
        ? new URLSearchParams(location.search)
        : null;
      const pageNo =
        pageConfig?.loading_options !== "infinite"
          ? queryParams?.get("page_no") || "1"
          : "1";

      const values = {
        pageNo: Number(pageNo),
      };

      const tags = queryParams?.getAll("tag") || "";
      if (tags.length > 0) values.tags = tags.join(",");

      const search = queryParams?.get("search") || "";
      if (search) values.search = search;

      fetchBlogs(values, true);
    }
  }, [location?.search]);

  useEffect(() => {
    if (!sliderBlogsData) {
      const values = {
        pageNo: Number(1),
      };
      fpi
        .executeGQL(FETCH_BLOGS_LIST, values, { skipStoreUpdate: true })
        .then((res) => {
          if (res?.data?.applicationContent) {
            const data = res?.data?.applicationContent?.blogs;
            setSliderBlogs(data);
          }
        });
    }
  }, [sliderBlogsData]);

  function fetchBlogs(values, updateStore, append = false) {
    values.pageSize = PAGE_SIZE;
    setIsLoading(true);
    return fpi
      .executeGQL(FETCH_BLOGS_LIST, values)
      .then((res) => {
        if (res?.data?.applicationContent) {
          const data = res?.data?.applicationContent?.blogs;
          const updatedData = append
            ? {
                ...data,
                items: (blogs?.items || [])?.concat(data?.items || []),
              }
            : data;
          if (updateStore) setBlogs(updatedData);
          setIsLoading(false);
          return updatedData;
        }
      })
      .finally(() => {
        setIsLoading(false);
        setIsBlogPageLoading(false);
      });
  }

  function getBlog(slug) {
    try {
      setIsBlogDetailsLoading(true);
      const values = {
        slug: slug || "",
      };
      return fpi
        .executeGQL(GET_BLOG, values)
        .then((res) => {
          if (res?.data?.blog) {
            const data = res?.data?.blog;
            fpi.custom.setValue("blogDetails", {
              ...blogDetails,
              [slug]: data,
            });
          }
        })
        .finally(() => {
          setIsBlogDetailsLoading(false);
        });
    } catch (error) {
      console.log({ error });
    }
  }

  const filters = useMemo(() => {
    const search = filterQuery?.search;
    const blogFilters = filterQuery?.tag;

    let tagBlogFilters = [];

    if (blogFilters) {
      tagBlogFilters = (
        Array.isArray(blogFilters) ? blogFilters : [blogFilters]
      )?.map((item) => ({
        display: item,
        pretext: "tag",
        key: item?.toLowerCase(),
      }));
    }

    return [
      ...(tagBlogFilters || []),
      ...(search
        ? [
            {
              display: search,
              pretext: "text",
              key: "search_text",
            },
          ]
        : []),
    ];
  }, [filterQuery]);

  return {
    blogs: blogs || blogsData,
    sliderBlogs: sliderBlogs || sliderBlogsData,
    blogDetails: blogDetails?.[slug],
    footerProps,
    sliderProps,
    contactInfo,
    getBlog,
    fetchBlogs,
    isLoading,
    isBlogDetailsLoading,
    paginationProps,
    isBlogPageLoading,
    search: filterQuery?.search || "",
    filters,
    onLoadMoreProducts: handleLoadMoreProducts,
  };
};

export default useBlog;
