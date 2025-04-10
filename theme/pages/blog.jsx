import React from "react";
import BlogList from "fdk-react-templates/pages/blog/blog";
import "fdk-react-templates/pages/blog/blog.css";
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
      label: "t:resource.sections.blog.show_blog_slideshow",
      default: true,
    },
    {
      id: "filter_tags",
      type: "tags-list",
      default: "",
      label: "t:resource.sections.blog.filter_by_tags",
      info: "t:resource.sections.blog.blog_tags_info",
    },
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "t:resource.common.autoplay_slides",
    },
    {
      type: "range",
      id: "slide_interval",
      min: 0,
      max: 10,
      step: 0.5,
      unit: "sec",
      label: "t:resource.common.change_slides_every",
      default: 3.5,
    },
    {
      type: "text",
      id: "btn_text",
      default: "Read More",
      label: "t:resource.common.button_text",
    },
    {
      type: "checkbox",
      id: "show_tags",
      label: "t:resource.sections.blog.show_tags",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_search",
      label: "t:resource.sections.blog.show_search_bar",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_recent_blog",
      label: "t:resource.sections.blog.show_recently_published",
      default: true,
      info: "t:resource.sections.blog.recently_published_info",
    },
    {
      id: "recent_blogs",
      type: "blog-list",
      default: "",
      label: "t:resource.sections.blog.recently_published_blogs",
      info: "",
    },
    {
      type: "checkbox",
      id: "show_top_blog",
      label: "t:resource.sections.blog.show_top_viewed",
      default: true,
      info: "t:resource.sections.blog.top_viewed_info",
    },
    {
      id: "top_blogs",
      type: "blog-list",
      default: "",
      label: "t:resource.sections.blog.top_viewed_blogs",
      info: "",
    },
    {
      type: "checkbox",
      id: "show_filters",
      label: "t:resource.sections.blog.show_filters",
      default: true,
    },
    {
      id: "loading_options",
      type: "select",
      options: [
        {
          value: "infinite",
          text: "t:resource.common.infinite_loading",
        },
        {
          value: "pagination",
          text: "t:resource.common.pagination",
        },
      ],
      default: "pagination",
      label: "t:resource.common.loading_options",
    },
    {
      id: "title",
      type: "text",
      value: "The Unparalleled Shopping Experience",
      default: "The Unparalleled Shopping Experience",
      label: "t:resource.common.heading",
    },
    {
      id: "description",
      type: "textarea",
      value:
        "Everything you need for that ultimate stylish wardrobe, Fynd has got it!",
      label: "t:resource.common.description",
    },
    {
      type: "text",
      id: "button_text",
      value: "Shop Now",
      default: "Shop Now",
      label: "t:resource.sections.blog.button_label",
    },
    {
      type: "url",
      id: "button_link",
      default: "",
      label: "t:resource.common.redirect_link",
    },
    {
      type: "image_picker",
      id: "fallback_image",
      label: "t:resource.sections.blog.fallback_image",
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
