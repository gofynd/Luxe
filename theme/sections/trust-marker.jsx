import React, { useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import Slider from "react-slick";
import styles from "../styles/trust-marker.less";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import FyImage from "@gofynd/theme-template/components/core/fy-image/fy-image";
import "@gofynd/theme-template/components/core/fy-image/fy-image.css";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { useWindowWidth } from "../helper/hooks";
import { isRunningOnClient } from "../helper/utils";

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
      ${globalConfig?.section_margin_bottom}px`,
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
            colCount={perRowDesktop?.value}
            colCountMobile={perRowMobile?.value}
          />
        )}
        {isHorizontalView && (
          <HorizontalLayout
            trustMarker={getTrustMarker}
            globalConfig={globalConfig}
            colCount={perRowDesktop?.value}
            colCountMobile={perRowMobile?.value}
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
                className={`${
                  styles["marker-link"]
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
            className={`${
              styles["marker-link"]
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
      infinite: trustMarker?.length > 1,
      speed: 600,
      slidesToShow:
        trustMarker?.length < colCount ? trustMarker?.length : colCount,
      slidesToScroll: trustMarker?.length < colCount ? 1 : colCount,
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
            dots: trustMarker?.length > colCountMobile,
            arrows: false,
            slidesToShow:
              trustMarker?.length < colCountMobile
                ? trustMarker?.length
                : Number(colCountMobile),
            slidesToScroll:
              trustMarker?.length < colCountMobile ? 1 : Number(colCountMobile),
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
        className={`${styles.testimonial__carousel} ${
          trustMarker?.length - 1 >= columnValue ? "" : "no-nav"
        }`}
        {...slickSetting}
      >
        {trustMarker?.map((block, i) => (
          <FDKLink
            key={i}
            to={block?.props?.marker_link?.value}
            className={`${
              styles["marker-link"]
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
  label: "Trust Marker",
  props: [
    {
      type: "text",
      id: "title",
      default: "Title ",
      label: "Heading",
    },
    {
      type: "text",
      id: "description",
      default: "Add description",
      label: "Description",
    },
    {
      type: "color",
      id: "card_background",
      label: "Card Background Color",
      info: "This color will be used as card background",
      default: "",
    },
    {
      id: "desktop_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal scroll",
        },
      ],
      default: "horizontal",
      label: "Desktop/Tablet Layout",
      info: "Alignment of content",
    },
    {
      type: "range",
      id: "per_row_desktop",
      label: "Display column per row (desktop/Tablet)",
      min: "3",
      max: "10",
      step: "1",
      info: "It'll not work for mobile layout",
      default: "5",
    },
    {
      id: "mobile_layout",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal scroll",
        },
      ],
      default: "horizontal",
      label: "Mobile Layout",
      info: "Alignment of content",
    },
    {
      type: "range",
      id: "per_row_mobile",
      label: "Display column per row (Mobile)",
      min: "1",
      max: "5",
      step: "1",
      info: "It'll not work for desktop layout",
      default: "2",
    },
  ],
  blocks: [
    {
      type: "trustmarker",
      name: "Trust Marker",
      props: [
        {
          type: "image_picker",
          id: "marker_logo",
          default: "",
          label: "Icon",
          options: {
            aspect_ratio: "1:1",
          },
        },
        {
          type: "text",
          id: "marker_heading",
          default: "Free Delivery",
          label: "Heading",
        },
        {
          type: "text",
          id: "marker_description",
          default: "Don`t love it? Don`t worry. Return delivery is free.",
          label: "Description",
        },
        {
          type: "url",
          id: "marker_link",
          default: "",
          label: "Redirect link",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Trust Marker",
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
        name: "Trust Marker",
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
        name: "Trust Marker",
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
        name: "Trust Marker",
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
        name: "Trust Marker",
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
