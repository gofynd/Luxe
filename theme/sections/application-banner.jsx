import React, { useEffect, useState, useCallback } from "react";
import FyImage from "fdk-react-templates/components/core/fy-image/fy-image";
import "fdk-react-templates/components/core/fy-image/fy-image.css";
import placeholderDesktop from "../assets/images/placeholder/application-banner-desktop.png";
import placeholderMobile from "../assets/images/placeholder/application-banner-mobile.png";
import { FDKLink } from "fdk-core/components";
import styles from "../styles/sections/application-banner.less";
import { isRunningOnClient } from "../helper/utils";
import Hotspot from "../components/hotspot/product-hotspot";

export function Component({ props, blocks, globalConfig }) {
  const [isMobile, setIsMobile] = useState(false);
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
  }, [tooltipHeight, tooltipWidth]);

  const dynamicBoxStyle = useCallback(
    (block) => {
      return {
        "--x_position": `${block.props?.x_position?.value || 0}%`,
        "--y_position": `${block.props?.y_position?.value || 0}%`,
        "--box_width": `${block.props?.box_width?.value || 0}%`,
        "--box_height": `${block.props?.box_height?.value || 0}%`,
        "--tooltip-height": `${tooltipHeight}px`,
        "--tooltip-width": `${tooltipWidth}px`,
        "--x_offset": `-${block.props?.x_position?.value || 0}%`,
        "--y_offset": `-${block.props?.y_position?.value || 0}%`,
      };
    },
    [tooltipHeight, tooltipWidth]
  );

  const getMobileImage = () => image_mobile?.value || placeholderMobile;

  const getDesktopImage = () => image_desktop?.value || placeholderDesktop;

  const getImgSrcSet = useCallback(() => {
    if (globalConfig?.img_hd?.value) {
      return [
        { breakpoint: { min: 1400 }, width: 2500 },
        { breakpoint: { min: 1023 }, width: 2200 },
        { breakpoint: { min: 800 }, width: 1500 },
        { breakpoint: { min: 768 }, width: 1500 },
        {
          breakpoint: { max: 480 },
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
        breakpoint: { max: 480 },
        width: 450,
        url: getMobileImage(),
      },
    ];
  }, [globalConfig]);

  const getHotspots = () => {
    return {
      desktop: blocks?.filter((block) => block?.type === "hotspot_desktop"),
      mobile: blocks?.filter((block) => block?.type === "hotspot_mobile"),
    };
  };

  const dynamicStyles = {
    paddingBottom: `${globalConfig?.section_margin_bottom + 16}px`,
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
            isFixedAspectRatio={false}
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
          isFixedAspectRatio={false}
        />
      )}

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
  label: "t:resource.sections.application_banner.application_banner",
  props: [
    {
      type: "image_picker",
      id: "image_desktop",
      label: "t:resource.common.desktop_image",
      default: "",
      options: {
        aspect_ratio: "19:6",
      },
    },
    {
      type: "image_picker",
      id: "image_mobile",
      label: "t:resource.common.mobile_image",
      default: "",
      options: {
        aspect_ratio: "4:5",
      },
    },
    {
      type: "url",
      id: "banner_link",
      default: "",
      label: "t:resource.common.redirect_link",
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
          info: "t:resource.sections.application_banner.box_pointer_only",
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
          info: "t:resource.sections.application_banner.box_pointer_only",
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "t:resource.common.hotspot_hover_image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "t:resource.common.header",
          placeholder: "t:resource.common.header",
          value: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "t:resource.common.description",
          default: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "t:resource.common.hover_link_text",
          placeholder: "t:resource.common.link_text",
          value: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
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
          info: "t:resource.sections.application_banner.box_pointer_only",
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
          info: "t:resource.sections.application_banner.box_pointer_only",
        },
        {
          type: "image_picker",
          id: "hotspot_image",
          label: "t:resource.common.hotspot_hover_image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "text",
          id: "hotspot_header",
          label: "t:resource.common.header",
          placeholder: "t:resource.common.header",
          value: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "textarea",
          id: "hotspot_description",
          label: "t:resource.common.description",
          default: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
        },
        {
          type: "text",
          id: "hotspot_link_text",
          label: "t:resource.common.hover_link_text",
          placeholder: "t:resource.common.link_text",
          value: "",
          info: "t:resource.sections.application_banner.circular_pointer_only",
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
