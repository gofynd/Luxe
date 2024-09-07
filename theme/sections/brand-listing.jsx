import React, { useState, useEffect, useCallback } from "react";
import { isRunningOnClient } from "../helper/utils";
import styles from "../styles/sections/brand-listing.less";
import FyImage from "../components/core/fy-image/fy-image";
import Slider from "react-slick";
import { FDKLink } from "fdk-core/components";
import { BRAND_DETAILS } from "../queries/brandsQuery";
import placeHolder1X1 from "../assets/images/placeholder1X1.png";
import placeHolder9X16 from "../assets/images/placeholder9x16.png";
import { useGlobalStore } from "fdk-core/utils";

export function Component({ props, globalConfig, blocks, fpi }) {
  const {
    heading,
    description,
    logoOnly,
    per_row,
    layout_mobile,
    layout_desktop,
    img_fill,
    button_text,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [brands, setBrands] = useState(
    blocks?.reduce((acc, b) => {
      if (b?.props?.brand?.value?.id)
        return [...acc, b?.props?.brand?.value?.id];
      return acc;
    }, []) || []
  );
  const [windowWidth, setWindowWidth] = useState(
    isRunningOnClient() ? window?.innerWidth : 400
  );
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  useEffect(() => {
    if (customValues?.brandData?.length > 0) {
      setBrands(customValues?.brandData);
    }
  }, [JSON.stringify(blocks)]);

  useEffect(() => {
    if (isRunningOnClient()) {
      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
      };

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const getImgSrcSet = () => {
    if (globalConfig?.img_hd?.value) {
      return [
        { breakpoint: { min: 1024 }, width: 900 },
        { breakpoint: { min: 769 }, width: 800 },
        { breakpoint: { max: 768 }, width: 500 },
        { breakpoint: { max: 480 }, width: 300 },
      ];
    }
    return [
      { breakpoint: { min: 1024 }, width: 450 },
      { breakpoint: { min: 769 }, width: 416 },
      { breakpoint: { max: 768 }, width: 232 },
      { breakpoint: { max: 480 }, width: 136 },
    ];
  };
  console.log(brands, "brands");

  const showStackedView = () => {
    const hasBrands = (brands || []).length > 0;
    if (windowWidth <= 768) {
      return hasBrands && layout_mobile?.value === "stacked";
    }
    return hasBrands && layout_desktop?.value === "grid";
  };

  const showScrollView = () => {
    const hasBrands = (brands || []).length > 0;
    if (windowWidth <= 768) {
      return hasBrands && layout_mobile?.value === "horizontal";
    }
    return hasBrands && layout_desktop?.value === "horizontal";
  };

  const getBrandCount = () => {
    const perRowItem = per_row?.value;
    if (logoOnly?.value) {
      if (showScrollView()) {
        if (windowWidth >= 768 && windowWidth < 830)
          return brands?.slice(0, 12);
        if (windowWidth < 768) return brands?.slice(0, 12);
        return brands?.slice(0, perRowItem * 4);
      } else if (showStackedView()) {
        if (windowWidth >= 768 && windowWidth < 830) return brands?.slice(0, 9);
        if (windowWidth < 768) return brands?.slice(0, 9);
        return brands?.slice(0, perRowItem * 2);
      }
    } else if (showScrollView()) {
      if (windowWidth >= 768 && windowWidth < 830) return brands?.slice(0, 12);
      if (windowWidth < 768) return brands?.slice(0, 4);
      return brands?.slice(0, perRowItem * 4);
    } else if (showStackedView()) {
      if (windowWidth >= 768 && windowWidth < 830) return brands?.slice(0, 6);
      if (windowWidth < 768) return brands?.slice(0, 4);
      return brands?.slice(0, perRowItem * 2);
    }

    return [];
  };
  const getImgSrc = (card) => {
    return logoOnly?.value
      ? card?.data?.brand?.logo?.url
      : card?.data?.brand?.banners?.portrait?.url || getPlaceHolder();
  };

  const slickSetting = {
    dots: false,
    arrows: true,
    focusOnSelect: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    // adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
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
          slidesToShow: logoOnly?.value ? 3 : 1,
          slidesToScroll: logoOnly?.value ? 3 : 1,
          centerMode: !(logoOnly?.value || getBrandCount()?.length === 1),
          centerPadding: "25px",
        },
      },
    ],
  };

  const isDemoBlock = () => {
    const brands =
      blocks?.reduce((acc, b) => {
        if (b?.props?.brand?.value?.id) {
          return [...acc, b?.props?.brand?.value?.id];
        }
        return acc;
      }, []) || [];
    return brands.length === 0;
  };

  const dynamicStyles = {
    paddingBottom: "16px",
    marginBottom: `
    ${globalConfig.section_margin_bottom}px`,
  };

  const getPlaceHolder = () => {
    return logoOnly?.value ? placeHolder1X1 : placeHolder9X16;
  };

  const logoPlaceholderSrc = () => {
    return placeHolder1X1;
  };

  return (
    <div style={dynamicStyles}>
      <div>
        <div>
          {heading?.value && (
            <h2
              className={`${styles["section-heading"]} fontHeader ${
                logoOnly?.value ? styles["logo-only"] : ""
              }`}
            >
              {heading.value}
            </h2>
          )}
          {description?.value && (
            <p className={`${styles["section-description"]} b-small fontBody`}>
              {description.value}
            </p>
          )}
        </div>
        {showStackedView() && (
          <div
            className={`${styles["categories-block"]} ${
              logoOnly?.value ? styles.logoWidth : styles.nonLogoMaxWidth
            } ${styles[`card-count-${per_row?.value}`]}`}
            style={{ "--brand-item": per_row?.value }}
          >
            {getBrandCount().map((card, index) => (
              <div
                key={index}
                //   className={`${styles["animation-fade-up"]}`}
                style={{ "--delay": `${150 * (index + 1)}ms` }}
              >
                <FDKLink to={`/products/?brand=${card?.data?.brand?.slug}`}>
                  <div
                    data-cardtype="BRANDS"
                    className={styles["pos-relative"]}
                  >
                    <FyImage
                      className={`${
                        !logoOnly?.value ? styles["brand-image"] : ""
                      } ${img_fill?.value ? styles.streach : ""}`}
                      src={getImgSrc(card)}
                      alt={card?.data?.brand?.name || ""}
                      style={{
                        aspectRatio: logoOnly?.value ? "1" : "0.8",
                        "--mobile-aspect-ratio": logoOnly?.value ? "1" : "0.8",
                      }}
                      srcSet={getImgSrcSet()}
                    />
                    {card?.data?.brand?.name?.length > 0 &&
                      !logoOnly?.value && (
                        <div className={styles["brand-info"]}>
                          <div className={styles["brand-logo"]}>
                            <FyImage
                              src={
                                card?.data?.brand?.logo?.url
                                  ? card?.data?.brand?.logo?.url
                                  : logoPlaceholderSrc()
                              }
                              alt={card?.data?.brand?.name || ""}
                              style={{
                                aspectRatio: "1",
                                "--mobile-aspect-ratio": "1",
                              }}
                              srcSet={JSON.stringify([
                                { breakpoint: { min: 769 }, width: 60 },
                                { breakpoint: { max: 768 }, width: 60 },
                                { breakpoint: { max: 480 }, width: 60 },
                              ])}
                            />
                          </div>
                          <span className={styles.fontBody}>
                            {card?.data?.brand?.name}
                          </span>
                        </div>
                      )}
                  </div>
                </FDKLink>
              </div>
            ))}
          </div>
        )}
        {showScrollView() && getBrandCount().length > 0 && (
          <div
            className={`${styles["categories-horizontal"]} ${
              styles[`card-count-${per_row?.value}`]
            } ${logoOnly?.value ? "logoWidth" : ""} ${
              getBrandCount().length === 1 ? styles["single-card"] : ""
            }`}
            style={{ "--brand-item": per_row?.value }}
          >
            <Slider
              style={{ maxWidth: "100vw" }}
              className={`${styles["brands-carousel"]} ${logoOnly?.value ? styles["logo-carousel"] : ""}`}
              {...slickSetting}
            >
              {!isLoading &&
                getBrandCount().map((card, index) => (
                  <div key={index}>
                    <div
                      // className={`${styles["animation-fade-up"]}`}
                      style={{ "--delay": `${150 * (index + 1)}ms` }}
                    >
                      <FDKLink
                        link={`/products/?brand=${card?.data?.brand?.slug}`}
                      >
                        <div
                          data-cardtype="BRANDS"
                          style={{ position: "relative" }}
                        >
                          <FyImage
                            className={`${styles["brand-image"]} ${
                              !logoOnly?.value ? "" : styles.streach
                            }`}
                            src={getImgSrc(card)}
                            aspectRatio={logoOnly?.value ? 1 : 0.8}
                            mobileAspectRatio={logoOnly?.value ? 1 : 0.8}
                            sources={getImgSrcSet()}
                          />
                          {card?.data?.brand?.name?.length > 0 &&
                            !logoOnly?.value && (
                              <div className={styles["brand-info"]}>
                                <div className={styles["brand-logo"]}>
                                  <FyImage
                                    src={
                                      card?.data?.brand?.logo?.url
                                        ? card?.data?.brand?.logo?.url
                                        : logoPlaceholderSrc()
                                    }
                                    aspectRatio={1}
                                    mobileAspectRatio={1}
                                    sources={[
                                      { breakpoint: { min: 769 }, width: 60 },
                                      { breakpoint: { max: 768 }, width: 60 },
                                      { breakpoint: { max: 480 }, width: 60 },
                                    ]}
                                  />
                                </div>
                                <span className={styles["font-body"]}>
                                  {card?.data?.brand?.name}
                                </span>
                              </div>
                            )}
                        </div>
                      </FDKLink>
                    </div>
                  </div>
                ))}
            </Slider>
          </div>
        )}

        {isDemoBlock() && (
          <div
            className={`${styles.defaultBrandBlock} ${
              logoOnly?.value ? styles.logoWidth : styles.nonLogoMaxWidth
            } ${styles["card-count-4"]}`}
          >
            {[...Array(4)].map((_, index) => (
              <div key={index}>
                <div data-cardtype="BRANDS" className={styles["pos-relative"]}>
                  <FyImage
                    className={`${styles.streach} ${
                      logoOnly?.value ? styles["brand-image"] : ""
                    }}`}
                    src={getPlaceHolder()}
                    aspectRatio={logoOnly?.value ? 1 : 0.8}
                    mobileAspectRatio={logoOnly?.value ? 1 : 0.8}
                    sources={getImgSrcSet()}
                  />

                  {!logoOnly?.value && (
                    <div className={styles["brand-info"]}>
                      <div className={styles["brand-logo"]}>
                        <FyImage
                          src={logoPlaceholderSrc()}
                          aspectRatio={1}
                          mobileAspectRatio={1}
                          sources={[
                            { breakpoint: { min: 769 }, width: 60 },
                            { breakpoint: { max: 768 }, width: 60 },
                            { breakpoint: { max: 480 }, width: 60 },
                          ]}
                        />
                      </div>
                      <span className={styles.fontBody}>{`BRAND ${
                        index + 1
                      }`}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div
          className={`${styles["flex-justify-center"]} ${styles["gap-above-button"]}`}
        >
          <FDKLink to="/brands/">
            {button_text?.value && (
              <button
                type="button"
                className={`${styles["section-button"]} ${styles["btn-secondary"]}`}
              >
                {button_text?.value}
              </button>
            )}
          </FDKLink>
        </div>
      </div>
    </div>
  );
}

export const settings = {
  label: "Brands Listing",
  props: [
    {
      type: "range",
      id: "per_row",
      label: "Display brands per row (desktop)",
      min: "3",
      max: "5",
      step: "1",
      info: "It'll not work for mobile layout",
      default: "4",
    },
    {
      type: "checkbox",
      id: "logoOnly",
      default: false,
      label: "Logo Only",
      info: "Show Logo of brands",
    },
    {
      id: "layout_mobile",
      type: "select",
      options: [
        {
          value: "stacked",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal",
        },
      ],
      default: "stacked",
      label: "Mobile Layout",
      info: "Alignment of content",
    },
    {
      id: "layout_desktop",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal",
        },
      ],
      default: "grid",
      label: "Desktop Layout",
      info: "Alignment of content",
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
      type: "text",
      id: "heading",
      default: "Our Top Brands",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "textarea",
      id: "description",
      default: "All is unique no matter how you put it",
      label: "Description",
      info: "Description text of the section",
    },
    {
      type: "text",
      id: "button_text",
      default: "VIEW ALL",
      label: "Button Text",
    },
  ],
  blocks: [
    {
      type: "category",
      name: "Brand Item",
      props: [
        {
          type: "brand",
          id: "brand",
          label: "Select Brand",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Brand Item",
      },
      {
        name: "Brand Item",
      },
      {
        name: "Brand Item",
      },
      {
        name: "Brand Item",
      },
    ],
  },
};

Component.serverFetch = async ({ fpi, blocks }) => {
  try {
    const promisesArr = [];
    blocks.map(async (block) => {
      if (block?.props?.brand?.value) {
        const res = fpi.executeGQL(BRAND_DETAILS, {
          slug: block.props.brand.value.id,
        });
        if (res !== undefined) {
          promisesArr.push(res);
        }
      }
    });
    const responses = await Promise.all(promisesArr);
    return fpi.custom.setValue("brandData", responses);
  } catch (err) {
    console.log(err);
  }
};
