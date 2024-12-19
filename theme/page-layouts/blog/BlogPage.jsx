import React from "react";
import BlogPage from "@gofynd/theme-template/components/blog-page/blog-page";
import "@gofynd/theme-template/components/blog-page/blog-page.css";
import useBlog from "./useBlog";
import { GET_BLOG } from "../../queries/blogQuery";

function BlogDetails({ fpi }) {
  const {
    blogDetails,
    sliderProps,
    footerProps,
    contactInfo,
    getBlog,
    isBlogDetailsLoading,
  } = useBlog({ fpi });

  return (
    <BlogPage
      contactInfo={contactInfo}
      blogDetails={blogDetails}
      sliderProps={sliderProps}
      footerProps={footerProps}
      getBlog={getBlog}
      isBlogDetailsLoading={isBlogDetailsLoading}
    ></BlogPage>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      type: "image_picker",
      id: "image",
      label: "Image",
      default: "",
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

BlogDetails.serverFetch = async ({ router, fpi }) => {
  const { slug } = router?.params ?? {};
  const payload = {
    slug,
  };
  const response = await fpi.executeGQL(GET_BLOG, payload);

  return fpi.custom.setValue(`blogDetails`, {
    [slug]: response?.data?.blog,
  });
};

export default BlogDetails;
