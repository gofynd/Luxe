import React, { useState, useEffect } from "react";
import { FDKLink } from "fdk-core/components";
import FyImage from "@gofynd/theme-template/components/core/fy-image/fy-image";
import "@gofynd/theme-template/components/core/fy-image/fy-image.css";
import styles from "../styles/sections/media-with-text.less";
import { isRunningOnClient } from "../helper/utils";
import Hotspot from "../components/hotspot/product-hotspot";
import { FEATURE_PRODUCT_DETAILS } from "../queries/featureProductQuery";

export function Component({ props, globalConfig, blocks, fpi }) {
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState([]);
  const {
    image_desktop,
    image_mobile,
    banner_link,
    title,
    description,
    button_text,
    align_text_desktop,
    text_alignment,
  } = props;

  // const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const getMobileImage = () =>
    image_mobile?.value !== ""
      ? image_mobile?.value
      : require("../assets/images/placeholder9x16.png");

  const getDesktopImage = () =>
    image_desktop?.value !== ""
      ? image_desktop?.value
      : require("../assets/images/placeholder16x9.png");

  const getImgSrcSet = () => {
    if (globalConfig?.img_hd) {
      return [
        {
          breakpoint: { min: 1400 },
          width: 2500,
        },
        {
          breakpoint: { min: 1023 },
          width: 2200,
        },
        {
          breakpoint: { min: 800 },
          width: 1500,
        },
        {
          breakpoint: { min: 768 },
          width: 1400,
        },
        {
          breakpoint: { min: 481 },
          width: 1000,
        },
        {
          breakpoint: { max: 480 },
          width: 900,
          url: getMobileImage(),
        },
      ];
    }
    return [
      {
        breakpoint: { min: 1400 },
        width: 1500,
      },
      {
        breakpoint: { min: 1023 },
        width: 1200,
      },
      {
        breakpoint: { min: 800 },
        width: 850,
      },
      {
        breakpoint: { min: 768 },
        width: 780,
      },
      {
        breakpoint: { min: 481 },
        width: 500,
      },
      {
        breakpoint: { max: 480 },
        width: 450,
        url: getMobileImage(),
      },
    ];
  };
  const getProductSlugs = () => {
    return (
      blocks?.reduce((acc, block) => {
        const productSlug = block?.props?.product?.value;
        if (productSlug && !acc.includes(productSlug)) {
          acc.push(productSlug);
        }
        return acc;
      }, []) || []
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const productSlugs = getProductSlugs();
      if (!productSlugs.length) {
        return;
      }
      try {
        const results = await Promise.all(
          productSlugs.map((slug) =>
            fpi
              .executeGQL(
                FEATURE_PRODUCT_DETAILS,
                { slug },
                { skipStoreUpdate: true }
              )
              .then((result) => ({
                uid: result?.data?.product?.uid,
                data: result,
              }))
          )
        );
        // Aggregate only the data field into a single array
        const aggregatedResults = results.map(({ data }) => data);
        setProducts(aggregatedResults);
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, []);

  const getFormattedProducts = () => {
    return getProductSlugs()?.reduce((acc, slug, index) => {
      acc[slug] = products?.[index]?.data?.product;
      return acc;
    }, {});
  };
  const getHotspots = () => {
    return {
      desktop: blocks?.filter((block) => block?.type === "hotspot_desktop"),
      mobile: blocks?.filter((block) => block?.type === "hotspot_mobile"),
    };
  };
  useEffect(() => {
    if (isRunningOnClient()) {
      const localDetectMobileWidth = () =>
        document?.getElementsByTagName("body")?.[0]?.getBoundingClientRect()
          ?.width <= 768;

      const handleResize = () => {
        // setWindowWidth(window?.innerWidth);
      };
      setIsMobile(localDetectMobileWidth());

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const mapAlignment = {
    top_left: {
      justifyContent: "unset",
      alignItems: "flex-start",
      textAlign: "left",
    },
    top_center: {
      justifyContent: "unset",
      alignItems: "center",
      textAlign: "center",
    },
    top_right: {
      justifyContent: "unset",
      alignItems: "flex-end",
      textAlign: "right",
    },
    center_center: {
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    },
    center_left: {
      justifyContent: "center",
      alignItems: "flex-start",
      textAlign: "left",
    },
    center_right: {
      justifyContent: "center",
      alignItems: "flex-end",
      textAlign: "right",
    },
    bottom_left: {
      justifyContent: "flex-end",
      alignItems: "flex-start",
      textAlign: "left",
    },
    bottom_right: {
      justifyContent: "flex-end",
      alignItems: "flex-end",
      textAlign: "right",
    },
    bottom_center: {
      justifyContent: "flex-end",
      alignItems: "center",
      textAlign: "center",
    },
  };

  const dynamicStyles = {
    paddingBottom: `${globalConfig?.section_margin_bottom}px`,
  };

  return (
    <div
      className={`${styles.media_text} ${align_text_desktop?.value && styles["media_text--invert"]}`}
      style={dynamicStyles}
    >
      <div className={styles["media_text__image-wrapper"]}>
        <FyImage
          customClass={styles.imageWrapper}
          src={getDesktopImage()}
          aspectRatio={314 / 229}
          mobileAspectRatio={320 / 467}
          sources={getImgSrcSet()}
          isFixedAspectRatio={false}
        />
        {!isMobile &&
          getHotspots()?.desktop?.map((hotspot, index) => (
            <Hotspot
              className={styles["hotspot--desktop"]}
              key={index}
              hotspot={hotspot}
              product={getFormattedProducts()?.[hotspot?.props?.product?.value]}
            />
          ))}
        {isMobile &&
          getHotspots()?.mobile?.map((hotspot, index) => (
            <Hotspot
              className={styles["hotspot--mobile"]}
              key={index}
              hotspot={hotspot}
              isMobile={isMobile}
              product={getFormattedProducts()?.[hotspot?.props?.product?.value]}
            />
          ))}
      </div>

      <div
        className={styles.media_text__info}
        style={mapAlignment[text_alignment?.value]}
      >
        {title?.value && (
          <h2 className={`${styles.media_text__heading} fontHeader`}>
            {title?.value}
          </h2>
        )}
        {description?.value && (
          <p className={`${styles.media_text__description} fontBody`}>
            {description?.value}
          </p>
        )}
        {button_text?.value && (
          <FDKLink
            className={`${styles.media_text__cta} btnSecondary fontBody`}
            to={banner_link?.value}
          >
            {button_text?.value}
          </FDKLink>
        )}
      </div>
    </div>
  );
}
export const settings = {
  label: "Media with Text",
  props: [
    {
      type: "image_picker",
      id: "image_desktop",
      label: "Desktop Image",
      default: "",
      options: {
        aspect_ratio: "314:229",
      },
    },
    {
      type: "image_picker",
      id: "image_mobile",
      label: "mobile Image",
      default: "",
      options: {
        aspect_ratio: "320:467",
      },
    },
    {
      id: "text_alignment",
      type: "select",
      options: [
        {
          value: "top_left",
          text: "Top Left",
        },
        {
          value: "top_center",
          text: "Top Center",
        },
        {
          value: "top_right",
          text: "Top Right",
        },
        {
          value: "center_center",
          text: "Center Center",
        },
        {
          value: "center_left",
          text: "Center Left",
        },
        {
          value: "center_right",
          text: "Center Right",
        },
        {
          value: "bottom_left",
          text: "Bottom Left",
        },
        {
          value: "bottom_right",
          text: "Bottom Right",
        },
        {
          value: "bottom_center",
          text: "Bottom Center",
        },
      ],
      default: "center_left",
      label: "Text Alignment",
      info: "Alignment of text content",
    },

    {
      type: "url",
      id: "banner_link",
      default: "",
      label: "Redirect Link",
    },
    {
      type: "text",
      id: "title",
      default: "",
      label: "Heading",
    },
    {
      type: "textarea",
      id: "description",
      default: "",
      label: "Description",
    },
    {
      type: "text",
      id: "button_text",
      default: "",
      label: "Button Text",
    },
    {
      type: "checkbox",
      id: "align_text_desktop",
      default: false,
      label: "Invert Section",
      info: "Reverse the section on desktop",
    },
  ],
  blocks: [
    {
      type: "hotspot_desktop",
      name: "Hotspot Desktop",
      props: [
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Vertical Position",
          default: 50,
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Horizontal Position",
          default: 50,
        },
        {
          type: "product",
          name: "Product",
          id: "product",
          label: "Select a Product",
          info: "Product Item to be displayed",
        },
      ],
    },
    {
      type: "hotspot_mobile",
      name: "Hotspot Mobile",
      props: [
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Vertical Position",
          default: 50,
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Horizontal Position",
          default: 50,
        },
        {
          type: "product",
          name: "Product",
          id: "product",
          label: "Select a Product",
          info: "Product Item to be displayed",
        },
      ],
    },
  ],
};
export default Component;
