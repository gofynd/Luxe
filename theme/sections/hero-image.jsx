import React, { useState, useEffect, useRef } from "react";
import { FDKLink } from "fdk-core/components";
import FyImage from "../components/core/fy-image/fy-image";
import { isRunningOnClient } from "../helper/utils";
import styles from "../styles/sections/hero-image.less";
import placeHolder9X16 from "../assets/images/placeholder9x16.png";
import placeHolder16X9 from "../assets/images/placeholder16x9.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";

export function Component({ props, globalConfig }) {
  const {
    button_link,
    button_text,
    description,
    desktop_banner,
    heading,
    invert_button_color,
    mobile_banner,
    overlay_option,
    text_alignment_desktop,
    text_alignment_mobile,
    text_placement_desktop,
    text_placement_mobile,
  } = props;
  const [windowWidth, setWindowWidth] = useState(
    isRunningOnClient() ? window?.innerWidth : 400
  );
  const [showHeroImages, setShowHeroImages] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (isRunningOnClient()) {
      setIsClient(true);
      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
      };

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const getMobileUrl = () => {
    return mobile_banner?.value !== "" ? mobile_banner?.value : "";
  };
  const getDesktopUrl = () => {
    return desktop_banner?.value !== "" ? desktop_banner?.value : "";
  };

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
          width: 800,
          url: getMobileUrl(),
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
        breakpoint: { max: 800 },
        width: 400,
        url: getMobileUrl(),
      },
    ];
  };

  const getOverlayPositionStyles = () => {
    const positions = {};
    const responsiveViews = ["mobile", "desktop"];

    responsiveViews.forEach((view) => {
      const overlayPosition =
        view === "mobile"
          ? text_placement_mobile?.value
          : text_placement_desktop?.value;

      const contentAlignment =
        view === "mobile"
          ? text_alignment_mobile?.value
          : text_alignment_desktop?.value;
      const isMobileDevice = windowWidth <= 480;

      const HORIZONTAL_SPACING_TABLET = "1.75rem";
      const HORIZONTAL_SPACING_DESKTOP = "2.5rem";

      const VERTICAL_SPACING_MOBILE = "1rem";
      const VERTICAL_SPACING_TABLET = "1.5rem";
      const VERTICAL_SPACING_DESKTOP = "4rem";

      if (contentAlignment) {
        positions[`--content-alignment-${view}`] = contentAlignment;
      }

      switch (overlayPosition) {
        case "top_left":
          if (view === "mobile" && isMobileDevice) {
            positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--top-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--left-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;
          }

          break;

        case "top_center":
          if (view === "mobile" && isMobileDevice) {
            positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--top-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--left-position-${view}`] = "50%";
            positions[`--transform-${view}`] = "translateX(-50%)";
          }

          break;

        case "top_right":
          if (view === "mobile" && isMobileDevice) {
            positions[`--top-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--top-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--right-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;
          }

          break;

        case "center_left":
          positions[`--top-position-${view}`] = "50%";
          positions[`--transform-${view}`] = "translateY(-50%)";
          positions[`--left-position-${view}`] =
            view === "mobile"
              ? HORIZONTAL_SPACING_TABLET
              : HORIZONTAL_SPACING_DESKTOP;

          break;

        case "center_center":
          positions[`--top-position-${view}`] = "50%";

          if (view === "mobile" && isMobileDevice) {
            positions[`--transform-${view}`] = "translateY(-50%)";
          } else {
            positions[`--left-position-${view}`] = "50%";
            positions[`--transform-${view}`] = "translate(-50%, -50%)";
          }

          break;

        case "center_right":
          positions[`--top-position-${view}`] = "50%";
          positions[`--transform-${view}`] = "translateY(-50%)";
          positions[`--right-position-${view}`] =
            view === "mobile"
              ? HORIZONTAL_SPACING_TABLET
              : HORIZONTAL_SPACING_DESKTOP;

          break;

        case "bottom_left":
          if (view === "mobile" && isMobileDevice) {
            positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--bottom-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--left-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;
          }

          break;

        case "bottom_center":
          if (view === "mobile" && isMobileDevice) {
            positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--bottom-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--left-position-${view}`] = "50%";
            positions[`--transform-${view}`] = "translateX(-50%)";
          }

          break;

        case "bottom_right":
          if (view === "mobile" && isMobileDevice) {
            positions[`--bottom-position-${view}`] = VERTICAL_SPACING_MOBILE;
          } else {
            positions[`--bottom-position-${view}`] =
              view === "mobile"
                ? VERTICAL_SPACING_TABLET
                : VERTICAL_SPACING_DESKTOP;
            positions[`--right-position-${view}`] =
              view === "mobile"
                ? HORIZONTAL_SPACING_TABLET
                : HORIZONTAL_SPACING_DESKTOP;
          }

          break;

        default:
          break;
      }
    });

    return positions;
  };

  const displayOverlay = () =>
    !!(overlay_option?.value && overlay_option?.value !== "no_overlay");

  const getOverlayColor = () =>
    overlay_option?.value === "black_overlay" ? "#000000" : "#ffffff";

  return (
    <div
      className={styles.heroImageContainer}
      style={{ marginBottom: `${globalConfig.section_margin_bottom}px` }}
    >
      {(getDesktopUrl() || getMobileUrl()) && (
        <FyImage
          src={getDesktopUrl()}
          sources={getImgSrcSet()}
          showOverlay={displayOverlay()}
          overlayColor={getOverlayColor()}
          aspectRatio={16 / 9}
          mobileAspectRatio={9 / 16}
        />
      )}
      <div
        className={styles.overlayItems}
        style={isClient ? getOverlayPositionStyles() : {}}
      >
        {heading?.value && (
          <h1 className={`${styles.header} fontHeader`}>{heading?.value}</h1>
        )}

        {description?.value && (
          <p className={`${styles.description} ${styles.bSmall} fontBody `}>
            {description?.value}
          </p>
        )}

        {button_text?.value && (
          <FDKLink to={button_link?.value}>
            <button
              type="button"
              className={`${styles.cta_button} fontBody} ${
                invert_button_color?.value ? "btnSecondary" : "btnPrimary"
              }`}
            >
              {button_text?.value}
            </button>
          </FDKLink>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Hero Image",
  props: [
    {
      type: "text",
      id: "heading",
      default: "What your Brand Says",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "text",
      id: "description",
      default: "Add highlights of your brands",
      label: "Description",
      info: "Description text of the section",
    },
    {
      id: "overlay_option",
      type: "select",
      options: [
        {
          value: "no_overlay",
          text: "No Overlay",
        },
        {
          value: "white_overlay",
          text: "White Overlay",
        },
        {
          value: "black_overlay",
          text: "Black Overlay",
        },
      ],
      default: "no_overlay",
      label: "Overlay Option",
      info: "Use this option to add a black or white semi-transparent overlay on top of the image. This will help you to stand out your text content",
    },
    {
      type: "text",
      id: "button_text",
      default: "Shop Now",
      label: "Button Text",
    },
    {
      type: "url",
      id: "button_link",
      default: "",
      label: "Redirect Link",
    },
    {
      type: "checkbox",
      id: "invert_button_color",
      default: false,
      label: "Invert Button Color (Toggle)",
      info: "Inverted color of the primary button",
    },
    {
      id: "desktop_banner",
      type: "image_picker",
      label: "Desktop Banner",
      default: "",
      options: {
        aspect_ratio: "16:9",
        aspect_ratio_strict_check: true,
      },
    },
    {
      id: "text_placement_desktop",
      type: "select",
      options: [
        {
          value: "top_left",
          text: "Top-Left",
        },
        {
          value: "top_center",
          text: "Top-Center",
        },
        {
          value: "top_right",
          text: "Top-Right",
        },
        {
          value: "center_left",
          text: "Center-Left",
        },
        {
          value: "center_center",
          text: "Center-Center",
        },
        {
          value: "center_right",
          text: "Center-Right",
        },
        {
          value: "bottom_left",
          text: "Bottom-Left",
        },
        {
          value: "bottom_center",
          text: "Bottom-Center",
        },
        {
          value: "bottom_right",
          text: "Bottom-Right",
        },
      ],
      default: "top_left",
      label: "Text Placement (Desktop)",
    },
    {
      id: "text_alignment_desktop",
      type: "select",
      options: [
        {
          value: "left",
          text: "Left",
        },
        {
          value: "center",
          text: "Center",
        },
        {
          value: "right",
          text: "Right",
        },
      ],
      default: "left",
      label: "Text Alignment (Desktop)",
    },
    {
      id: "mobile_banner",
      type: "image_picker",
      label: "Mobile/Tablet Banner",
      default: "",
      options: {
        aspect_ratio: "9:16",
        aspect_ratio_strict_check: true,
      },
    },
    {
      id: "text_placement_mobile",
      type: "select",
      options: [
        {
          value: "top_left",
          text: "Top-Left",
        },
        {
          value: "top_center",
          text: "Top-Center",
        },
        {
          value: "top_right",
          text: "Top-Right",
        },
        {
          value: "center_left",
          text: "Center-Left",
        },
        {
          value: "center_center",
          text: "Center-Center",
        },
        {
          value: "center_right",
          text: "Center-Right",
        },
        {
          value: "bottom_left",
          text: "Bottom-Left",
        },
        {
          value: "bottom_center",
          text: "Bottom-Center",
        },
        {
          value: "bottom_right",
          text: "Bottom-Right",
        },
      ],
      default: "top_left",
      label: "Text Placement (Mobile)",
    },
    {
      id: "text_alignment_mobile",
      type: "select",
      options: [
        {
          value: "left",
          text: "Left",
        },
        {
          value: "center",
          text: "Center",
        },
        {
          value: "right",
          text: "Right",
        },
      ],
      default: "left",
      label: "Text Alignment (Mobile)",
    },
  ],
  blocks: [],
};
