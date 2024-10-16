import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import styles from "../styles/blog.less";
import useBlog from "../page-layouts/blog/useBlog";
import BlogFooter from "../components/blog/blog-footer";
import BlogTabs from "../components/blog/blog-tabs";
import FyImage from "../components/core/fy-image/fy-image";
import EmptyState from "fdk-react-templates/components/empty-state/empty-state";
import "fdk-react-templates/components/empty-state/empty-state.css";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";

function MemoizedSlide({ fpi, blog, index }) {
  const { sliderProps } = useBlog({ fpi });
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
  const getBlogTag = (tags) => {
    if (tags?.[0] && tags?.[0]?.toLowerCase() !== "top5") {
      return tags?.[0];
    }
    return tags?.[1] || "";
  };

  return (
    <div className={styles.blogItem}>
      <div className={`${styles.blogItem__info}`}>
        <div className={`${styles.blogItem__meta}`}>
          {getBlogTag(blog?.tags) && (
            <span className={`${styles.blogItem__tag}`}>
              {getBlogTag(blog?.tags)}
            </span>
          )}
          {getBlogTag(blog?.tags) && getFormattedDate(blog?.publish_date) && (
            <span className={`${styles.divider}`}>|</span>
          )}
          <span className={`${styles.blogItem__publishDate}`}>
            {getFormattedDate(blog?.publish_date)}
          </span>
        </div>
        <h1 className={`${styles.blogItem__title}`}>{blog?.title}</h1>
        {blog?.summary && (
          <p className={`${styles.blogItem__content}`}>{blog?.summary}</p>
        )}
        <FDKLink
          className={`${styles.blogItem__button} ${styles.btnPrimary}`}
          title={blog?.title}
          to={`/blog/${blog?.slug}`}
        >
          {sliderProps?.btn_text}
        </FDKLink>
      </div>
      <FyImage
        customClass={styles.blogItem__image}
        src={blog?.feature_image?.secure_url || sliderProps.fallback_image}
        aspectRatio={16 / 5}
        mobileAspectRatio={3 / 4}
        defer={false}
        alt={`slide-${index}`}
        showSkeleton={false}
        isImageCover={true}
      />
    </div>
  );
}
function Blog({ fpi }) {
  const { blogs, footerProps, sliderProps, fetchBlogs } = useBlog({ fpi });
  const [blogFilter, setBlogFilter] = useState(() => new Map());
  const [searchText, setSearchText] = useState("");
  const [blogCount, setBlogCount] = useState(0);
  const navigate = useNavigate();

  const getBlogDetails = (slug) => {
    const link = `/blog/${slug}`;
    navigate(link);
  };

  const [config, setConfig] = useState({
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    lazyLoad: "ondemand",
    autoplay: false,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    nextArrow: <SvgWrapper svgSrc="arrow-right" />,
    prevArrow: <SvgWrapper svgSrc="arrow-left" />,
  });

  useEffect(() => {
    if (blogFilter?.size === 0) setBlogCount(blogs?.page?.item_total);
    return () => {};
  }, [blogs]);

  useEffect(() => {
    const payload = {
      page_no: 1,
      page_size: 12,
    };

    [...blogFilter?.values()]?.map((item, index) => {
      if (item.pretext === "text") {
        payload.search = item.display;
      } else {
        delete payload.search;
      }
      if (item.pretext === "tag") {
        if (payload.tags) payload.tags = `${payload.tags},${item.display}`;
        else payload.tags = item.display;
      } else {
        delete payload.tags;
      }
      return null;
    });
    fetchBlogs(payload, true);
    return () => {};
  }, [blogFilter]);

  useEffect(() => {
    if (sliderProps?.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplay: sliderProps.autoplay,
        speed: sliderProps.slide_interval * 100,
      }));
    }
  }, [sliderProps?.autoplay]);

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
  const getBlogTag = (tags) => {
    if (tags?.[0] && tags?.[0]?.toLowerCase() !== "top5") {
      return tags?.[0];
    }
    return tags?.[1] || "";
  };
  const getBlogTitle = (title) => {
    const blogTitle =
      title?.length > 50 ? `${title.slice(0, 50).trim()}...` : title;
    //   if (searchText) {
    //     let regex = new RegExp(searchText, "gi");
    //     return title.replace(regex, function (match) {
    //       return '<span className={`${styles.highlight}`}>' + match + "</span>";
    //     });
    //   }
    return blogTitle;
  };
  const tagsList = () => {
    if (sliderProps?.show_tags) {
      return blogs?.filters?.tags?.reduce((tagObj, tag) => {
        tag = tag?.trim();
        if (tag) {
          const tagKey = tag?.replace(/ /g, "_")?.toLowerCase();
          tagObj[tagKey] = {
            key: tagKey,
            display: tag,
            // isSelected: false,
            pretext: "tag",
          };
        }
        return tagObj;
      }, {});
    }
    return {};
  };
  const toggleTagFilter = (tag) => {
    if (!blogFilter?.has(tag?.key)) {
      setBlogFilter((prev) => {
        const nextVal = new Map(prev);
        nextVal.set(tag?.key, tag);
        return nextVal;
      });
    } else {
      removeFilter(tag);
    }
  };
  const removeFilter = (filter) => {
    if (filter.key === "search_text") {
      setSearchText("");
    }
    setBlogFilter((prev) => {
      const nextVal = new Map(prev);
      nextVal.delete(filter?.key);
      return nextVal;
    });
  };
  const searchTextUpdate = (value) => {
    if (value.length > 90) {
      value = value.substring(0, 80);
    }
    setSearchText(value);
    if (value) {
      setBlogFilter((prev) => {
        const nextVal = new Map(prev);
        nextVal.set("search_text", {
          key: "search_text",
          display: value,
          // isSelected: true,
          pretext: "text",
        });
        return nextVal;
      });
    } else {
      setBlogFilter((prev) => {
        const nextVal = new Map(prev);
        nextVal.delete("search_text");
        return nextVal;
      });
    }
  };
  const resetFilters = () => {
    setBlogFilter(() => new Map());
    setSearchText("");
    fetchBlogs({ pageNo: 1 });
  };
  return (
    <div>
      <div className={styles.blogContainer}>
        {blogFilter?.size === 0 && blogs?.page?.item_total === 0 && (
          <EmptyState title="No blogs found"></EmptyState>
        )}
        <div className={styles.sliderWrapper}>
          <Slider {...config} initialSlide={0}>
            {blogs?.items?.map((blog, index) => (
              <MemoizedSlide fpi={fpi} key={index} blog={blog} index={index} />
            ))}
          </Slider>
        </div>
        <div className={styles.filterWrapper}>
          <div className={`${styles.filterWrapper__header}`}>
            <div>
              {blogFilter?.size > 0 && (
                <span>Showing {blogs?.page?.item_total} results of </span>
              )}
              {blogCount > 0 && (
                <>
                  <span>{blogCount}</span> items
                </>
              )}
            </div>
            {blogFilter?.size > 0 && (
              <span className={`${styles.resetBtn}`} onClick={resetFilters}>
                Reset All
              </span>
            )}
          </div>

          <div className={`${styles.filterWrapper__content}`}>
            <div className={`${styles.tagList}`}>
              {blogs &&
                Object.values(tagsList())?.map((tag, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`${styles.tagBtn} ${blogFilter?.has(tag?.key) ? `${styles.tagBtnSelected}` : ""}`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag.display}
                  </button>
                ))}
            </div>
            {sliderProps?.show_search && (
              <div className={`${styles.blogSearch}`}>
                <input
                  type="text"
                  className={`${styles.blogSearch__input}`}
                  placeholder="Search here..."
                  maxLength="80"
                  value={searchText}
                  onChange={(e) => searchTextUpdate(e?.target?.value)}
                />
              </div>
            )}
          </div>
        </div>
        <div className={`${styles.blog__content}`}>
          <div className={`${styles.blog__contentLeft}`}>
            <div className={`${styles.filterList}`}>
              {sliderProps?.show_filters && blogFilter?.size > 0 && (
                <div className={`${styles.filterList}`}>Filtering by:</div>
              )}
              {sliderProps?.show_filters &&
                [...blogFilter?.values()].map((filter, index) => (
                  <div className={`${styles.filterItem}`} key={filter?.key}>
                    <span>{`${filter?.pretext}: ${filter?.display}`}</span>
                    <SvgWrapper
                      className={`${styles.filterItem__icon}`}
                      svgSrc="close"
                      onClick={() => removeFilter(filter)}
                    />
                  </div>
                ))}
            </div>
            {blogFilter?.size > 0 && blogs?.page?.item_total === 0 && (
              <EmptyState title="No blogs found"></EmptyState>
            )}
            <div className={`${styles.blogContainer__grid}`}>
              {blogs?.items?.map((blog, index) => (
                <FDKLink
                  key={`${blog.title}_${index}`}
                  to={`/blog/${blog.slug}`}
                  title={blog.title}
                >
                  <div className={`${styles.blog}`}>
                    <div className={`${styles.blog__image}`}>
                      <FyImage
                        src={
                          blog?.feature_image?.secure_url ||
                          sliderProps.fallback_image
                        }
                        alt={blog.title}
                        isLazyLoaded={false}
                        sources={[]}
                        placeholder={sliderProps.fallback_image}
                      />
                    </div>
                    <div className={`${styles.blog__info}`}>
                      <div className={`${styles.blog__meta}`}>
                        <span className={`${styles.blog__tag}`}>
                          {getBlogTag(blog?.tags)}
                        </span>
                        <span className={`${styles.blog__publishDate}`}>
                          {getFormattedDate(blog?.publish_date)}
                        </span>
                      </div>
                      <h2
                        className={`${styles.blog__title} ${styles.fontHeader}`}
                      >
                        {getBlogTitle(blog?.title)}
                      </h2>
                    </div>
                  </div>
                </FDKLink>
              ))}
            </div>
          </div>
          <div className={`${styles.blog__contentRight}`}>
            <BlogTabs fpi={fpi} {...sliderProps}></BlogTabs>
          </div>
        </div>
      </div>
      <BlogFooter {...footerProps}></BlogFooter>
    </div>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      id: "filter_tags",
      type: "text",
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
      type: "checkbox",
      id: "show_top_blog",
      label: "Show Top Viewed",
      default: true,
      info: "The Top Viewed section will display the latest five published blogs tagged with the 'top5' value",
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
      default: "infinite",
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

export default Blog;
