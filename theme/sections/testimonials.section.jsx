import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import FyImage from "../components/core/fy-image/fy-image";
import styles from "../styles/sections/testimonials.less";
import { isRunningOnClient } from "../helper/utils";

export function Component({ props, globalConfig, blocks, preset }) {
  const { title, autoplay, slide_interval, testimonials } = props;

  const [windowWidth, setWindowWidth] = useState(
    isRunningOnClient() ? window?.innerWidth : 400
  );
  const [blocksData, setBlocksData] = useState([]);
  useEffect(() => {
    if (blocks.length === 0) {
      setBlocksData(preset?.blocks);
    } else {
      setBlocksData(blocks);
    }
  }, [JSON.stringify(blocks)]);

  useEffect(() => {
    if (isRunningOnClient()) {
      const handleResize = () => {
        setWindowWidth(window?.innerWidth);
      };

      window?.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  const getTestimonials = () => {
    const testimonial =
      blocksData.length !== 0 &&
      blocksData.filter(
        (block) =>
          block.props.author_image ||
          block.props.author_testimonial ||
          block.props.author_name ||
          block.props.author_description
      );
    if (blocksData.length !== 0) {
      if (windowWidth > 480) {
        return testimonial.slice(0, 8);
      }
      return testimonial.slice(0, 12);
    }
  };

  const slickSetting = () => {
    const testimonialsList = getTestimonials();
    return {
      dots: true,
      arrows: false,
      focusOnSelect: true,
      infinite: testimonialsList.length > 1, // Only infinite if more than one testimonial
      speed: 600,
      slidesToShow: testimonialsList.length === 1 ? 1 : 2, // Show only one slide if there's only one testimonial
      slidesToScroll: testimonialsList.length === 1 ? 1 : 2, // Scroll one slide if there's only one testimonial
      autoplay: autoplay?.value,
      autoplaySpeed: Number(slide_interval?.value) * 1000,
      centerMode: testimonialsList.length !== 2,
      centerPadding: testimonialsList.length === 1 ? "0" : "152px",
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
            centerMode: testimonialsList.length !== 1,
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
            centerMode: testimonialsList.length !== 1,
            centerPadding: "23px",
          },
        },
      ],
    };
  };

  const dynamicStyles = {
    padding: "16px 0",
    "margin-bottom": `${globalConfig.section_margin_bottom}px`,
    "--p-right-tablet": `${testimonials?.length < 3 ? "24px" : ""}`,
    "--p-right-mob": `${testimonials?.length < 2 ? "16px" : ""}`,
  };

  return (
    <div className={styles.testimonial} style={dynamicStyles}>
      <h2 className={`${styles.testimonial__title} fontHeader`}>
        {title?.value}
      </h2>

      <noscript>
        <div style={{ display: "flex" }}>
          {blocks.map((block, index) => (
            <div key={index} style={{ padding: "0 12px" }}>
              <div
                className={`${styles.testimonial__block} animation-fade-up animate`}
              >
                {block.props?.author_image?.value && (
                  <FyImage
                    customClass={styles.testimonial__block__image}
                    src={block?.props?.author_image?.value}
                    aspectRatio={1 / 1}
                    mobileAspectRatio={1 / 1}
                    sources={[
                      { breakpoint: { min: 1024 }, width: 350 },
                      { breakpoint: { min: 768 }, width: 350 },
                      { breakpoint: { min: 481 }, width: 350 },
                      { breakpoint: { max: 390 }, width: 350 },
                    ]}
                  />
                )}
                <div
                  className={`${styles.testimonial__block__info} ${
                    block.props?.author_image?.value
                      ? styles.testimonial__block__info__has__image
                      : ""
                  }`}
                >
                  <div
                    className={`${styles.testimonial__block__info__text} fontBody`}
                    title={block.props?.author_testimonial?.value}
                  >
                    {`"${block.props?.author_testimonial?.value || ""}"`}
                  </div>
                  <div className={styles.testimonial__block__info__author}>
                    <h5
                      className={`${styles.testimonial__block__info__author__name} fontBody `}
                      title={block.props?.author_name?.value}
                    >
                      {block.props?.author_name?.value || ""}
                    </h5>
                    <div
                      className={`${styles.testimonial__block__info__author__description} ${styles.captionNormal}`}
                      title={block.props?.author_description?.value}
                    >
                      {block.props?.author_description?.value || ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </noscript>

      <div className={styles.sliderWrap}>
        {getTestimonials()?.length > 0 && (
          <Slider
            className={`${styles.testimonial__carousel}`}
            {...slickSetting()}
          >
            {getTestimonials().map((block, index) => (
              <div key={index}>
                <div
                  className={`${styles.testimonial__block} animation-fade-up animate`}
                  style={{
                    "--delay":
                      getTestimonials().length - 1 === index
                        ? "150ms"
                        : `${150 * (index + 2)}ms`,
                  }}
                >
                  {block.props?.author_image?.value && (
                    <FyImage
                      customClass={styles.testimonial__block__image}
                      src={block?.props?.author_image?.value}
                      aspectRatio={1 / 1}
                      mobileAspectRatio={1 / 1}
                      sources={[
                        { breakpoint: { min: 1024 }, width: 350 },
                        { breakpoint: { min: 768 }, width: 350 },
                        { breakpoint: { min: 481 }, width: 350 },
                        { breakpoint: { max: 390 }, width: 350 },
                      ]}
                    />
                  )}
                  <div
                    className={`${styles.testimonial__block__info} ${
                      block.props?.author_image?.value
                        ? styles.testimonial__block__info__has__image
                        : ""
                    }`}
                  >
                    <div
                      className={`${styles.testimonial__block__info__text} fontBody`}
                      title={block.props?.author_testimonial?.value}
                    >
                      {`"${block.props?.author_testimonial?.value || ""}"`}
                    </div>
                    <div className={styles.testimonial__block__info__author}>
                      <h5
                        className={`${styles.testimonial__block__info__author__name} fontBody `}
                        title={block.props?.author_name?.value}
                      >
                        {block.props?.author_name?.value || ""}
                      </h5>
                      <div
                        className={`${styles.testimonial__block__info__author__description} ${styles.captionNormal}`}
                        title={block.props?.author_description?.value}
                      >
                        {block.props?.author_description?.value || ""}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Testimonial",
  name: "testimonials",
  props: [
    {
      type: "text",
      id: "title",
      default: "What People Are Saying About Us ",
      label: "Heading",
    },
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "AutoPlay Slides",
    },
    {
      type: "range",
      id: "slide_interval",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "Change slides every",
      default: 2,
    },
  ],
  blocks: [
    {
      type: "testimonial",
      name: "Testimonial",
      props: [
        {
          type: "image_picker",
          id: "author_image",
          default: "",
          label: "Image",
          options: {
            aspect_ratio: "1:1",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "textarea",
          id: "author_testimonial",
          label: "Testimonial",
          default:
            "Add customer reviews and testimonials to showcase your store's happy customers.",
          info: "Text for testimonial",
          placeholder: "Text",
        },
        {
          type: "text",
          id: "author_name",
          default: "Author Name",
          label: "Author Name",
        },
        {
          type: "text",
          id: "author_description",
          default: "Author Description",
          label: "Author Description",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Testimonial",
        props: {
          author_image: {
            type: "image_picker",
            value: "",
          },
          author_testimonial: {
            type: "textarea",
            value:
              "Add customer reviews and testimonials to showcase your store's happy customers.",
          },
          author_name: {
            type: "text",
            value: "Author Description",
          },
          author_description: {
            type: "text",
            value: "Author Description",
          },
        },
      },
      {
        name: "Testimonial",
        props: {
          author_image: {
            type: "image_picker",
            value: "",
          },
          author_testimonial: {
            type: "textarea",
            value:
              "Add customer reviews and testimonials to showcase your store's happy customers.",
          },
          author_name: {
            type: "text",
            value: "Author Description",
          },
          author_description: {
            type: "text",
            value: "Author Description",
          },
        },
      },
    ],
  },
};
