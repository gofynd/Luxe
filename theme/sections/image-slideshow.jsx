import React, { memo, useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";

import Slider from "react-slick";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import styles from "../styles/sections/image-slideshow.less";
import placeHolder3X4 from "../assets/images/placeholder3x4.png";
import placeHolder16X5 from "../assets/images/placeholder16x5.png";

function getMobileImage(block) {
  return block?.mobile_image?.value || placeHolder3X4;
}
function getDesktopImage(block) {
  return block?.image?.value || placeHolder16X5;
}

function getImgSrcSet(block, globalConfig) {
  if (globalConfig?.img_hd) {
    return [
      {
        breakpoint: { min: 1400 },
        width: 2300,
      },
      {
        breakpoint: { min: 1023 },
        width: 2200,
      },
      {
        breakpoint: { min: 800 },
        width: 1500,
      },
      {
        breakpoint: { min: 769 },
        width: 1500,
      },
      {
        breakpoint: { max: 500 },
        width: 800,
        url: getMobileImage(block),
      },
    ];
  }
  return [
    {
      breakpoint: { min: 1400 },
      width: 1300,
    },
    {
      breakpoint: { min: 1023 },
      width: 800,
    },
    {
      breakpoint: { min: 800 },
      width: 600,
    },
    {
      breakpoint: { min: 769 },
      width: 500,
    },
    {
      breakpoint: { max: 500 },
      width: 500,
      url: getMobileImage(block),
    },
  ];
}

const MemoizedSlide = memo(({ block, globalConfig, index }) => (
  <div>
    <FDKLink to={block?.redirect_link?.value}>
      <FyImage
        customClass={styles.imageWrapper}
        src={getDesktopImage(block)}
        aspectRatio={16 / 5}
        mobileAspectRatio={3 / 4}
        sources={getImgSrcSet(block, globalConfig)}
        defer={false}
        alt={`slide-${index}`}
        showSkeleton={true}
      />
    </FDKLink>
  </div>
));

export function Component({ props, blocks, globalConfig, preset }) {
  const [blocksData, setBlocksData] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (blocks.length === 0) {
      setBlocksData(preset?.blocks);
    } else {
      setBlocksData(blocks);
    }
  }, [JSON.stringify(blocks)]);

  const { autoplay, slide_interval } = props;

  const [config, setConfig] = useState({
    dots: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    lazyLoad: "ondemand",
    autoplay: autoplay?.value,
    autoplaySpeed: slide_interval?.value,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    nextArrow: <SvgWrapper svgSrc="arrow-right" />,
    prevArrow: <SvgWrapper svgSrc="arrow-left" />,
  });

  useEffect(() => {
    if (autoplay?.value !== config.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplay: autoplay?.value,
      }));
    }

    if (slide_interval?.value * 1000 !== config.autoplaySpeed) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplaySpeed: slide_interval?.value * 1000,
      }));
    }
  }, [autoplay?.value, slide_interval?.value]);

  return (
    <div
      className={styles.carouselImage}
      style={{
        marginBottom: `${globalConfig.section_margin_bottom + 16}px`,
        maxWidth: "100vw",
      }}
    >
      <div>
        <noscript>
          <FyImage
            customClass={styles.imageWrapper}
            src={getDesktopImage(blocks?.[0]?.props)}
            aspectRatio={16 / 5}
            mobileAspectRatio={3 / 4}
            sources={getImgSrcSet(blocks?.[0]?.props)}
          />
        </noscript>

        <div>
          {isClient && (
            <Slider {...config} initialSlide={0}>
              {blocksData?.map((block, index) => (
                <MemoizedSlide
                  key={index}
                  block={block.props}
                  globalConfig={globalConfig}
                  index={index}
                />
              ))}
              {/* {blocksData?.map(({ props: block }, index) => (
                <div key={index}>
                  <FDKLink to={block?.redirect_link?.value} key={index}>
                    {getDesktopImage(block).length > 0 && (
                      <FyImage
                        customClass={styles.imageWrapper}
                        src={getDesktopImage(block)}
                        aspectRatio={16 / 5}
                        mobileAspectRatio={3 / 4}
                        sources={getImgSrcSet(block)}
                        showSkeleton={true}
                        defer={false}
                      />
                    )}
                  </FDKLink>
                </div>
              ))} */}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
}

export const settings = {
  label: "Image Slideshow",
  blocks: [
    {
      name: "Image card",
      type: "gallery",

      props: [
        {
          type: "image_picker",
          id: "image",
          label: "Desktop Image",
          default: "",
          options: {
            aspect_ratio: "16:5",
            aspect_ratio_strict_check: true,
          },
        },

        {
          type: "image_picker",
          id: "mobile_image",
          label: "Mobile Image",
          default: "",
          options: {
            aspect_ratio: "3:4",
            aspect_ratio_strict_check: true,
          },
        },
        {
          type: "url",
          id: "redirect_link",
          label: "Slide Link",
        },
      ],
    },
  ],
  props: [
    {
      type: "checkbox",
      id: "autoplay",
      default: true,
      label: "Auto Play Slides",
      info: "Check to autoplay slides",
    },
    {
      type: "range",
      id: "slide_interval",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "Change slides every",
      default: 3,
      info: "Autoplay slide duration",
    },
  ],
  preset: {
    blocks: [
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
            value: "",
          },
          mobile_image: {
            type: "image_picker",
            value: "",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
            value: "",
          },
          mobile_image: {
            type: "image_picker",
            value: "",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
            value: "",
          },
          mobile_image: {
            type: "image_picker",
            value: "",
          },
        },
      },
    ],
  },
};
