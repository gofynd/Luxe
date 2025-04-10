import React, { useEffect, useState, useRef, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";
import Slider from "react-slick";
import { useFPI } from "fdk-core/utils";
import styles from "../styles/sections/category-listing.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import useCategories from "../page-layouts/categories/useCategories";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import placeholderImage from "../assets/images/placeholder/categories-listing.png";
import CategoriesCard from "../components/categories-card/categories-card";
import { useGlobalTranslation } from "fdk-core/utils";
import { useParams } from "react-router-dom";

// check for FDKLink here
export function Component({ props, blocks, preset, globalConfig }) {
  const { locale } = useParams();
  const { t } = useGlobalTranslation("translation");
  const fpi = useFPI();
  const {
    getCategoriesByDepartment,
    setDepartmentCategories,
    departmentCategories,
  } = useCategories(fpi);
  const getGallery = departmentCategories.length ? departmentCategories : [];
  const defaultCategories = ["chair", "sofa", "plants_and_flowers", "bags"];

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
    show_category_name,
    category_name_position,
    category_name_placement,
    category_name_text_alignment,
  } = props;
  const [windowWidth, setWindowWidth] = useState();
  // const [departmentCategories, setDepartmentCategories] = useState([]);
  const [config, setConfig] = useState({
    dots: false,
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
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
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
      let departments = blocks?.reduce((acc, m) => {
        if (m?.props?.department.value) {
          acc.push(m?.props?.department.value);
        }
        return acc;
      }, []);
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
    if (config.arrows !== imagesForScrollView()?.length > item_count?.value) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        arrows: imagesForScrollView()?.length > item_count?.value,
        dots: imagesForScrollView()?.length > item_count?.value,
      }));
    }
  }, [autoplay, play_slides, item_count, imagesForScrollView()?.length]);

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

  function getDesktopImage(block) {
    return block?.banners?.portrait?.url || placeholderImage;
  }

  function getImgSrcSet() {
    if (globalConfig?.img_hd) {
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
        padding:
          windowWidth > 768
            ? `16px 16px ${(globalConfig?.section_margin_bottom || 0) + 16}px`
            : `16px 0  ${(globalConfig?.section_margin_bottom || 0) + 16}px`,
        "--bg-color": `${img_container_bg?.value || "#00000000"}`,
      }}
    >
      <div>
        <div className={styles.titleBlock}>
          {(title?.value?.length > 0 || cta_text?.value?.length > 0) && (
            <h2 className={`${styles.sectionHeading} fontHeader`}>
              {title?.value}
            </h2>
          )}
          {cta_text?.value?.length > 0 && (
            <p className={`${styles.description} b2`}>{cta_text?.value}</p>
          )}
        </div>
        <IntersectionObserverComponent>
          {departmentCategories.length > 0 && showScrollView() && (
            <div
              className={styles.slideWrap}
              style={{
                "--slick-dots": `${Math.ceil(imagesForScrollView()?.length / item_count?.value) * 22 + 10}px`,
              }}
            >
              <Slider
                className={`
                  ${imagesForScrollView()?.length <= item_count?.value
                    ? "no-nav"
                    : ""
                  } ${styles.customSlider}`}
                {...config}
              >
                {imagesForScrollView()?.map((category, index) => (
                  <div data-cardtype="'Categories'" key={index}>
                    {getDesktopImage(category).length > 0 && (
                      <div className={styles.sliderView}>
                        <CategoriesCard
                          config={{
                            category_name_placement:
                              category_name_placement?.value,
                            category_name_position:
                              category_name_position?.value,
                            category_name_text_alignment:
                              category_name_text_alignment?.value,
                            show_category_name: show_category_name?.value,
                            img_container_bg: img_container_bg?.value,
                            img_fill: img_fill?.value,
                          }}
                          url={convertActionToUrl(category.action)}
                          category={category}
                          img={{
                            src: getDesktopImage(category) || placeholderImage,
                            srcSet: getImgSrcSet(),
                          }}
                        />
                      </div>
                    )}
                  </div >
                ))
                }
              </Slider >
              {button_text?.value && (
                <div
                  className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
                >
                  <FDKLink
                    to={"/categories/"}
                  >
                    <button
                      type="button"
                      className={`btn-secondary ${styles["section-button"]} ${styles.fontBody}`}
                    >
                      {button_text?.value}
                    </button>
                  </FDKLink>
                </div>
              )}
            </div >
          )}
          {
            showStackedView() && !!departmentCategories.length && (
              <div
                className={`${styles.imageGrid} ${imagesForStackedView().length === 1 && styles.singleItem
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
                    <CategoriesCard
                      config={{
                        category_name_placement: category_name_placement?.value,
                        category_name_position: category_name_position?.value,
                        category_name_text_alignment:
                          category_name_text_alignment?.value,
                        show_category_name: show_category_name?.value,
                        img_container_bg: img_container_bg?.value,
                        img_fill: img_fill?.value,
                      }}
                      category={category}
                      url={convertActionToUrl(category.action)}
                      img={{
                        src: getDesktopImage(category) || placeholderImage,
                        srcSet: getImgSrcSet(),
                      }}
                    />
                  </div >
                ))
                }
              </div >
            )}
          {
            !departmentCategories.length && (
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
                    <div
                      style={{ "--gap": "24px" }}
                      className={`${styles[category_name_placement?.value]} ${styles[category_name_position?.value]}`}
                    >
                      <FyImage
                        backgroundColor={img_container_bg?.value}
                        customClass={`${styles.imageGallery} ${img_fill?.value ? styles.streach : ""
                          }`}
                        src={placeholderImage}
                      />
                      {show_category_name?.value && (
                        <div
                          className={`${styles["categories-name"]} h5 ${styles.fontBody} ${styles.inlineBlock}  ${styles[category_name_position?.value]} ${styles[category_name_text_alignment?.value]}`}
                          title={t(
                            `resource.section.categories.default_categories.${defaultCategories[index]}`
                          )}
                        >
                          {t(
                            `resource.section.categories.default_categories.${defaultCategories[index]}`
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </IntersectionObserverComponent >
        {button_text?.value &&
          (showStackedView() || !departmentCategories.length) && (
            <div
              className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
            >
              <FDKLink to={"/categories/"}>
                <button
                  type="button"
                  className={`btn-secondary ${styles["section-button"]} ${styles.fontBody}`}
                >
                  {button_text?.value}
                </button>
              </FDKLink>
            </div>
          )}
      </div >
    </div >
  );
}

export const settings = {
  label: "t:resource.sections.categories_listing.categories_listing",
  props: [
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "t:resource.common.auto_play_slides",
    },
    {
      type: "checkbox",
      id: "show_category_name",
      default: true,
      label: "t:resource.common.show_category_name",
    },
    {
      type: "select",
      id: "category_name_placement",
      label: "t:resource.sections.categories_listing.category_name_placement",
      default: "inside",
      info: "t:resource.common.category_name_placement_info",
      options: [
        {
          value: "inside",
          text: "t:resource.sections.categories_listing.inside_the_image",
        },
        {
          value: "outside",
          text: "t:resource.sections.categories_listing.outside_the_image",
        },
      ],
    },
    {
      id: "category_name_position",
      type: "select",
      options: [
        {
          value: "top",
          text: "t:resource.sections.categories_listing.top",
        },
        {
          value: "center",
          text: "t:resource.common.center",
        },
        {
          value: "bottom",
          text: "t:resource.sections.categories_listing.bottom",
        },
      ],
      default: "bottom",
      label: "t:resource.sections.categories_listing.category_name_position",
      info: "t:resource.sections.categories_listing.category_name_alignment",
    },
    {
      id: "category_name_text_alignment",
      type: "select",
      options: [
        {
          value: "text-left",
          text: "t:resource.common.left",
        },
        {
          value: "text-center",
          text: "t:resource.common.center",
        },
        {
          value: "text-right",
          text: "t:resource.common.right",
        },
      ],
      default: "text-center",
      label: "t:resource.sections.categories_listing.category_name_text_alignment",
      info: "t:resource.sections.categories_listing.align_category_name",
    },
    {
      type: "range",
      id: "play_slides",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "t:resource.common.change_slides_every",
      default: 3,
    },
    {
      type: "range",
      id: "item_count",
      min: 3,
      max: 5,
      step: 1,
      unit: "",
      label: "t:resource.sections.categories_listing.items_per_row_desktop",
      default: 4,
      info: "t:resource.sections.categories_listing.max_items_per_row_horizontal",
    },
    {
      type: "color",
      id: "img_container_bg",
      category: "t:resource.common.image_container",
      default: "#00000000",
      label: "t:resource.common.container_background_color",
      info: "t:resource.common.image_container_bg_color",
    },
    {
      type: "checkbox",
      id: "img_fill",
      category: "t:resource.common.image_container",
      default: true,
      label: "t:resource.common.fit_image_to_container",
      info: "t:resource.common.clip_image_to_fit_container",
    },
    {
      id: "mobile_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "t:resource.common.stack",
        },
        {
          value: "horizontal",
          text: "t:resource.common.horizontal_scroll",
        },
      ],
      default: "grid",
      label: "t:resource.common.mobile_layout",
      info: "t:resource.common.alignment_of_content",
    },
    {
      id: "desktop_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "t:resource.common.stack",
        },
        {
          value: "horizontal",
          text: "t:resource.common.horizontal_scroll",
        },
      ],
      default: "horizontal",
      label: "t:resource.sections.categories_listing.desktop_layout",
      info: "t:resource.common.alignment_of_content",
    },
    {
      type: "text",
      id: "title",
      default: "A True Style",
      label: "t:resource.common.heading",
    },
    {
      type: "text",
      id: "cta_text",
      default: "Be exclusive, Be Divine, Be yourself",
      label: "t:resource.common.description",
    },
    {
      type: "text",
      id: "button_text",
      default: "",
      label: "t:resource.common.button_text",
    },
  ],
  blocks: [
    {
      name: "t:resource.sections.categories_listing.category_item",
      type: "category",
      props: [
        {
          type: "department",
          id: "department",
          label: "t:resource.sections.categories_listing.select_department",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "t:resource.sections.categories_listing.category_item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "t:resource.sections.categories_listing.select_department",
          },
        ],
      },
      {
        name: "t:resource.sections.categories_listing.category_item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "t:resource.sections.categories_listing.select_department",
          },
        ],
      },
      {
        name: "t:resource.sections.categories_listing.category_item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "t:resource.sections.categories_listing.select_department",
          },
        ],
      },
      {
        name: "t:resource.sections.categories_listing.category_item",
        type: "category",
        props: [
          {
            type: "department",
            id: "department",
            label: "t:resource.sections.categories_listing.select_department",
          },
        ],
      },
    ],
  },
};
export default Component;
