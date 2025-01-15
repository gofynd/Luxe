import React, { useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";
import Slider from "react-slick";
import styles from "../styles/sections/feature-blog.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import { FETCH_BLOGS_LIST } from "../queries/blogQuery";
import { useGlobalStore, useFPI } from "fdk-core/utils";

export function Component({ props, globalConfig }) {
  const fpi = useFPI();
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const blogItems = customValues?.featuredBlogSectionData ?? [];
  const { heading, description } = props;
  const [windowWidth, setWindowWidth] = useState(0);
  const [config, setConfig] = useState({
    dots: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    lazyLoad: "ondemand",
    autoplay: false,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    infinite: blogItems?.length > 3,
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
    responsive: [
      {
        breakpoint: 780,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          swipe: true,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
          dots: blogItems?.length > 2,
          arrows: false,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          swipe: true,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
          arrows: false,
          dots: false,
        },
      },
    ],
  });

  useEffect(() => {
    const fetchBlogs = () => {
      const payload = {
        pageSize: 12,
        pageNo: 1,
      };
      fpi.executeGQL(FETCH_BLOGS_LIST, payload).then((res) => {
        fpi.custom.setValue(
          `featuredBlogSectionData`,
          res?.data?.applicationContent?.blogs?.items
        );
      });
    };

    if (!customValues.featuredBlogSectionData) fetchBlogs();
  }, [customValues.featuredBlogSectionData]);

  useEffect(() => {
    if (blogItems?.length > 3) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        arrows: blogItems.length > 3,
        dots: blogItems.length > 3,
        infinite: blogItems.length > 3,
      }));
    }
  }, [blogItems]);

  const getBlogTag = (blog) => {
    return blog?.tags?.length > 1 ? `${blog?.tags?.[0]},` : blog?.tags?.[0];
  };
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

  const dynamicStyles = {
    paddingTop: "16px",
    paddingBottom: `${globalConfig?.section_margin_bottom}px`,
  };

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(isRunningOnClient() ? window.innerWidth : 0);
    }, 500);

    if (isRunningOnClient()) {
      window.addEventListener("resize", handleResize);
      handleResize();
    }

    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  return (
    <div style={dynamicStyles} className={styles.featureBlogWrapper}>
      <div className={styles.blogSection}>
        {heading?.value && (
          <h2 className={styles.blogSection__heading}>{heading?.value}</h2>
        )}
        {description?.value && (
          <p className={`${styles.blogSection__description} ${styles.b4}`}>
            {description?.value}
          </p>
        )}
      </div>
      {blogItems?.length > 0 && (
        <div
          className={`${blogItems?.length < 3 && styles["single-card-view"]}  ${styles.blogSection__list}`}
          style={{
            "--slick-dots": `${blogItems?.length * 22 + 10}px`,
          }}
        >
          <Slider
            {...config}
            className={
              blogItems?.length <= 3 || windowWidth <= 480 ? "no-nav" : ""
            }
          >
            {blogItems?.map((blog, index) => (
              <div key={index} className={styles.sliderView}>
                <div className={styles.blog__image}>
                  <FDKLink
                    target="_blank"
                    to={`/blog/${blog.slug}`}
                    title={blog.title}
                  >
                    <div className={`${styles.imageWrapper}`}>
                      <FyImage
                        customClass={`${styles.fImg}`}
                        isImageCover={true}
                        src={blog?.feature_image?.secure_url}
                        alt={blog.title}
                        isLazyLoaded={false}
                        sources={[]}
                        aspectRatio={16 / 9}
                        mobileAspectRatio={2 / 1}
                      />
                    </div>
                  </FDKLink>
                </div>
                <div className={styles.blog__info}>
                  <div className={styles.blog__info__titleSection}>
                    {getBlogTag(blog) && (
                      <div
                        className={`${styles.blog__info__tags} ${styles.blog__info__flexAlignAenter}`}
                      >
                        <h4>{getBlogTag(blog)}</h4>
                        {blog?.tags?.[1] && <h4>{blog?.tags?.[1]}</h4>}
                      </div>
                    )}

                    <h3 className={styles.blog__info__title}>
                      <FDKLink
                        target="_blank"
                        to={`/blog/${blog.slug}`}
                        title={blog.title}
                      >
                        {blog.title}
                      </FDKLink>
                    </h3>
                  </div>
                  <div
                    className={`${styles.blog__info__meta} ${styles.blog__info__flexAlignAenter}`}
                  >
                    <span>{blog?.author?.name}</span>
                    <SvgWrapper
                      className={styles.divider}
                      svgSrc="ellipse"
                    ></SvgWrapper>
                    <span>{getFormattedDate(blog?.publish_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
      {blogItems?.length > 1 && (
        <div className={styles.blogSection__ctaWrapper}>
          <FDKLink
            target="_blank"
            className={styles.blogSection__cta}
            to="/blog"
          >
            View All
          </FDKLink>
        </div>
      )}
    </div>
  );
}

export const settings = {
  label: "Feature Blog",
  props: [
    {
      type: "text",
      id: "heading",
      default: "Feature Blog",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "textarea",
      id: "description",
      default:
        "Chique is a fast-growing indowestern womenswear brand having several stores pan India. Simple, innovative and progressive,",
      label: "Description",
      info: "Description text of the section",
    },
  ],
};

Component.serverFetch = async ({ fpi, props, id }) => {
  try {
    const payload = {
      pageSize: 12,
      pageNo: 1,
    };
    const response = await fpi.executeGQL(FETCH_BLOGS_LIST, payload);
    return fpi.custom.setValue(
      `featuredBlogSectionData`,
      response?.data?.applicationContent?.blogs?.items
    );
  } catch (err) {
    console.log(err);
  }
};
export default Component;
