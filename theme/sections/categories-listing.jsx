import React, { useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";

import Slider from "react-slick";

import styles from "../styles/sections/category-listing.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import useCategories from "../page-layouts/categories/useCategories";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import placeholder from "../assets/images/img-placeholder-1.png";

export function Component({ props, blocks, preset, globalConfig, fpi }) {
  const {
    getCategoriesByDepartment,
    setDepartmentCategories,
    departmentCategories,
  } = useCategories(fpi);
  const getGallery = departmentCategories.length ? departmentCategories : [];
  const defaultCategories = ["Chair", "Sofa", "Plants & Flowers", "Bags"];
  const {
    autoplay,
    play_slides,
    title,
    cta_text,
    item_count,
    mobile_layout,
    desktop_layout,
    img_fill,
    img_container_bg,
    button_text,
  } = props;
  const [windowWidth, setWindowWidth] = useState();
  // const [departmentCategories, setDepartmentCategories] = useState([]);
  const [config, setConfig] = useState({
    dots: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
    lazyLoad: true,
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    // arrows: getGallery.length > item_count?.value,
    // nextArrow: <SvgWrapper svgSrc="arrow-right" />,
    // prevArrow: <SvgWrapper svgSrc="arrow-left" />,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 780,
        settings: {
          arrows: false,
          slidesToShow: 3,
          slidesToScroll: 3,
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
        },
      },
    ],
  });

  useEffect(() => {
    const fetchAllCategories = async () => {
      let accumulatedCategories = [];
      let departments = blocks.map((m) => m?.props?.department.value);
      departments = [...new Set(departments)];

      for (const department of departments) {
        if (accumulatedCategories.length >= 12) break;
        /* eslint-disable-next-line no-await-in-loop */
        const newCategories = await getCategoriesByDepartment(department);
        accumulatedCategories = [
          ...accumulatedCategories,
          ...newCategories.slice(0, 12 - accumulatedCategories.length),
        ];
      }
      console.log(accumulatedCategories, "accumulatedCategories");
      setDepartmentCategories(accumulatedCategories);
    };

    fetchAllCategories();
  }, [blocks]);

  useEffect(() => {
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
    }, 500);

    if (isRunningOnClient()) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  function getDesktopImage(block) {
    return block?.banners?.portrait?.url || placeholder;
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
    if (windowWidth <= 768) {
      return mobile_layout?.value === "grid";
    }

    return desktop_layout?.value === "grid";
  }
  function showScrollView() {
    if (windowWidth <= 768) {
      return mobile_layout?.value === "horizontal";
    }

    return desktop_layout?.value === "horizontal";
  }

  return (
    <div
      style={{
        marginBottom: `${globalConfig.section_margin_bottom + 16}px`,
        "--bg-color": `${img_container_bg?.value || "#00000000"}`,
      }}
    >
      <div>
        <div className={styles.titleBlock}>
          {(title?.value?.length > 0 || cta_text?.value?.length > 0) && (
            <h2 className={styles.sectionHeading}>{title?.value}</h2>
          )}
          {cta_text?.value?.length > 0 && (
            <p className={`${styles.description} ${styles.b2}`}>
              {cta_text?.value}
            </p>
          )}
        </div>
        <IntersectionObserverComponent>
          {departmentCategories.length > 0 && showScrollView() && (
            <div className={styles.slideWrap}>
              <Slider {...config}>
                {imagesForScrollView()?.map((category, index) => (
                  <div data-cardtype="'Categories'" key={index}>
                    <FDKLink
                      to={convertActionToUrl(category.action)}
                      key={index}
                    >
                      {getDesktopImage(category).length > 0 && (
                        <div className={styles.sliderView}>
                          <FyImage
                            customClass={`${styles.imageGallery} ${
                              img_fill?.value ? styles.streach : ""
                            }`}
                            src={getDesktopImage(category)}
                            sources={getImgSrcSet()}
                            aspectRatio={0.8}
                            mobileAspectRatio={0.8}
                          />
                          <div className={styles.flexJustifyCenter}>
                            {category?.name && (
                              <div
                                className={`${styles["categories-name"]} ${styles.h5} ${styles.fontBody} ${styles.inlineBlock}`}
                                title={category.name}
                              >
                                {category.name}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </FDKLink>
                  </div>
                ))}
              </Slider>
            </div>
          )}
          {showStackedView() && departmentCategories.length && (
            <div
              className={`${styles.imageGrid} ${
                imagesForStackedView().length === 1 && styles.singleItem
              }`}
              style={{
                "--per_row": item_count?.value,
                "--brand-item": getWidthByCount() || 1,
              }}
            >
              {imagesForStackedView().map((category, index) => (
                <div
                  key={index}
                  data-cardtype="'Categories'"
                  className={styles["pos-relative"]}
                >
                  <FDKLink to={convertActionToUrl(category.action)}>
                    {getDesktopImage(category).length > 0 && (
                      <div>
                        <FyImage
                          customClass={`${styles.imageGallery} ${
                            img_fill?.value ? styles.streach : ""
                          }`}
                          src={getDesktopImage(category)}
                          sources={getImgSrcSet()}
                          aspectRatio={0.8}
                          mobileAspectRatio={0.8}
                        />
                        <div className={styles.flexJustifyCenter}>
                          {category?.name && (
                            <div
                              className={`${styles["categories-name"]} ${styles.h5} ${styles.fontBody} ${styles.inlineBlock}`}
                              title={category.name}
                            >
                              {category.name}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </FDKLink>
                </div>
              ))}
            </div>
          )}
          {!departmentCategories.length && (
            <div
              className={`${styles.imageGrid} `}
              style={{
                "--per_row": item_count?.value,
                "--brand-item": getWidthByCount() || 1,
              }}
            >
              {preset?.blocks?.map((category, index) => (
                <div
                  key={index}
                  data-cardtype="'Categories'"
                  className={styles["pos-relative"]}
                >
                  <div style={{ padding: "0 12px" }}>
                    <FyImage
                      customClass={`${styles.imageGallery} ${
                        img_fill?.value ? styles.streach : ""
                      }`}
                      src={placeholder}
                    />
                    <div className={styles.flexJustifyCenter}>
                      <div
                        className={`${styles["categories-name"]} ${styles.h5} ${styles.fontBody} ${styles.inlineBlock}`}
                        title={defaultCategories?.[index]}
                      >
                        {defaultCategories?.[index]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </IntersectionObserverComponent>
        {button_text?.value && (
          <div
            className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
          >
            <FDKLink to="/categories/">
              <button
                type="button"
                className={`${styles["btn-secondary"]} ${styles["section-button"]} ${styles.fontBody}`}
              >
                {button_text?.value}
              </button>
            </FDKLink>
          </div>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Categories Listing",
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
      type: "color",
      id: "img_container_bg",
      category: "Image Container",
      default: "#00000000",
      label: "Container Background Color",
      info: "This color will be used as the container background color of the Product/Collection/Category/Brand images wherever applicable",
    },
    {
      type: "checkbox",
      id: "img_fill",
      category: "Image Container",
      default: false,
      label: "Fit image to the container",
      info: "If the image aspect ratio is different from the container, the image will be clipped to fit the container. The aspect ratio of the image will be maintained",
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
      info: "Alignment of content",
    },
    {
      type: "text",
      id: "title",
      default: "A True Style",
      label: "Heading",
    },
    {
      type: "text",
      id: "cta_text",
      default: "Be exclusive, Be Divine, Be yourself",
      label: "Description",
    },
    {
      type: "text",
      id: "button_text",
      default: "",
      label: "Button Text",
    },
  ],
  blocks: [
    {
      name: "Category Item",
      type: "category",
      props: [
        {
          type: "department",
          id: "department",
          label: "Select Department",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Category Item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "Select Department",
          },
        ],
      },
      {
        name: "Category Item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "Select Department",
          },
        ],
      },
      {
        name: "Category Item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "Select Department",
          },
        ],
      },
      {
        name: "Category Item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "Select Department",
          },
        ],
      },
    ],
  },
};
