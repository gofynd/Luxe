import React, { useMemo } from "react";
import Slider from "react-slick";
import styles from "../styles/trust-marker.less";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import FyImage from "fdk-react-templates/components/core/fy-image/fy-image";
import "fdk-react-templates/components/core/fy-image/fy-image.css";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { useWindowWidth } from "../helper/hooks";
import { isRunningOnClient } from "../helper/utils";
import { FDKLink } from "fdk-core/components";

export function Component({ props, globalConfig, blocks, preset }) {
  const {
    title,
    description,
    desktop_layout: desktopLayout,
    mobile_layout: mobileLayout,
    per_row_desktop: perRowDesktop,
    per_row_mobile: perRowMobile,
    card_background,
  } = props;

  const windowWidth = useWindowWidth();

  const getTrustMarker = useMemo(
    () => (blocks.length === 0 ? preset?.blocks || [] : blocks),
    [blocks, preset]
  );

  const isStackView = useMemo(() => {
    if (!isRunningOnClient()) {
      return false;
    }
    if (windowWidth > 480) {
      return desktopLayout?.value === "grid";
    }
    return mobileLayout?.value === "grid";
  }, [desktopLayout, mobileLayout, windowWidth]);

  const isHorizontalView = useMemo(() => {
    if (!isRunningOnClient()) {
      return false;
    }
    if (windowWidth > 480) {
      return desktopLayout?.value === "horizontal";
    }
    return mobileLayout?.value === "horizontal";
  }, [desktopLayout, mobileLayout, windowWidth]);

  const dynamicStyles = {
    paddingTop: "16px",
    paddingBottom: `
      ${globalConfig?.section_margin_bottom + 16}px`,
    maxWidth: "100vw",
    "--img-background-color": card_background?.value
      ? card_background?.value
      : globalConfig?.img_container_bg,
  };

  return (
    <div style={dynamicStyles} className={styles.trustMarker}>
      <div className={styles["Trust-marker-heading"]}>
        {title?.value && (
          <h2 className={`${styles["section-title"]} fontHeader`}>
            {title?.value}
          </h2>
        )}
        {description?.value && (
          <div className={`${styles["section-description"]} bSmall fontBody`}>
            {description?.value}
          </div>
        )}
      </div>
      <IntersectionObserverComponent>
        {isStackView && (
          <StackLayout
            trustMarker={getTrustMarker}
            globalConfig={globalConfig}
            colCount={Number(perRowDesktop?.value)}
            colCountMobile={Number(perRowMobile?.value)}
          />
        )}
        {isHorizontalView && (
          <HorizontalLayout
            trustMarker={getTrustMarker}
            globalConfig={globalConfig}
            colCount={Number(perRowDesktop?.value)}
            colCountMobile={Number(perRowMobile?.value)}
            windowWidth={windowWidth}
          />
        )}
      </IntersectionObserverComponent>
      <noscript>
        <div className="section Trust-marker">
          <div
            className={styles["Trust-marker-image-container"]}
          // style={{
          //   gridTemplateColumns:
          //     getTrustMarker().length < 5 &&
          //     desktopWidth &&
          //     `repeat(${getTrustMarker().length}, 1fr)`,
          // }}
          >
            {getTrustMarker.map((block, i) => (
              <FDKLink
                key={i}
                to={block?.props?.marker_link?.value}
                className={`${styles["marker-link"]
                  } animation-fade-up ${"animate"}`}
                style={{
                  "--delay": `${150 * (i + 1)}ms `,
                }}
              >
                {block?.props?.marker_logo?.value && (
                  <div className={styles.trust_marker_image}>
                    <FyImage
                      className={styles.trust_marker_image}
                      sources={[{ width: 200 }]}
                      backgroundColor={globalConfig?.img_container_bg}
                      src={block?.props?.marker_logo?.value}
                      isFixedAspectRatio={false}
                    />
                  </div>
                )}
                <div className={styles["trust-marker-data"]}>
                  <span
                    className={`${styles["marker-heading"]} captionSemiBold fontHeader`}
                  >
                    {block?.props?.marker_heading?.value}
                  </span>
                  <span
                    className={`${styles["marker-description"]} bSmall  font-body`}
                  >
                    {block?.props?.marker_description?.value}
                  </span>
                </div>
              </FDKLink>
            ))}
          </div>
        </div>
      </noscript>
    </div>
  );
}

const StackLayout = ({
  trustMarker,
  globalConfig,
  colCount,
  colCountMobile,
}) => {
  const dynamicStyles = {
    "--item-count": `${colCount}`,
    "--item-count-mobile": `${colCountMobile}`,
  };
  return (
    <div className="section Trust-marker" style={dynamicStyles}>
      <div
        className={`${styles["Trust-marker-image-container"]} ${trustMarker?.length < 6 && styles["stack-view"]}`}
      >
        {trustMarker.map((block, i) => (
          <FDKLink
            key={i}
            to={block?.props?.marker_link?.value}
            className={`${styles["marker-link"]
              } animation-fade-up ${"animate"}`}
            style={{
              "--delay": `${150 * (i + 1)}ms `,
            }}
          >
            {block?.props?.marker_logo?.value && (
              <div className={styles.trust_marker_image}>
                <FyImage
                  className={styles.trust_marker_image}
                  sources={[{ breakpoint: { min: 100 }, width: 200 }]}
                  backgroundColor={globalConfig?.img_container_bg}
                  src={block?.props?.marker_logo?.value}
                  isFixedAspectRatio={false}
                />
              </div>
            )}
            <div className={styles["trust-marker-data"]}>
              <span
                className={`${styles["marker-heading"]} captionSemiBold fontHeader`}
              >
                {block?.props?.marker_heading?.value}
              </span>
              <span
                className={`${styles["marker-description"]} bSmall  fontBody`}
              >
                {block?.props?.marker_description?.value}
              </span>
            </div>
          </FDKLink>
        ))}
      </div>
    </div>
  );
};

const HorizontalLayout = ({
  trustMarker,
  globalConfig,
  colCount,
  colCountMobile,
  windowWidth,
}) => {
  const slickSetting = useMemo(() => {
    return {
      dots: trustMarker?.length > colCount,
      arrows: trustMarker?.length > colCount,
      focusOnSelect: true,
      infinite: trustMarker?.length > colCount,
      speed: 600,
      slidesToShow: Number(colCount),
      slidesToScroll: Number(colCount),
      autoplay: false,
      // autoplaySpeed: slide_interval?.value * 1000,
      centerMode: false,
      centerPadding: trustMarker?.length === 1 ? "0" : "152px",
      nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
      prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
      responsive: [
        {
          breakpoint: 1440,
          settings: {
            centerPadding: "75px",
          },
        },
        {
          breakpoint: 1023,
          settings: {
            arrows: false,
            centerPadding: "50px",
          },
        },
        {
          breakpoint: 768,
          settings: {
            arrows: false,
            centerPadding: "64px",
          },
        },
        {
          breakpoint: 480,
          settings: {
            dots: trustMarker?.length > Number(colCountMobile),
            arrows: false,
            infinite: trustMarker?.length > Number(colCountMobile),
            slidesToShow: Number(colCountMobile),
            slidesToScroll: Number(colCountMobile),
            // centerMode: trustMarker.length !== 1,
            centerPadding: "50px",
          },
        },
      ],
    };
  }, [trustMarker, colCount, colCountMobile]);

  const columnValue = windowWidth > 500 ? colCount : colCountMobile;

  return (
    <div
      className={styles.sliderView}
      style={{
        "--slick-dots": `${Math.ceil(trustMarker?.length / 5) * 22 + 10}px`,
      }}
    >
      <Slider
        className={`${trustMarker?.length - 1 >= columnValue ? "" : "no-nav"}`}
        {...slickSetting}
      >
        {trustMarker?.map((block, i) => (
          <FDKLink
            key={i}
            to={block?.props?.marker_link?.value}
            className={`${styles["marker-link"]
              } animation-fade-up ${"animate"}`}
            style={{ "--delay": `${150 * (i + 1)}ms` }}
          >
            {block?.props?.marker_logo?.value && (
              <div className={styles.trust_marker_image}>
                <FyImage
                  sources={[{ breakpoint: { max: 100 }, width: 200 }]}
                  backgroundColor={globalConfig?.img_container_bg}
                  src={block?.props?.marker_logo?.value}
                  isFixedAspectRatio={false}
                />
              </div>
            )}
            <div className={styles["trust-marker-data"]}>
              <span
                className={`${styles["marker-heading"]} captionSemiBold fontHeader`}
              >
                {block?.props?.marker_heading?.value}
              </span>
              <span
                className={`${styles["marker-description"]} bSmall fontBody`}
              >
                {block?.props?.marker_description?.value}
              </span>
            </div>
          </FDKLink>
        ))}
      </Slider>
    </div>
  );
};

export const settings = {
  label: "t:resource.sections.trust_marker.trust_marker",
  props: [
    {
      type: "text",
      id: "title",
      default: "Title ",
      label: "t:resource.common.heading",
    },
    {
      type: "text",
      id: "description",
      default: "Add description",
      label: "t:resource.common.description",
    },
    {
      type: "color",
      id: "card_background",
      label: "t:resource.sections.trust_marker.card_background_color",
      info: "t:resource.sections.trust_marker.card_background_color_info",
      default: "",
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
      label: "t:resource.sections.trust_marker.desktop_tablet_layout",
      info: "t:resource.common.alignment_of_content",
    },
    {
      type: "range",
      id: "per_row_desktop",
      label: "t:resource.sections.trust_marker.columns_per_row_desktop_tablet",
      min: "3",
      max: "10",
      step: "1",
      info: "t:resource.common.not_applicable_for_mobile",
      default: "5",
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
      default: "horizontal",
      label: "t:resource.common.mobile_layout",
      info: "t:resource.common.alignment_of_content",
    },
    {
      type: "range",
      id: "per_row_mobile",
      label: "t:resource.sections.trust_marker.columns_per_row_mobile",
      min: "1",
      max: "5",
      step: "1",
      info: "t:resource.sections.trust_marker.not_applicable_desktop",
      default: "2",
    },
  ],
  blocks: [
    {
      type: "trustmarker",
      name: "t:resource.sections.trust_marker.trust_marker",
      props: [
        {
          type: "image_picker",
          id: "marker_logo",
          default: "",
          label: "t:resource.common.icon",
          options: {
            aspect_ratio: "1:1",
          },
        },
        {
          type: "text",
          id: "marker_heading",
          default: "Free Delivery",
          label: "t:resource.common.heading",
        },
        {
          type: "text",
          id: "marker_description",
          default: "Don`t love it? Don`t worry. Return delivery is free.",
          label: "t:resource.common.description",
        },
        {
          type: "url",
          id: "marker_link",
          default: "",
          label: "t:resource.common.redirect_link",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "t:resource.sections.trust_marker.trust_marker",
        props: {
          marker_heading: {
            type: "text",
            value: "Free Delivery",
          },
          marker_description: {
            type: "textarea",
            value: "Don't love it? Don't worry. Return delivery is free.",
          },
        },
      },
      {
        name: "t:resource.sections.trust_marker.trust_marker",
        props: {
          marker_heading: {
            type: "text",
            value: "Satisfied or Refunded",
          },
          marker_description: {
            type: "textarea",
            default: "Don’t love it? Don’t worry. Return delivery is free.",
          },
        },
      },
      {
        name: "t:resource.sections.trust_marker.trust_marker",
        props: {
          marker_heading: {
            type: "text",
            value: "Top-notch Support",
          },
          marker_description: {
            type: "textarea",
            value: "Don't love it? Don't worry. Return delivery is free.",
          },
        },
      },
      {
        name: "t:resource.sections.trust_marker.trust_marker",
        props: {
          marker_heading: {
            type: "text",
            value: "Secure Payments",
          },
          marker_description: {
            type: "textarea",
            value: "Don't love it? Don't worry. Return delivery is free.",
          },
        },
      },
      {
        name: "t:resource.sections.trust_marker.trust_marker",
        props: {
          marker_heading: {
            type: "text",
            value: "5.0 star rating",
          },
          marker_description: {
            type: "textarea",
            value: "Don't love it? Don't worry. Return delivery is free.",
          },
        },
      },
    ],
  },
};
export default Component;
