import React, { useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import { marked } from "marked";
import styles from "./BlogPage.less";
import { HTMLContent } from "../../components/core/html-content/html-content";
import FyHTMLRenderer from "../../components/core/fy-html-renderer/fy-html-renderer";
import BlogTabs from "../../components/blog/blog-tabs";
import BlogFooter from "../../components/blog/blog-footer";
import useBlog from "./useBlog";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyImage from "../../components/core/fy-image/fy-image";

function BlogDetails({ fpi }) {
  const params = useParams();
  const containerRef = useRef(null);

  const { blogDetails, sliderProps, footerProps, contactInfo, getBlog } =
    useBlog({ fpi });

  useEffect(() => {
    getBlog(params.slug);
  }, [params.slug]);

  const socialLinks = useMemo(() => {
    const socialLinksObj = contactInfo?.social_links || {};
    return Object.entries(socialLinksObj).reduce((acc, [key, value]) => {
      if (value?.link) {
        acc.push({
          ...value,
          key,
          icon: key && typeof key === "string" ? `blog-${key}` : "",
        });
      }
      return acc;
    }, []);
  }, [contactInfo]);
  const convertUTCDateToLocalDate = (date, format) => {
    if (!format) {
      format = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
    }
    const utcDate = new Date(date);
    // Convert the UTC date to the local date using toLocaleString() with specific time zone
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      ...format,
      timeZone: browserTimezone,
    };
    // Convert the UTC date and time to the desired format
    const formattedDate = utcDate
      .toLocaleString("en-US", options)
      .replace(" at ", ", ");
    return formattedDate;
  };
  const getFormattedDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return convertUTCDateToLocalDate(dateString, options);
  };
  const blogTag = () => {
    if (
      blogDetails?.tags?.[0] &&
      blogDetails?.tags?.[0]?.toLowerCase() !== "top5"
    ) {
      return blogDetails?.tags?.[0];
    }
    return blogDetails?.tags?.[1] || "";
  };
  return (
    <>
      <div className={styles.blogContainer}>
        <div className={`${styles.leftCol} ${styles.blogPost}`}>
          <div className={`${styles.blogPost__header}`}>
            <div className={`${styles.breadcrumb}`}>
              <FDKLink to="/">
                <span className={`${styles.breadcrumb__label}`}>Home</span>
              </FDKLink>
              <SvgWrapper
                className={`${styles.breadcrumb__icon}`}
                svgSrc="breadcrumb-angle"
              />
              <FDKLink to="/blog">
                <span className={`${styles.breadcrumb__label}`}>Blog</span>
              </FDKLink>
              <SvgWrapper
                className={`${styles.breadcrumb__icon}`}
                svgSrc="breadcrumb-angle"
              />
              <span className={`${styles.breadcrumb__label}`}>
                {blogDetails?.slug?.replace(/-/g, " ")}
              </span>
            </div>
            {blogTag && (
              <div className={`${styles.blogPost__tag}`}>{blogTag}</div>
            )}
            <h1 className={`${styles.blogPost__heading}`}>
              {blogDetails?.title}
            </h1>
            <div className={`${styles.blogPost__meta}`}>
              <div>
                <div className={`${styles.author}`}>
                  <span>By </span>
                  <span>{blogDetails?.author?.name}</span>
                </div>
                <div className={`${styles.publishDate}`}>
                  <span>Published </span>
                  <span>{getFormattedDate(blogDetails?.publish_date)}</span>
                </div>
              </div>
              {socialLinks?.length && (
                <div className={`${styles.social}`}>
                  <div className={`${styles.social__label}`}>Follow us </div>
                  {socialLinks?.map((social) => (
                    <FDKLink
                      to={social?.link}
                      title={social?.title}
                      key={social?.key}
                    >
                      <SvgWrapper
                        className={`${styles.social__icon}`}
                        svgSrc={social?.icon}
                      />
                    </FDKLink>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={`${styles.blogPost__image}`}>
            <FyImage
              key={blogDetails?.slug}
              className={`${styles.blogPost__image}`}
              src={
                blogDetails?.feature_image?.secure_url ||
                sliderProps.fallbackImg
              }
              alt={blogDetails?.title}
              placeholder={sliderProps.fallbackImg}
            />
          </div>
          <div className={`${styles.blogPost__content}`}>
            {blogDetails?.content && (
              <HTMLContent
                ref={containerRef}
                key="html"
                content={blogDetails?.content?.[0]?.value}
              />
            )}
          </div>
        </div>
        <div className={`${styles.rightCol}`}>
          <BlogTabs fpi={fpi} {...sliderProps}></BlogTabs>
        </div>
      </div>
      <BlogFooter {...footerProps}></BlogFooter>
    </>
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
      type: "checkbox",
      id: "show_top_blog",
      label: "Show Top Viewed",
      default: true,
      info: "The Top Viewed section will display the latest five published blogs tagged with the 'top5' value",
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

export default BlogDetails;
