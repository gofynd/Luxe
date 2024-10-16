import React, { useState, useEffect, useRef, useCallback } from "react";
import { FDKLink } from "fdk-core/components";
import FyImage from "../components/core/fy-image/fy-image";
import { isRunningOnClient } from "../helper/utils";
import styles from "../styles/sections/hero-image.less";
import desktopPlaceholder from "../assets/images/hero-desktop-placeholder.png";
import mobilePlaceholder from "../assets/images/hero-mobile-placeholder.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";

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
  const [showTooltip, setShowTooltip] = useState({});
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [interval, setInterval] = useState([]);
  const [isClient, setIsClient] = useState(false);

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
        window.removeEventListener("resize", handleResize);
      };
    }
    if (blocks?.length) {
      setInterval(blocks?.length);
    }
  }, []);
  const getMobileUrl = () => {
    return mobile_banner?.value !== ""
      ? mobile_banner?.value
      : mobilePlaceholder;
  };
  const getDesktopUrl = () => {
    return desktop_banner?.value !== ""
      ? desktop_banner?.value
      : desktopPlaceholder;
  };

  const getImgSrcSet = useCallback(() => {
    if (globalConfig?.img_hd?.value) {
      return [
        { breakpoint: { min: 1400 }, width: 2500 },
        { breakpoint: { min: 1023 }, width: 2200 },
        {
          breakpoint: { max: 780 },
          width: 900,
          url: getMobileUrl(),
        },
      ];
    }
    return [
      { breakpoint: { min: 1400 }, width: 1500 },
      { breakpoint: { min: 1023 }, width: 1200 },
      {
        breakpoint: { max: 780 },
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
  }, [showTooltip, tooltipHeight, tooltipWidth]);

  const dynamicBoxStyle = useCallback(
    (block) => {
      return {
        "--x_position": `${block.props?.x_position?.value || 0}%`,
        "--y_position": `${block.props?.y_position?.value || 0}%`,
        "--box_width": `${block.props?.box_width?.value || 0}%`,
        "--box_height": `${block.props?.box_height?.value || 0}%`,
        "--tooltip-height": `${tooltipHeight}px`,
        "--tooltip-width": `${tooltipWidth}px`,
        "--x_offset": `-${block.props?.y_position?.value || 0}%`,
        "--y_offset": `-${block.props?.x_position?.value || 0}%`,
      };
    },
    [tooltipHeight, tooltipWidth]
  );

  const mouseOverTooltip = (param, index) => {
    if (!isMobile) {
      clearTimeout(interval[index]);
      if (!param) {
        interval[index] = setTimeout(() => {
          setShowTooltip((prev) => ({ ...prev, [index]: param }));
        }, 200);
      } else {
        setShowTooltip((prev) => ({ ...prev, [index]: param }));
      }
    }
  };

  const clickHotspotMobile = (event, param, index) => {
    event.stopPropagation();
    setShowTooltip((prevIndexes) => {
      const newIndexes = {};
      // Close all tooltips
      Object.keys(prevIndexes).forEach((key) => {
        newIndexes[key] = false;
      });
      // Toggle the clicked tooltip
      newIndexes[index] = !prevIndexes[index];
      return newIndexes;
    });
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
      <IntersectionObserverComponent>
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
        <div className={styles.overlayItems} style={getOverlayPositionStyles()}>
          {heading?.value && (
            <h1 className={`${styles.header} fontHeader`}>{heading?.value}</h1>
          )}

          {description?.value && (
            <p className={`${styles.description} ${styles.bSmall} fontBody `}>
              {description?.value}
            </p>
          )}

          {button_text?.value && button_link?.value?.length > 1 && (
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
        {blocks &&
          blocks.map((block, index) => {
            if (
              (block.type === "hotspot_desktop" && !isMobile) ||
              (block.type === "hotspot_mobile" && isMobile)
            ) {
              return (
                <div
                  key={index}
                  className={
                    isMobile
                      ? styles["mobile-hotspot"]
                      : styles["desktop-hotspot"]
                  }
                >
                  <div className={styles["link-container"]}>
                    {!isMobile && (
                      <FDKLink to={block.props?.redirect_link?.value}>
                        <div
                          onMouseOver={() => mouseOverTooltip(true, index)}
                          onMouseOut={() => mouseOverTooltip(false, index)}
                          onFocus={() => mouseOverTooltip(true, index)}
                          onBlur={() => mouseOverTooltip(false, index)}
                          className={`
                      ${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper"] : styles["pointer-wrapper"]}
                      ${block.props?.edit_visible?.value ? `${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper-visible"] : styles["pointer-wrapper-visible"]}` : ""}
                    `}
                          style={dynamicBoxStyle(block)}
                        ></div>
                      </FDKLink>
                    )}
                    {isMobile &&
                    block.props?.redirect_link?.value &&
                    block?.props?.pointer_type?.value === "box" ? (
                      <FDKLink to={block.props?.redirect_link?.value}>
                        <div
                          onClick={(e) => clickHotspotMobile(e, true, index)}
                          className={`
                      ${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper"] : styles["pointer-wrapper"]}
                      ${block.props?.edit_visible?.value ? `${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper-visible"] : styles["pointer-wrapper-visible"]}` : ""}
                    `}
                          style={dynamicBoxStyle(block)}
                        />
                      </FDKLink>
                    ) : (
                      isMobile && (
                        <div
                          onClick={(e) => clickHotspotMobile(e, true, index)}
                          className={`
                      ${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper"] : styles["pointer-wrapper"]}
                      ${block.props?.edit_visible?.value ? `${block?.props?.pointer_type?.value === "box" ? styles["box-wrapper-visible"] : styles["pointer-wrapper-visible"]}` : ""}
                    `}
                          style={dynamicBoxStyle(block)}
                        />
                      )
                    )}

                    <div
                      id="tooltip"
                      className={`
                    ${styles.tooltip}
                    ${showTooltip[index] && block?.props?.pointer_type?.value === "pointer" ? styles["tooltip-visible"] : styles["tooltip-hidden"]}
                  `}
                      style={dynamicBoxStyle(block)}
                      onMouseOver={() => mouseOverTooltip(true, index)}
                      onMouseOut={() => mouseOverTooltip(false, index)}
                      onFocus={() => mouseOverTooltip(true, index)}
                      onBlur={() => mouseOverTooltip(false, index)}
                      onClick={() => {
                        if (isMobile) {
                          window.location.replace(
                            block.props?.redirect_link?.value
                          );
                        }
                      }}
                    >
                      {isMobile && (
                        <div
                          onClick={(e) => clickHotspotMobile(e, false, index)}
                          className={styles["close-div"]}
                        >
                          <SvgWrapper
                            svgSrc="close"
                            className={styles["close-icon"]}
                          />
                        </div>
                      )}
                      {block.props?.hotspot_image?.value && (
                        <FyImage
                          customClass={styles["image-wrapper"]}
                          src={block.props?.hotspot_image?.value}
                          sources={[{ breakpoint: { min: 300 }, width: 380 }]}
                        />
                      )}
                      {(block?.props?.hotspot_header.value ||
                        block?.props?.hotspot_description.value) && (
                        <div className={styles["text-wrapper"]}>
                          {block?.props?.hotspot_header?.value?.length > 0 && (
                            <div
                              className={`${styles["tooltip-header"]} fontHeader`}
                              title={block?.props?.hotspot_header.value}
                            >
                              {block?.props?.hotspot_header?.value}
                            </div>
                          )}
                          <div
                            className={`${styles["tooltip-description"]} fontBody`}
                            title={block?.props?.hotspot_description.value}
                          >
                            {block?.props?.hotspot_description?.value}
                          </div>
                          {block.props?.hotspot_link_text?.value?.length >
                            0 && (
                            <div className={styles["tooltip-link"]}>
                              <FDKLink
                                className={`${styles["tooltip-action"]} fontBody`}
                                to={block.props?.redirect_link?.value}
                              >
                                {block.props?.hotspot_link_text?.value}
                              </FDKLink>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Return null if condition is not met
              return null;
            }
          })}
      </IntersectionObserverComponent>
      <noscript>
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
      </noscript>
    </div>
  );
}

export const settings = {
  label: "Hero Image",
  props: [
    {
      type: "text",
      id: "heading",
      default: "Welcome to Your New Store",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "text",
      id: "description",
      default:
        "Begin your journey by adding unique images and banners. This is your chance to create a captivating first impression. Customize it to reflect your brand's personality and style!",
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
  blocks: [
    {
      type: "hotspot_desktop",
      name: "Hotspot Desktop",
      props: [
        {
          type: "select",
          id: "pointer_type",
          label: "Pointer Type",
          options: [
            {
              value: "box",
              text: "Box",
            },
            {
              value: "pointer",
              text: "Pointer",
            },
          ],
          default: "box",
        },

        {
          type: "checkbox",
          id: "edit_visible",
          default: true,
          label: "Show Clickable Area",
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Vertical Position",
          default: 50,
        },
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Horizontal Position",
          default: 50,
        },
        {
          type: "range",
          id: "box_width",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Width",
          default: 15,
        },
        {
          type: "range",
          id: "box_height",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Height",
          default: 15,
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "Hotspot Hover Image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "Header",
          placeholder: "Header",
          value: "",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "Description",
          placeholder: "Description",
          value: "",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "Hover Link Text",
          placeholder: "Link text",
          value: "",
        },
        {
          type: "url",
          id: "redirect_link",
          label: "Redirect Link",
        },
      ],
    },
    {
      type: "hotspot_mobile",
      name: "Hotspot Mobile",
      props: [
        {
          type: "select",
          id: "pointer_type",
          label: "Pointer Type",
          options: [
            {
              value: "box",
              text: "Box",
            },
            {
              value: "pointer",
              text: "Pointer",
            },
          ],
          default: "box",
        },
        {
          type: "checkbox",
          id: "edit_visible",
          default: true,
          label: "Show Clickable Area",
        },
        {
          type: "range",
          id: "x_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Vertical Position",
          default: 50,
        },
        {
          type: "range",
          id: "y_position",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Horizontal Position",
          default: 50,
        },
        {
          type: "range",
          id: "box_width",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Width",
          default: 15,
        },
        {
          type: "range",
          id: "box_height",
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
          label: "Height",
          default: 15,
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "Hotspot Hover Image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "Header",
          placeholder: "Header",
          value: "",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "Description",
          placeholder: "Description",
          value: "",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "Hover Link Text",
          placeholder: "Link text",
          value: "",
        },
        {
          type: "url",
          id: "redirect_link",
          label: "Redirect Link",
        },
      ],
    },
  ],
};
