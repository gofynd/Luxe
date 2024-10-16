import React, { useState, useEffect, useRef } from "react";
// import GlideCarousel, { GlideSlide } from "some-carousel-library"; // replace with actual import
import { FDKLink } from "fdk-core/components"; // replace with actual import
import Slider from "react-slick";
import FyImage from "../components/core/fy-image/fy-image"; // replace with actual import
import styles from "../styles/trust-marker.less";
import { isRunningOnClient } from "../helper/utils";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";

export function Component({ props, globalConfig, blocks, preset }) {
  const { title, description, desktop_layout } = props;
  const [desktopLayout, setDesktopLayout] = useState(desktop_layout?.value);
  const [mobileScroll, setMobileScroll] = useState(false);
  const [desktopWidth, setDesktopWidth] = useState(false);

  const [windowWidth, setWindowWidth] = useState(
    isRunningOnClient() ? window?.innerWidth : 400
  );
  const getTrustMarker = () => {
    const marker = blocks.length === 0 ? preset.blocks : blocks;
    if (windowWidth > 480) {
      return marker.slice(0, 8);
    }
    return marker.slice(0, 12);
  };

  useEffect(() => {
    if (isRunningOnClient()) {
      const detectWidth = document
        ?.getElementsByTagName("body")?.[0]
        ?.getBoundingClientRect()?.width;
      if (
        detectWidth < 481 &&
        getTrustMarker()?.length > 2 &&
        desktop_layout?.value === "horizontal"
      ) {
        setDesktopLayout("horizontal");
      } else if (
        getTrustMarker()?.length < 6 ||
        desktop_layout?.value === "grid"
      ) {
        setDesktopLayout("grid");
      } else {
        setDesktopLayout("horizontal");
      }

      if (detectWidth < 481 && getTrustMarker()?.length > 4) {
        setMobileScroll(true);
      }
      if (detectWidth > 769) {
        setDesktopWidth(true);
      }

      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
      };

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const slickSetting = () => {
    const trustMarker = getTrustMarker();
    return {
      dots: trustMarker.length > 5,
      arrows: trustMarker.length > 5,
      focusOnSelect: true,
      infinite: trustMarker.length > 1,
      speed: 600,
      slidesToShow: trustMarker.length < 5 ? trustMarker.length : 5,
      slidesToScroll: trustMarker.length < 5 ? 1 : 5,
      autoplay: false,
      customPaging: (i) => {
        return <button>{i + 1}</button>;
      },
      appendDots: (dots) => (
        <ul>
          {/* Show maximum 8 dots */}
          {dots.slice(0, 8)}
        </ul>
      ),
      // autoplaySpeed: slide_interval?.value * 1000,
      centerMode: false,
      centerPadding: trustMarker.length === 1 ? "0" : "152px",
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
            dots: true,
            arrows: false,
            slidesToShow: trustMarker.length < 3 ? trustMarker.length : 3,
            slidesToScroll: 1,
            // centerMode: trustMarker.length !== 1,
            centerPadding: "50px",
          },
        },
      ],
    };
  };

  const dynamicStyles = {
    paddingTop: "16px",
    marginBottom: `
      ${globalConfig.section_margin_bottom}px`,
    maxWidth: "100vw",
    "--img-background-color": globalConfig?.img_container_bg,
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
        {desktopLayout === "grid" && (
          <div className="section Trust-marker">
            <div
              className={`${styles["Trust-marker-image-container"]} ${getTrustMarker()?.length < 6 && styles["stack-view"]}`}
            >
              {getTrustMarker().map((block, i) => (
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
                  <div className={styles.trust_marker_image}>
                    <FyImage
                      className={styles.trust_marker_image}
                      sources={[{ breakpoint: { min: 100 }, width: 200 }]}
                      backgroundColor={globalConfig?.img_container_bg}
                      src={
                        block?.props?.marker_logo?.value
                          ? block?.props?.marker_logo?.value
                          : require("../assets/images/placeholder1X1.png")
                      }
                    />
                  </div>
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
        )}

        {desktopLayout === "horizontal" && (
          <div
            className={styles.sliderView}
            style={{
              "--slick-dots": `${Math.ceil(getTrustMarker()?.length / 5) * 22 + 10}px`,
            }}
          >
            <Slider
              className={`${styles.testimonial__carousel}`}
              {...slickSetting()}
            >
              {getTrustMarker().map((block, i) => (
                <FDKLink
                  key={i}
                  to={block?.props?.marker_link?.value}
                  className={`${
                    mobileScroll && styles["marker-link"]
                  } animation-fade-up ${"animate"}`}
                  style={{ "--delay": `${150 * (i + 1)}ms` }}
                >
                  <div className={styles.trust_marker_image}>
                    <FyImage
                      sources={[{ breakpoint: { max: 100 }, width: 200 }]}
                      backgroundColor={globalConfig?.img_container_bg}
                      src={
                        block?.props?.marker_logo?.value
                          ? block?.props?.marker_logo?.value
                          : require("../assets/images/placeholder1X1.png")
                      }
                    />
                  </div>
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
                // </div>
                // </div>
              ))}
            </Slider>
          </div>
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
            {getTrustMarker().map((block, i) => (
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
                <div className={styles.trust_marker_image}>
                  <FyImage
                    className={styles.trust_marker_image}
                    sources={[{ breakpoint: { min: 100 }, width: 200 }]}
                    backgroundColor={globalConfig?.img_container_bg}
                    src={
                      block?.props?.marker_logo?.value
                        ? block?.props?.marker_logo?.value
                        : require("../assets/images/placeholder1X1.png")
                    }
                  />
                </div>
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
      label: "Desktop Layout",
      info: "Alignment of content",
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
            aspect_ratio_strict_check: true,
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
