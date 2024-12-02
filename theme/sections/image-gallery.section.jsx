import React, { useEffect, useState, useRef } from "react";
import { FDKLink } from "fdk-core/components";

import Slider from "react-slick";

import styles from "../styles/sections/image-gallery.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import placeholder from "../assets/images/img-placeholder-1.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";

export function Component({ props, blocks, globalConfig, preset }) {
  const getGallery = blocks.length ? blocks : preset?.blocks;
  const {
    autoplay,
    play_slides,
    title,
    description,
    item_count,
    mobile_layout,
    desktop_layout,
    link,
  } = props;

  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const [config, setConfig] = useState({
    dots: getGallery.length > item_count?.value,
    speed: 500,
    slidesToShow: getGallery?.length < 4 ? getGallery.length : 4,
    slidesToScroll: getGallery?.length < 4 ? getGallery.length : 4,
    swipeToSlide: true,
    lazyLoad: "ondemand",
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
    // arrows: getGallery.length > item_count?.value || false,
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
    arrows: imagesForScrollView()?.length > item_count?.value,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          arrows: false,
          slidesToShow: getGallery.length < 3 ? getGallery.length : 3,
          slidesToScroll: getGallery.length < 3 ? getGallery.length : 3,
          swipe: true,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: getGallery?.length !== 1,
          centerPadding: "25px",
          swipe: true,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
        },
      },
    ],
  });

  useEffect(() => {
    setIsClient(true);
    if (autoplay?.value !== config.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplay: autoplay?.value,
      }));
    }

    if (item_count?.value !== config.slidesToShow) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        slidesToShow: item_count?.value,
        slidesToScroll: item_count?.value,
      }));
    }

    if (play_slides?.value * 1000 !== config.autoplaySpeed) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplaySpeed: play_slides?.value * 1000,
      }));
    }
  }, [autoplay, play_slides, item_count]);

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(isRunningOnClient() ? window.innerWidth : 0);
    }, 1500);

    if (isRunningOnClient()) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(isRunningOnClient() ? window?.innerWidth : 0);
    }, 100);
    handleResize();
  }, [mobile_layout, desktop_layout]);

  function getDesktopImage(block) {
    return block?.image?.value ? block?.image?.value : placeholder;
  }

  function getImgSrcSet() {
    if (globalConfig.img_hd) {
      return [
        { breakpoint: { min: 1024 }, width: 900 },
        { breakpoint: { min: 768 }, width: 500 },
        { breakpoint: { min: 481 }, width: 900 },
        { breakpoint: { max: 390 }, width: 800 },
      ];
    }
    return [
      { breakpoint: { min: 1024 }, width: 450 },
      { breakpoint: { min: 768 }, width: 250 },
      { breakpoint: { min: 481 }, width: 480 },
      { breakpoint: { max: 390 }, width: 390 },
    ];
  }

  function getWidthByCount() {
    if (windowWidth <= 768) {
      return getGallery?.length <= 3 ? getGallery?.length : 3;
    }
    return getGallery?.length < item_count?.value
      ? getGallery?.length
      : item_count?.value;
  }

  function imagesForStackedView() {
    const itemCount = item_count?.value;
    if (!isClient) {
      return getGallery.slice(0, itemCount);
    }
    if (!getGallery) return [];

    if (windowWidth <= 480) {
      return getGallery.slice(0, 8);
    }
    if (windowWidth <= 768) {
      return getGallery.slice(0, 9);
    }
    return getGallery.slice(0, itemCount * 2);
  }

  function imagesForScrollView() {
    const itemCount = item_count?.value;

    if (!getGallery) return [];

    if (windowWidth <= 480) {
      return getGallery;
    }
    if (windowWidth <= 768) {
      return getGallery.slice(0, 12);
    }
    return getGallery.slice(0, itemCount * 4);
  }

  function showStackedView() {
    if (
      (windowWidth > 768 && item_count?.value >= getGallery?.length) ||
      getGallery?.length === 1
    ) {
      return true;
    }
    if (!getGallery) return [];
    if (windowWidth <= 768) {
      return mobile_layout?.value === "grid";
    }
    return desktop_layout?.value === "grid";
  }
  function showScrollView() {
    if (windowWidth <= 768 && getGallery?.length > 1) {
      return mobile_layout?.value === "horizontal";
    } else if (item_count?.value < getGallery?.length) {
      return desktop_layout?.value === "horizontal";
    }
  }

  return (
    <div
      style={{
        paddingTop: "16px",
        paddingBottom: `${globalConfig.section_margin_bottom}px`,
      }}
    >
      <div>
        <div className={styles.titleBlock}>
          {(title?.value?.length > 0 || description?.value?.length > 0) && (
            <h2 className={styles.sectionHeading}>{title?.value}</h2>
          )}
          {description?.value?.length > 0 && (
            <p className={`${styles.description} ${styles.b2}`}>
              {description?.value}
            </p>
          )}
        </div>
        <noscript>
          <div
            className={`${styles.imageGrid}  ${
              item_count?.value > getGallery?.length && styles.singleItem
            }`}
            style={{
              "--per_row": item_count?.value,
              "--brand-item": getWidthByCount() || 1,
            }}
          >
            {imagesForStackedView().map(({ props: block }, index) => (
              <div key={index}>
                <FDKLink to={block?.link?.value}>
                  {getDesktopImage(block).length > 0 && (
                    <div className={styles.imgBlock}>
                      <FyImage
                        customClass={styles.imageGallery}
                        src={getDesktopImage(block)}
                        sources={getImgSrcSet()}
                      />
                    </div>
                  )}
                </FDKLink>
              </div>
            ))}
          </div>
        </noscript>
        {isClient && (
          <>
            <IntersectionObserverComponent>
              {showScrollView() && (
                <div
                  className={`${imagesForScrollView().length < 3 && styles["single-card-view"]}  ${styles.slideWrap}`}
                  style={{
                    "--slick-dots": `${Math.ceil(imagesForScrollView()?.length / item_count?.value) * 22 + 10}px`,
                  }}
                >
                  <Slider
                    {...config}
                    className={`
                      ${
                        imagesForScrollView()?.length / item_count?.value ===
                          0 || imagesForScrollView()?.length < item_count?.value
                          ? "no-nav"
                          : ""
                      } ${styles.customSlider}`}
                  >
                    {imagesForScrollView()?.map(({ props: block }, index) => (
                      <div key={index} className={styles.sliderView}>
                        {block?.link?.value?.length > 0 ? (
                          <FDKLink to={block?.link?.value}>
                            {getDesktopImage(block).length > 0 && (
                              <div className={styles.imgBlock}>
                                <FyImage
                                  customClass={styles.imageGallery}
                                  src={getDesktopImage(block, index)}
                                  sources={getImgSrcSet()}
                                  globalConfig={globalConfig}
                                />
                              </div>
                            )}
                          </FDKLink>
                        ) : (
                          <div className={styles.imgBlock}>
                            <FyImage
                              customClass={styles.imageGallery}
                              src={getDesktopImage(block, index)}
                              sources={getImgSrcSet()}
                              globalConfig={globalConfig}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </Slider>
                </div>
              )}
              {showStackedView() && (
                <div
                  className={`${styles.imageGrid}  ${
                    item_count?.value > getGallery?.length && styles.singleItem
                  }`}
                  style={{
                    "--per_row": item_count?.value,
                    "--brand-item": getWidthByCount() || 1,
                  }}
                >
                  {imagesForStackedView().map(({ props: block }, index) => (
                    <div key={index}>
                      <FDKLink to={block?.link?.value}>
                        {getDesktopImage(block).length > 0 && (
                          <div className={styles.imgBlock}>
                            <FyImage
                              customClass={styles.imageGallery}
                              src={getDesktopImage(block)}
                              sources={getImgSrcSet()}
                              globalConfig={globalConfig}
                            />
                          </div>
                        )}
                      </FDKLink>
                    </div>
                  ))}
                </div>
              )}
            </IntersectionObserverComponent>
          </>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Image Gallery",
  props: [
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "Auto Play Slides",
    },
    {
      type: "range",
      id: "play_slides",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "Change slides every",
      default: 3,
    },
    {
      type: "range",
      id: "item_count",
      min: 3,
      max: 5,
      step: 1,
      unit: "",
      label: "Items per row(Desktop)",
      default: 4,
      info: "Maximum items allowed per row for Horizontal view, for gallery max 5 are viewable and only 5 blocks are required",
    },
    {
      id: "mobile_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal scroll ",
        },
      ],
      default: "grid",
      label: "Mobile Layout",
      info: "Alignment of content",
    },
    {
      id: "desktop_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal scroll",
        },
      ],
      default: "horizontal",
      label: "Desktop Layout",
      info: "Items per row should be less than number of blocks to show horizontal scroll",
    },
    {
      type: "text",
      id: "title",
      default: "Customize Your Style",
      label: "Heading",
    },
    {
      type: "text",
      id: "description",
      default:
        "This flexible gallery lets you highlight key products and promotions, guiding customers to the right places.",
      label: "Description",
    },
  ],
  blocks: [
    {
      name: "Image card",
      type: "gallery",

      props: [
        {
          type: "image_picker",
          id: "image",
          label: "Image",
          default: "",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },

        {
          type: "url",
          id: "link",
          label: "Redirect",
          default: "",
          info: "Search Link Type",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
    ],
  },
};
