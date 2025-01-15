import React from "react";
import BlogList from "@gofynd/theme-template/pages/blog/blog";
import "@gofynd/theme-template/pages/blog/blog.css";
import { FETCH_BLOGS_LIST } from "../queries/blogQuery";
import useBlog from "../page-layouts/blog/useBlog";

function Blog({ fpi }) {
  const {
    blogs,
    totalBlogsList,
    sliderBlogs,
    footerProps,
    sliderProps,
    paginationProps,
    onLoadMoreProducts,
    isLoading,
    isBlogPageLoading,
    search: ssrSearch,
    filters: ssrFilters,
  } = useBlog({ fpi });
  return (
    <BlogList
      blogs={blogs}
      totalBlogsList={totalBlogsList}
      sliderBlogs={sliderBlogs}
      footerProps={footerProps}
      sliderProps={sliderProps}
      paginationProps={paginationProps}
      onLoadMoreProducts={onLoadMoreProducts}
      isLoading={isLoading}
      isBlogPageLoading={isBlogPageLoading}
      ssrSearch={ssrSearch}
      ssrFilters={ssrFilters}
    ></BlogList>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "show_blog_slide_show",
      label: "Show Blog Slide Show",
      default: true,
    },
    {
      id: "filter_tags",
      type: "tags-list",
      default: "",
      label: "Filter By Tags",
      info: "Blog tags are case-sensitive. Enter the identical tag used on the Fynd platform, separated by commas, to display the blog post in the slideshow.",
    },
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "AutoPlay Slides",
    },
    {
      type: "range",
      id: "slide_interval",
      min: 0,
      max: 10,
      step: 0.5,
      unit: "sec",
      label: "Change slides every",
      default: 3.5,
    },
    {
      type: "text",
      id: "btn_text",
      default: "Read More",
      label: "Button Text",
    },
    {
      type: "checkbox",
      id: "show_tags",
      label: "Show Tags",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_search",
      label: "Show Search Bar",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_recent_blog",
      label: "Show Recently Published",
      default: true,
      info: "The Recently Published section will display the latest five published blogs",
    },
    {
      id: "recent_blogs",
      type: "blog-list",
      default: "",
      label: "Recently Published Blogs",
      info: "",
    },
    {
      type: "checkbox",
      id: "show_top_blog",
      label: "Show Top Viewed",
      default: true,
      info: "The Top Viewed section will display the latest five published blogs tagged with the 'top5' value",
    },
    {
      id: "top_blogs",
      type: "blog-list",
      default: "",
      label: "Top Viewed Blogs",
      info: "",
    },
    {
      type: "checkbox",
      id: "show_filters",
      label: "Show Filters",
      default: true,
    },
    {
      id: "loading_options",
      type: "select",
      options: [
        {
          value: "infinite",
          text: "Infinite Loading",
        },
        {
          value: "pagination",
          text: "Pagination",
        },
      ],
      default: "pagination",
      label: "Loading Options",
    },
    {
      id: "title",
      type: "text",
      value: "The Unparalleled Shopping Experience",
      default: "The Unparalleled Shopping Experience",
      label: "Heading",
    },
    {
      id: "description",
      type: "textarea",
      value:
        "Everything you need for that ultimate stylish wardrobe, Fynd has got it!",
      label: "Description",
    },
    {
      type: "text",
      id: "button_text",
      value: "Shop Now",
      default: "Shop Now",
      label: "Button Label",
    },
    {
      type: "url",
      id: "button_link",
      default: "",
      label: "Redirect Link",
    },
    {
      type: "image_picker",
      id: "fallback_image",
      label: "Fallback Image",
      default: "",
    },
  ],
});

Blog.serverFetch = async ({ fpi, router }) => {
  try {
    const { filterQuery = {} } = router;

    const payload = {
      pageSize: 12,
      pageNo: 1,
    };

    const response = await fpi.executeGQL(FETCH_BLOGS_LIST, payload, {
      skipStoreUpdate: true,
    });

    fpi.custom.setValue("blogProps", {
      totalBlogsListData: response?.data?.applicationContent?.blogs,
      filterQuery,
    });

    const tags = filterQuery?.tag || [];
    if (tags.length > 0)
      payload.tags = Array.isArray(tags) ? tags.join(",") : tags;
    const search = filterQuery?.search || "";
    if (search) payload.search = search;
    const pageNo = filterQuery?.page_no;
    if (pageNo) payload.pageNo = Number(pageNo);

    fpi.custom.setValue("isBlogSsrFetched", true);

    return fpi.executeGQL(FETCH_BLOGS_LIST, payload);
  } catch (error) {
    console.log(error);
  }
};

export default Blog;
