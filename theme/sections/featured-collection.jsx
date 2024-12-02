import React, { useEffect, useRef, useState } from "react";
import { FDKLink } from "fdk-core/components";
import { useGlobalStore } from "fdk-core/utils";

import Slider from "react-slick";
import ProductCard from "fdk-react-templates/components/product-card/product-card";
import styles from "../styles/sections/featured-collection.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import placeholder from "../assets/images/img-placeholder-1.png";
import { FEATURED_COLLECTION } from "../queries/collectionsQuery";
import "fdk-react-templates/components/product-card/product-card.css";
import bannerPlaceholder from "../assets/images/collection-banner-placeholder.png";
import imagePlaceholder from "../assets/images/placeholder3x4.png";

export function Component({ props, globalConfig, fpi }) {
  const bannerRef = useRef(null);

  const {
    autoplay,
    play_slides,
    heading,
    description,
    item_count,
    mobile_layout,
    desktop_layout,
    img_fill,
    img_container_bg,
    button_text,
    collection,
  } = props;
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const getGallery =
    customValues?.[`featuredCollectionData-${collection?.value}`]?.data
      ?.collection?.products?.items ?? [];
  const bannerUrl =
    customValues?.[`featuredCollectionData-${collection?.value}`]?.data
      ?.collection?.banners?.portrait?.url || bannerPlaceholder;
  const imgAlt =
    customValues?.[`featuredCollectionData-${collection?.value}`]?.data
      ?.collection?.banners?.portrait?.alt || "collection";
  const slug =
    customValues?.[`featuredCollectionData-${collection?.value}`]?.data
      ?.collection?.slug ?? "";
  const [windowWidth, setWindowWidth] = useState(0);
  // const [getGallery, setGetGallery] = useState([]);
  // const [slug, setSlug] = useState("");
  // const [bannerUrl, setBannerUrl] = useState("");
  // const [imgAlt, setImgAlt] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [config, setConfig] = useState({
    dots: true,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    swipeToSlide: true,
    lazyLoad: "ondemand",
    autoplay: false,
    autoplaySpeed: 3000,
    cssEase: "linear",
    arrows: false,
    adaptiveHeight: true,
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
    responsive: [
      {
        breakpoint: 780,
        settings: {
          arrows: false,
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true,
          swipe: true,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
        },
      },
      {
        breakpoint: 500,
        settings: {
          dots: false,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "30px",
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
    setWindowWidth(isRunningOnClient() ? window.innerWidth : 0);
    setIsClient(true);
    if (
      collection?.value &&
      !customValues?.[`featuredCollectionData-${collection?.value}`]
    ) {
      const payload = {
        slug: collection?.value,
        first: 12,
        pageNo: 1,
      };
      fpi.executeGQL(FEATURED_COLLECTION, payload).then((res) => {
        return fpi.custom.setValue(
          `featuredCollectionData-${collection?.value}`,
          res
        );
      });
    }
  }, [collection]);

  const bannerConfig = {
    dots: false,
    speed: 500,
    slidesToShow: 2.5,
    slidesToScroll: 2,
    infinite: false,
    cssEase: "linear",
    lazyLoad: "ondemand",
    arrows: false,
    centerMode: false,
    responsive: [
      {
        breakpoint: 780,
        settings: {
          arrows: false,
          dots: true,
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
          centerPadding: "4px",
        },
      },
    ],
  };

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
        arrows: true,
        dots: true,
      }));
    }
  }, [autoplay, play_slides, item_count, imagesForScrollView()?.length]);

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
      return getGallery.slice(0, 4);
    }
    if (windowWidth <= 768) {
      return getGallery.slice(0, 6);
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
      return (
        mobile_layout?.value === "grid" ||
        mobile_layout?.value === "banner_stacked"
      );
    }
    return desktop_layout?.value === "grid";
  }
  function showScrollView() {
    if (windowWidth <= 768) {
      return mobile_layout?.value === "horizontal";
    }
    return desktop_layout?.value === "horizontal";
  }
  function showBannerScrollView() {
    if (windowWidth <= 768) {
      return mobile_layout?.value === "banner_horizontal_scroll";
    }
    return desktop_layout?.value === "banner_horizontal_scroll";
  }

  return (
    <div
      className={styles.sectionWrapper}
      style={{
        paddingBottom: `${globalConfig.section_margin_bottom}px`,
        "--bg-color": `${img_container_bg?.value || "#00000000"}`,
      }}
    >
      <div>
        {(!showBannerScrollView() || windowWidth <= 768) && (
          <div className={styles.titleBlock}>
            {heading?.value?.length > 0 && (
              <h2 className={styles.sectionHeading}>{heading?.value}</h2>
            )}
            {description?.value?.length > 0 && (
              <p className={`${styles.description} ${styles.b2}`}>
                {description?.value}
              </p>
            )}
          </div>
        )}
        <IntersectionObserverComponent>
          {isClient && (
            <>
              {showBannerScrollView() && getGallery?.length > 0 && (
                <div className={styles.bannerImageSliderWrap}>
                  <FDKLink
                    to={`/collection/${slug}`}
                    className={styles.bannerImage}
                  >
                    <FyImage
                      globalConfig={globalConfig}
                      src={bannerUrl}
                      sources={getImgSrcSet()}
                      aspectRatio="0.8"
                      mobileAspectRatio="0.8"
                      alt={imgAlt}
                    />
                  </FDKLink>
                  <div className={styles.slideWrapBanner}>
                    <div
                      className={styles.titleBlock}
                      style={{ paddingLeft: "10px" }}
                    >
                      {heading?.value?.length > 0 && (
                        <h2
                          className={styles.sectionHeading}
                          style={{ textAlign: "left" }}
                        >
                          {heading?.value}
                        </h2>
                      )}
                      {description?.value?.length > 0 && (
                        <p
                          className={`${styles.description} ${styles.b2}`}
                          style={{ textAlign: "left" }}
                        >
                          {description?.value}
                        </p>
                      )}
                    </div>
                    <div className={styles.slWrap}>
                      <Slider {...bannerConfig} ref={bannerRef}>
                        {imagesForScrollView()?.map((product, index) => (
                          <div key={index} className={styles.sliderView}>
                            <FDKLink to={`/product/${product.slug}`}>
                              <ProductCard
                                product={product}
                                isSaleBadgeDisplayed={false}
                                isWishlistDisplayed={false}
                                isWishlistIcon={false}
                                isImageFill={img_fill?.value}
                                isPrice={globalConfig?.show_price}
                                centerAlign={
                                  windowWidth <= 480
                                    ? mobile_layout?.value !==
                                      "banner_horizontal_scroll"
                                    : desktop_layout?.value !==
                                      "banner_horizontal_scroll"
                                }
                                imagePlaceholder={imagePlaceholder}
                              />
                            </FDKLink>
                          </div>
                        ))}
                      </Slider>
                      <span
                        className={styles.customNextBtn}
                        onClick={() => bannerRef.current.slickNext()}
                      >
                        <SvgWrapper svgSrc="arrow-right" />
                      </span>
                    </div>
                    {button_text?.value && (
                      <div
                        className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
                      >
                        <FDKLink to={`/collection/${slug}`}>
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
              )}
              {getGallery.length > 0 && showScrollView() && (
                <div
                  className={styles.slideWrap}
                  style={{
                    "--slick-dots": `${Math.ceil(imagesForScrollView()?.length / item_count?.value) * 22 + 10}px`,
                  }}
                >
                  <Slider {...config}>
                    {imagesForScrollView()?.map((product, index) => (
                      <div key={index} className={styles.sliderView}>
                        <FDKLink to={`/product/${product.slug}`}>
                          <ProductCard
                            product={product}
                            isSaleBadgeDisplayed={false}
                            isWishlistDisplayed={false}
                            isWishlistIcon={false}
                            isImageFill={img_fill?.value}
                            isPrice={globalConfig?.show_price}
                            centerAlign={
                              windowWidth <= 480
                                ? mobile_layout?.value !==
                                  "banner_horizontal_scroll"
                                : desktop_layout?.value !==
                                  "banner_horizontal_scroll"
                            }
                            imagePlaceholder={imagePlaceholder}
                          />
                        </FDKLink>
                      </div>
                    ))}
                  </Slider>
                </div>
              )}

              {showStackedView() && getGallery.length > 0 && (
                <>
                  {windowWidth <= 768 &&
                    mobile_layout?.value === "banner_stacked" && (
                      <FDKLink
                        to={`/collection/${slug}`}
                        className={styles.bannerImage}
                        style={{ marginBottom: "24px", display: "block" }}
                      >
                        <FyImage
                          globalConfig={globalConfig}
                          src={bannerUrl}
                          sources={getImgSrcSet()}
                          aspectRatio="0.8"
                          mobileAspectRatio="0.8"
                          alt={imgAlt}
                        />
                      </FDKLink>
                    )}

                  <div
                    className={`${styles.imageGrid} ${
                      imagesForStackedView().length === 1 && styles.singleItem
                    }`}
                    style={{
                      "--per_row": item_count?.value,
                      "--brand-item": getWidthByCount() || 1,
                    }}
                  >
                    {imagesForStackedView().map((product, index) => (
                      <div key={index} className={styles["pos-relative"]}>
                        <FDKLink to={`/product/${product.slug}`}>
                          <ProductCard
                            product={product}
                            isSaleBadgeDisplayed={false}
                            isWishlistDisplayed={false}
                            isWishlistIcon={false}
                            isImageFill={img_fill?.value}
                            isPrice={globalConfig?.show_price}
                            centerAlign={
                              windowWidth <= 480
                                ? mobile_layout?.value !==
                                  "banner_horizontal_scroll"
                                : desktop_layout?.value !==
                                  "banner_horizontal_scroll"
                            }
                            imagePlaceholder={imagePlaceholder}
                          />
                        </FDKLink>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!getGallery.length && (
                <div className={styles.bannerImageSliderWrap}>
                  <div className={styles.bannerImage}>
                    <FyImage
                      globalConfig={globalConfig}
                      src={bannerUrl || bannerPlaceholder}
                      sources={getImgSrcSet()}
                      aspectRatio="0.8"
                      mobileAspectRatio="0.8"
                    />
                  </div>
                  <div className={styles.slideWrapBanner}>
                    <div
                      className={styles.titleBlock}
                      style={{ paddingLeft: "10px" }}
                    >
                      {heading?.value?.length > 0 && (
                        <h2
                          className={styles.sectionHeading}
                          style={{ textAlign: "left" }}
                        >
                          {heading?.value}
                        </h2>
                      )}
                      {description?.value?.length > 0 && (
                        <p
                          className={`${styles.description} ${styles.b2}`}
                          style={{ textAlign: "left" }}
                        >
                          {description?.value}
                        </p>
                      )}
                    </div>
                    <div style={{ display: "flex" }}>
                      {[1, 2, 3].map((category, index) => (
                        <div
                          key={index}
                          data-cardtype="'Categories'"
                          className={styles["pos-relative"]}
                          style={{ flex: "1" }}
                        >
                          <div style={{ padding: "0 12px" }}>
                            <FyImage
                              customClass={`${styles.imageGallery} ${
                                img_fill?.value ? styles.streach : ""
                              }`}
                              src={placeholder}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {button_text?.value && (
                      <div
                        className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
                      >
                        <FDKLink to={`/collection/${slug}`}>
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
              )}
            </>
          )}
        </IntersectionObserverComponent>
        <noscript>
          <div
            className={`${styles.imageGrid} ${
              imagesForStackedView().length === 1 && styles.singleItem
            }`}
            style={{
              "--per_row": item_count?.value,
              "--brand-item": getWidthByCount() || 1,
            }}
          >
            {imagesForStackedView().map((product, index) => (
              <div key={index} className={styles["pos-relative"]}>
                <FDKLink to={`/product/${product.slug}`}>
                  <ProductCard
                    product={product}
                    isSaleBadgeDisplayed={false}
                    isWishlistDisplayed={false}
                    isWishlistIcon={false}
                    isImageFill={img_fill?.value}
                    centerAlign={
                      windowWidth <= 480
                        ? mobile_layout?.valuet !== "banner_horizontal_scroll"
                        : desktop_layout?.value !== "banner_horizontal_scroll"
                    }
                    imagePlaceholder={imagePlaceholder}
                  />
                </FDKLink>
              </div>
            ))}
          </div>
        </noscript>

        {button_text?.value &&
          !showBannerScrollView() &&
          getGallery?.length > 0 && (
            <div
              className={`${styles["flex-justify-center"]} ${showScrollView() && isClient ? styles["gap-above-button-horizontal"] : styles["gap-above-button"]}`}
            >
              <FDKLink to={`/collection/${slug}`}>
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
  label: "Featured Collection",
  props: [
    {
      type: "collection",
      id: "collection",
      label: "Collection",
      info: "Select a collection to display its products",
    },
    {
      id: "desktop_layout",
      type: "select",
      options: [
        {
          value: "horizontal",
          text: "Horizontal scroll",
        },
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "banner_horizontal_scroll",
          text: "Banner with horizontal carousel",
        },
      ],
      default: "banner_horizontal_scroll",
      label: "Layout (Desktop)",
      info: "Alignment of content in desktop",
    },
    {
      id: "mobile_layout",
      type: "select",
      options: [
        {
          value: "horizontal",
          text: "Horizontal scroll",
        },
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "banner_horizontal_scroll",
          text: "Banner with horizontal scroll",
        },
        {
          value: "banner_stacked",
          text: "Banner with Stack",
        },
      ],
      default: "horizontal",
      label: "Layout (Mobile)",
      info: "Alignment of content in mobile",
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
      default: true,
      label: "Fit image to the container",
      info: "If the image aspect ratio is different from the container, the image will be clipped to fit the container. The aspect ratio of the image will be maintained",
    },
    {
      type: "text",
      id: "heading",
      default: "New Arrivals",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "text",
      id: "description",
      default:
        "Showcase your top collections here! Whether it's new arrivals, trending items, or special promotions, use this space to draw attention to what's most important in your store.",
      label: "Description",
      info: "Description text of the section",
    },
    {
      type: "text",
      id: "button_text",
      default: "View all",
      label: "Button text",
    },
    {
      type: "range",
      id: "item_count",
      min: 3,
      max: 5,
      step: 1,
      unit: "",
      label: "Products per row (Desktop)",
      default: 4,
      info: "Maximum items allowed per row",
    },
  ],
};

Component.serverFetch = async ({ fpi, props, id }) => {
  try {
    const payload = {
      slug: props.collection.value,
      first: 12,
      pageNo: 1,
    };
    await fpi.executeGQL(FEATURED_COLLECTION, payload).then((res) => {
      return fpi.custom.setValue(
        `featuredCollectionData-${props.collection.value}`,
        res
      );
    });
  } catch (err) {
    console.log(err);
  }
};
