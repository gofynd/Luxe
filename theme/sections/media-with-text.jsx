import React, { useState } from "react";
import { FDKLink } from "fdk-core/components";

import { getGlobalConfigValue } from "../helper/utils";
import FyImage from "../components/core/fy-image/fy-image";
import styles from "../styles/sections/media-with-text.less";

export function Component({ props, globalConfig }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const {
    image_desktop,
    image_mobile,
    banner_link,
    title,
    description,
    button_text,
    align_text_desktop,
  } = props;

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

  const dynamicStyles = {
    "padding-bottom": "16px",
    "margin-bottom": `${globalConfig?.section_margin_bottom}px`,
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
        />
      </div>
      <div className={styles.media_text__info}>
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
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "image_picker",
      id: "image_mobile",
      label: "mobile Image",
      default: "",
      options: {
        aspect_ratio: "320:467",
        aspect_ratio_strict_check: true,
      },
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
};
