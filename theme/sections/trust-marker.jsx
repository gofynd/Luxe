import React, { useState, useEffect } from "react";
// import GlideCarousel, { GlideSlide } from "some-carousel-library"; // replace with actual import
import { FDKLink } from "fdk-core/components"; // replace with actual import
import Slider from "react-slick";
import FyImage from "../components/core/fy-image/fy-image"; // replace with actual import
import styles from "../styles/trust-marker.less";
import { isRunningOnClient } from "../helper/utils";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";

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
        (detectWidth <= 769 && detectWidth > 481) ||
        getTrustMarker()?.length < 5
      ) {
        setDesktopLayout("grid");
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
      dots: true,
      arrows: false,
      focusOnSelect: true,
      infinite: trustMarker.length > 1, // Only infinite if more than one testimonial
      speed: 600,
      slidesToShow: trustMarker.length === 1 ? 1 : 5, // Show only one slide if there's only one testimonial
      slidesToScroll: trustMarker.length === 1 ? 1 : 5, // Scroll one slide if there's only one testimonial
      autoplay: false,
      // autoplaySpeed: slide_interval?.value * 1000,
      centerMode: false,
      centerPadding: trustMarker.length === 1 ? "0" : "152px",
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
            dots: false,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: trustMarker.length !== 1,
            centerPadding: "50px",
          },
        },
        {
          breakpoint: 320,
          settings: {
            dots: false,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: trustMarker.length !== 1,
            centerPadding: "23px",
          },
        },
      ],
    };
  };

  const dynamicStyles = {
    paddingBottom: "16px",
    marginBottom: `
      ${globalConfig.section_margin_bottom}px`,
    maxWidth: "100vw",
  };

  return (
    <div style={dynamicStyles} className={styles.trustMarker}>
      <IntersectionObserverComponent>
        <div className={styles["Trust-marker-heading"]}>
          <h2 className={`${styles["section-title"]} fontHeader`}>
            {title?.value}
          </h2>
          <div className={`${styles["section-description"]} bSmall fontBody`}>
            {description?.value}
          </div>
        </div>

        {desktopLayout === "grid" && (
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
                  link={block?.props?.marker_link?.value}
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
                      sources={[{ breakpoint: { min: 100 }, width: 100 }]}
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
        )}

        {desktopLayout === "horizontal" && (
          <div className={styles.sliderView}>
            <Slider
              className={styles.testimonial__carousel}
              {...slickSetting()}
            >
              {getTrustMarker().map((block, i) => (
                <FDKLink
                  key={i}
                  link={block?.props?.marker_link?.value}
                  className={`${
                    mobileScroll && styles["marker-link"]
                  } animation-fade-up ${"animate"}`}
                  style={{ "--delay": `${150 * (i + 1)}ms` }}
                >
                  <div className={styles.trust_marker_image}>
                    <FyImage
                      sources={[{ breakpoint: { max: 100 }, width: 100 }]}
                      src={
                        block?.props?.marker_logo?.value
                          ? block?.props?.marker_logo?.value.replace
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
          default: "Don`t love it? Don`t worry.Return delivery is free.",
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
            value: "Don't love it? Don't worry.Return delivery is free.",
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
            value: "Don't love it? Don't worry.Return delivery is free.",
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
            value: "Don't love it? Don't worry.Return delivery is free.",
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
            value: "Don't love it? Don't worry.Return delivery is free.",
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
            value: "Don't love it? Don't worry.Return delivery is free.",
          },
        },
      },
    ],
  },
};
