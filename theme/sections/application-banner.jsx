import React, { useEffect, useState, useCallback } from "react";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { FDKLink } from "fdk-core/components";
import styles from "../styles/sections/application-banner.less";
import { isRunningOnClient } from "../helper/utils";

export function Component({ props, blocks, globalConfig }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showTooltip, setShowTooltip] = useState({});
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [tooltipWidth, setTooltipWidth] = useState(0);
  const [interval, setInterval] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);

  const { image_desktop, image_mobile, banner_link } = props;

  useEffect(() => {
    if (isRunningOnClient()) {
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

  const getMobileImage = () =>
    image_mobile?.value !== ""
      ? image_mobile?.value
      : require("../assets/images/img-placeholder-1.png");

  const getDesktopImage = () =>
    image_desktop?.value !== ""
      ? image_desktop?.value
      : require("../assets/images/banner-placeholder.png");

  const getImgSrcSet = useCallback(() => {
    if (globalConfig?.img_hd?.value) {
      return [
        { breakpoint: { min: 1400 }, width: 2500 },
        { breakpoint: { min: 1023 }, width: 2200 },
        { breakpoint: { min: 800 }, width: 1500 },
        { breakpoint: { min: 768 }, width: 1500 },
        {
          breakpoint: { max: 767 },
          width: 900,
          url: getMobileImage(),
        },
      ];
    }
    return [
      { breakpoint: { min: 1400 }, width: 1500 },
      { breakpoint: { min: 1023 }, width: 1200 },
      { breakpoint: { min: 800 }, width: 850 },
      { breakpoint: { min: 768 }, width: 780 },
      {
        breakpoint: { max: 767 },
        width: 450,
        url: getMobileImage(),
      },
    ];
  }, [globalConfig]);

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

  const dynamicStyles = {
    paddingBottom: `${globalConfig.section_margin_bottom}px`,
  };

  return (
    <div
      className={styles["application-banner-container"]}
      style={dynamicStyles}
    >
      {banner_link?.value?.length > 0 ? (
        <FDKLink to={banner_link?.value}>
          <FyImage
            customClass={`${styles.imageWrapper}`}
            src={getDesktopImage()}
            aspectRatio={19 / 6}
            mobileAspectRatio={4 / 5}
            sources={getImgSrcSet()}
            placeholder=""
            isLazyLoaded={false}
            onLoad={() => setImgLoaded(true)}
            defer={false}
          />
        </FDKLink>
      ) : (
        <FyImage
          customClass={`${styles.imageWrapper}`}
          src={getDesktopImage()}
          aspectRatio={19 / 6}
          mobileAspectRatio={4 / 5}
          sources={getImgSrcSet()}
          placeholder=""
          isLazyLoaded={false}
          onLoad={() => setImgLoaded(true)}
          defer={false}
        />
      )}

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
                        {block.props?.hotspot_link_text?.value?.length > 0 && (
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
    </div>
  );
}

export const settings = {
  label: "Application Banner",
  props: [
    {
      type: "image_picker",
      id: "image_desktop",
      label: "Desktop Image",
      default: "",
      options: {
        aspect_ratio: "19:6",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "image_picker",
      id: "image_mobile",
      label: "mobile Image",
      default: "",
      options: {
        aspect_ratio: "4:5",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "url",
      id: "banner_link",
      default: "",
      label: "Redirect Link",
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
