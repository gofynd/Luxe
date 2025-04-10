import React from "react";
import BlogPage from "fdk-react-templates/components/blog-page/blog-page";
import "fdk-react-templates/components/blog-page/blog-page.css";
import useBlogDetails from "../../page-layouts/blog/useBlogDetails";
import { GET_BLOG } from "../../queries/blogQuery";
import { getHelmet } from "../../providers/global-provider";
import EmptyState from "../../components/empty-state/empty-state";
import { useGlobalTranslation } from "fdk-core/utils";

function BlogDetails({ fpi }) {
  const {
    blogDetails,
    sliderProps,
    footerProps,
    contactInfo,
    getBlog,
    isBlogDetailsLoading,
    isBlogNotFound,
  } = useBlogDetails({ fpi });
  const { t } = useGlobalTranslation("translation");
  return (
    <>
      {getHelmet({ seo: blogDetails?.seo })}
      {isBlogNotFound ? (
        <EmptyState title={t("resource.blog.no_blog_found")} />
      ) : (
        <BlogPage
          contactInfo={contactInfo}
          blogDetails={blogDetails}
          sliderProps={sliderProps}
          footerProps={footerProps}
          getBlog={getBlog}
          isBlogDetailsLoading={isBlogDetailsLoading}
        ></BlogPage>
      )}
    </>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      type: "image_picker",
      id: "image",
      label: "t:resource.common.image",
      default: "",
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

BlogDetails.serverFetch = async ({ router, fpi }) => {
  const { slug } = router?.params ?? {};
  const searchParams = new URLSearchParams(router?.location?.search);
  const isPreview = searchParams.get("__preview") === "blog";
  const payload = {
    slug,
    preview: isPreview,
  };
  const { data, errors } = await fpi.executeGQL(GET_BLOG, payload);

  if (errors) {
    fpi.custom.setValue(`isBlogNotFound`, true);
  }

  return fpi.custom.setValue(`blogDetails`, {
    [slug]: data?.blog,
  });
};

export default BlogDetails;
