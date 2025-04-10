import React, { useState, useEffect, useCallback } from "react";
import FyImage from "fdk-react-templates/components/core/fy-image/fy-image";
import "fdk-react-templates/components/core/fy-image/fy-image.css";
import { getDirectionAdaptiveValue, isRunningOnClient } from "../helper/utils";
import styles from "../styles/sections/hero-image.less";
import placeholderDesktop from "../assets/images/placeholder/hero-image-desktop.png";
import placeholderMobile from "../assets/images/placeholder/hero-image-mobile.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import Hotspot from "../components/hotspot/product-hotspot";
import { FDKLink } from "fdk-core/components";
import { DIRECTION_ADAPTIVE_CSS_PROPERTIES } from "../helper/constant";

export function Component({ props, globalConfig, blocks }) {
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
  const [isMobile, setIsMobile] = useState(false);
  const [interval, setInterval] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);

  useEffect(() => {
    if (isRunningOnClient()) {
      setIsClient(true);
      const localDetectMobileWidth = () =>
        document?.getElementsByTagName("body")?.[0]?.getBoundingClientRect()
          ?.width <= 768;

      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
      };
      setIsMobile(localDetectMobileWidth());

      window?.addEventListener("resize", handleResize);

      return () => {
        window?.removeEventListener("resize", handleResize);
      };
    }
    if (blocks?.length) {
      setInterval(blocks?.length);
    }
  }, []);

  useEffect(() => {
    const updateTooltipDimensions = () => {
      const tooltip = document.querySelector(
        `.${styles["application-banner-container"]} .${styles["tooltip-visible"]}`
      );
      if (tooltip) {
        const newHeight = tooltip.clientHeight - 20;
        const newWidth = tooltip.clientWidth;
        if (newHeight !== tooltipHeight) {
          setTooltipHeight(newHeight);
        }
        if (newWidth !== tooltipWidth) {
          setTooltipWidth(newWidth);
        }
      }
    };

    updateTooltipDimensions();
  }, [tooltipHeight, tooltipWidth]);

  const getMobileUrl = () => mobile_banner?.value || placeholderMobile;
  const getDesktopUrl = () => desktop_banner?.value || placeholderDesktop;

  const getImgSrcSet = useCallback(() => {
    if (globalConfig?.img_hd?.value) {
      return [
        { breakpoint: { min: 1400 }, width: 2500 },
        { breakpoint: { min: 1023 }, width: 2200 },
        {
          breakpoint: { max: 480 },
          width: 900,
          url: getMobileUrl(),
        },
      ];
    }
    return [
      { breakpoint: { min: 1400 }, width: 1500 },
      { breakpoint: { min: 1023 }, width: 1024 },
      {
        breakpoint: { max: 480 },
        width: 500,
        url: getMobileUrl(),
      },
    ];
  }, [globalConfig]);

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
        positions[`--content-alignment-${view}`] = getDirectionAdaptiveValue(
          DIRECTION_ADAPTIVE_CSS_PROPERTIES.TEXT_ALIGNMENT,
          contentAlignment
        );
      }

      switch (overlayPosition) {
        case "top_start":
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

        case "top_end":
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

        case "center_start":
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

        case "center_end":
          positions[`--top-position-${view}`] = "50%";
          positions[`--transform-${view}`] = "translateY(-50%)";
          positions[`--right-position-${view}`] =
            view === "mobile"
              ? HORIZONTAL_SPACING_TABLET
              : HORIZONTAL_SPACING_DESKTOP;

          break;

        case "bottom_start":
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

        case "bottom_end":
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

  const dynamicBoxStyle = useCallback(
    (block) => {
      return {
        "--x_position": `${block?.props?.x_position?.value || 0}%`,
        "--y_position": `${block?.props?.y_position?.value || 0}%`,
        "--box_width": `${block?.props?.box_width?.value || 0}%`,
        "--box_height": `${block?.props?.box_height?.value || 0}%`,
        "--tooltip-height": `${tooltipHeight}px`,
        "--tooltip-width": `${tooltipWidth}px`,
        "--x_offset": `-${block.props?.x_position?.value || 0}%`,
        "--y_offset": `-${block.props?.y_position?.value || 0}%`,
      };
    },
    [tooltipHeight, tooltipWidth]
  );

  const displayOverlay = () =>
    !!(overlay_option?.value && overlay_option?.value !== "no_overlay");

  const getOverlayColor = () =>
    overlay_option?.value === "black_overlay" ? "#000000" : "#ffffff";

  const getHotspots = () => {
    return {
      desktop: blocks?.filter((block) => block?.type === "hotspot_desktop"),
      mobile: blocks?.filter((block) => block?.type === "hotspot_mobile"),
    };
  };

  return (
    <div
      className={styles.heroImageContainer}
      style={{
        paddingBottom: `${globalConfig?.section_margin_bottom + 16}px`,
      }}
    >
      {/* To Do: fix intersection observer flicker issue */}
      {/* <IntersectionObserverComponent> */}
      {(getDesktopUrl() || getMobileUrl()) && (
        <FyImage
          src={getDesktopUrl()}
          sources={getImgSrcSet()}
          showOverlay={displayOverlay()}
          overlayColor={getOverlayColor()}
          defer={false}
          isFixedAspectRatio={false}
        />
      )}
      <div className={styles.overlayItems} style={getOverlayPositionStyles()}>
        {heading?.value && (
          <h1 className={`${styles.header} fontHeader`}>{heading?.value}</h1>
        )}

        {description?.value && (
          <p className={`${styles.description} b2 fontBody `}>
            {description?.value}
          </p>
        )}

        {button_text?.value && (
          <FDKLink to={button_link?.value}>
            <button
              type="button"
              className={`${styles.cta_button} fontBody} ${invert_button_color?.value ? "btnSecondary" : "btnPrimary"
                }`}
              disabled={!(button_link?.value?.length > 1)}
            >
              {button_text?.value}
            </button>
          </FDKLink>
        )}
      </div>
      {!isMobile &&
        getHotspots()?.desktop?.map((hotspot, index) => {
          return hotspot?.props?.pointer_type?.value !== "box" ? (
            <Hotspot
              className={styles["hotspot--desktop"]}
              key={index}
              hotspot={hotspot}
              product={{
                hotspot_description: hotspot?.props?.hotspot_header?.value,
                media: [
                  { type: "image", url: hotspot?.props?.hotspot_image?.value },
                ],
                name: hotspot?.props?.hotspot_description?.value,
              }}
              hotspot_link_text={hotspot?.props?.hotspot_link_text?.value}
              redirect_link={hotspot?.props?.redirect_link?.value}
            />
          ) : (
            <FDKLink to={hotspot?.props?.redirect_link?.value}>
              <div
                className={`
                      ${styles["box-wrapper"]}
                      ${hotspot?.props?.edit_visible?.value ? `${styles["box-wrapper-visible"]}` : ""}
                    `}
                style={dynamicBoxStyle(hotspot)}
              ></div>
            </FDKLink>
          );
        })}
      {isMobile &&
        getHotspots()?.mobile?.map((hotspot, index) => {
          return hotspot?.props?.pointer_type?.value !== "box" ? (
            <Hotspot
              className={styles["hotspot--mobile"]}
              key={index}
              hotspot={hotspot}
              product={{
                hotspot_description: hotspot?.props?.hotspot_header?.value,
                media: [
                  { type: "image", url: hotspot?.props?.hotspot_image?.value },
                ],
                name: hotspot?.props?.hotspot_description?.value,
              }}
              hotspot_link_text={hotspot?.props?.hotspot_link_text?.value}
              redirect_link={hotspot?.props?.redirect_link?.value}
            />
          ) : (
            <FDKLink to={hotspot?.props?.redirect_link?.value}>
              <div
                className={`
                      ${styles["box-wrapper"]}
                      ${hotspot?.props?.edit_visible?.value ? `${styles["box-wrapper-visible"]}` : ""}
                    `}
                style={dynamicBoxStyle(hotspot)}
              ></div>
            </FDKLink>
          );
        })}
    </div>
  );
}

export const settings = {
  label: "t:resource.sections.hero_image.hero_image",
  props: [
    {
      type: "text",
      id: "heading",
      default: "Welcome to Your New Store",
      label: "t:resource.common.heading",
      info: "t:resource.common.section_heading_text",
    },
    {
      type: "text",
      id: "description",
      default:
        "Begin your journey by adding unique images and banners. This is your chance to create a captivating first impression. Customize it to reflect your brand's personality and style!",
      label: "t:resource.common.description",
      info: "t:resource.common.section_description_text",
    },
    {
      id: "overlay_option",
      type: "select",
      options: [
        {
          value: "no_overlay",
          text: "t:resource.sections.hero_image.no_overlay",
        },
        {
          value: "white_overlay",
          text: "t:resource.sections.hero_image.white_overlay",
        },
        {
          value: "black_overlay",
          text: "t:resource.sections.hero_image.black_overlay",
        },
      ],
      default: "no_overlay",
      label: "t:resource.sections.hero_image.overlay_option",
      info: "t:resource.sections.hero_image.image_overlay_opacity",
    },
    {
      type: "text",
      id: "button_text",
      default: "Shop Now",
      label: "t:resource.common.button_text",
    },
    {
      type: "url",
      id: "button_link",
      default: "",
      label: "t:resource.common.redirect_link",
    },
    {
      type: "checkbox",
      id: "invert_button_color",
      default: false,
      label: "t:resource.sections.hero_image.invert_button_color",
      info: "t:resource.sections.hero_image.primary_button_inverted_color",
    },
    {
      id: "desktop_banner",
      type: "image_picker",
      label: "t:resource.sections.hero_image.desktop_banner",
      default: "",
      options: {
        aspect_ratio: "16:9",
      },
    },
    {
      id: "text_placement_desktop",
      type: "select",
      options: [
        {
          value: "top_start",
          text: "t:resource.sections.hero_image.top_start",
        },
        {
          value: "top_center",
          text: "t:resource.sections.hero_image.top_center",
        },
        {
          value: "top_end",
          text: "t:resource.sections.hero_image.top_end",
        },
        {
          value: "center_start",
          text: "t:resource.sections.hero_image.center_start",
        },
        {
          value: "center_center",
          text: "t:resource.sections.hero_image.center_center",
        },
        {
          value: "center_end",
          text: "t:resource.sections.hero_image.center_end",
        },
        {
          value: "bottom_start",
          text: "t:resource.sections.hero_image.bottom_start",
        },
        {
          value: "bottom_center",
          text: "t:resource.sections.hero_image.bottom_center",
        },
        {
          value: "bottom_end",
          text: "t:resource.sections.hero_image.bottom_end",
        },
      ],
      default: "center_start",
      label: "t:resource.sections.hero_image.text_placement_desktop",
    },
    {
      id: "text_alignment_desktop",
      type: "select",
      options: [
        {
          value: "left",
          text: "t:resource.common.start",
        },
        {
          value: "center",
          text: "t:resource.common.center",
        },
        {
          value: "right",
          text: "t:resource.common.end",
        },
      ],
      default: "left",
      label: "t:resource.common.text_alignment_desktop",
    },
    {
      id: "mobile_banner",
      type: "image_picker",
      label: "t:resource.sections.hero_image.mobile_tablet_banner",
      default: "",
      options: {
        aspect_ratio: "9:16",
      },
    },
    {
      id: "text_placement_mobile",
      type: "select",
      options: [
        {
          value: "top_start",
          text: "t:resource.sections.hero_image.top_start",
        },
        {
          value: "top_center",
          text: "t:resource.sections.hero_image.top_center",
        },
        {
          value: "top_end",
          text: "t:resource.sections.hero_image.top_end",
        },
        {
          value: "center_start",
          text: "t:resource.sections.hero_image.center_start",
        },
        {
          value: "center_center",
          text: "t:resource.sections.hero_image.center_center",
        },
        {
          value: "center_end",
          text: "t:resource.sections.hero_image.center_end",
        },
        {
          value: "bottom_start",
          text: "t:resource.sections.hero_image.bottom_start",
        },
        {
          value: "bottom_center",
          text: "t:resource.sections.hero_image.bottom_center",
        },
        {
          value: "bottom_end",
          text: "t:resource.sections.hero_image.bottom_end",
        },
      ],
      default: "top_start",
      label: "t:resource.sections.hero_image.text_placement_mobile",
    },
    {
      id: "text_alignment_mobile",
      type: "select",
      options: [
        {
          value: "left",
          text: "t:resource.common.start",
        },
        {
          value: "center",
          text: "t:resource.common.center",
        },
        {
          value: "right",
          text: "t:resource.common.end",
        },
      ],
      default: "left",
      label: "t:resource.common.text_alignment_mobile",
    },
  ],
  blocks: [
    {
      type: "hotspot_desktop",
      name: "t:resource.common.hotspot_desktop",
      props: [
        {
          type: "select",
          id: "pointer_type",
          label: "t:resource.common.pointer_type",
          options: [
            {
              value: "box",
              text: "t:resource.common.box",
            },
            {
              value: "pointer",
              text: "t:resource.common.pointer",
            },
          ],
          default: "box",
        },

        {
          type: "checkbox",
          id: "edit_visible",
          default: true,
          label: "t:resource.common.show_clickable_area",
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.horizontal_position",
          default: 50,
        },
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.vertical_position",
          default: 50,
        },
        {
          type: "range",
          id: "box_width",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.width",
          default: 15,
        },
        {
          type: "range",
          id: "box_height",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.height",
          default: 15,
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "t:resource.common.hotspot_hover_image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "t:resource.common.header",
          placeholder: "t:resource.common.header",
          value: "",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "t:resource.common.description",
          placeholder: "t:resource.common.description",
          value: "",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "t:resource.common.hover_link_text",
          placeholder: "t:resource.common.link_text",
          value: "",
        },
        {
          type: "url",
          id: "redirect_link",
          label: "t:resource.common.redirect_link",
        },
      ],
    },
    {
      type: "hotspot_mobile",
      name: "t:resource.common.hotspot_mobile",
      props: [
        {
          type: "select",
          id: "pointer_type",
          label: "t:resource.common.pointer_type",
          options: [
            {
              value: "box",
              text: "t:resource.common.box",
            },
            {
              value: "pointer",
              text: "t:resource.common.pointer",
            },
          ],
          default: "box",
        },
        {
          type: "checkbox",
          id: "edit_visible",
          default: true,
          label: "t:resource.common.show_clickable_area",
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.horizontal_position",
          default: 50,
        },
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.vertical_position",
          default: 50,
        },
        {
          type: "range",
          id: "box_width",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.width",
          default: 15,
        },
        {
          type: "range",
          id: "box_height",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "t:resource.common.height",
          default: 15,
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "t:resource.common.hotspot_hover_image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "t:resource.common.header",
          placeholder: "t:resource.common.header",
          value: "",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "t:resource.common.description",
          placeholder: "t:resource.common.description",
          value: "",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "t:resource.common.hover_link_text",
          placeholder: "t:resource.common.link_text",
          value: "",
        },
        {
          type: "url",
          id: "redirect_link",
          label: "t:resource.common.redirect_link",
        },
      ],
    },
  ],
};
export default Component;
