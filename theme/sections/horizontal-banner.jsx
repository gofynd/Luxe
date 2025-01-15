import styles from "../styles/sections/horizontal-banner.less";

import React, { memo, useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";

import Slider from "react-slick";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import mobilePlaceHolder from "../assets/images/img-placeholder-1.png";
import desktopPlaceholder from "../assets/images/banner-placeholder.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import FyImage from "@gofynd/theme-template/components/core/fy-image/fy-image";
import "@gofynd/theme-template/components/core/fy-image/fy-image.css";

function getMobileImage(block) {
  return block?.mobile_image?.value || mobilePlaceHolder;
}
function getDesktopImage(block) {
  return block?.image?.value || desktopPlaceholder;
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
    {block?.redirect_link?.value?.length > 0 ? (
      <FDKLink to={block?.redirect_link?.value}>
        <FyImage
          customClass={styles.imageWrapper}
          src={getDesktopImage(block)}
          sources={getImgSrcSet(block, globalConfig)}
          defer={false}
          alt={`slide-${index}`}
          showSkeleton={true}
          isFixedAspectRatio={false}
        />
      </FDKLink>
    ) : (
      <FyImage
        customClass={styles.imageWrapper}
        src={getDesktopImage(block)}
        sources={getImgSrcSet(block, globalConfig)}
        defer={false}
        alt={`slide-${index}`}
        showSkeleton={true}
        isFixedAspectRatio={false}
      />
    )}
  </div>
));

export function Component({ props, blocks, globalConfig, preset }) {
  const [blocksData, setBlocksData] = useState([]);
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
    if (blocks?.length === 0) {
      setBlocksData(preset?.blocks);
    } else {
      setBlocksData(blocks);
    }
  }, [JSON.stringify(blocks)]);

  const { autoplay, slide_interval } = props;

  const [config, setConfig] = useState({
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: blocksData?.length > 1,
    swipeToSlide: true,
    lazyLoad: autoplay?.value ? false : "ondemand",
    autoplay: autoplay?.value,
    autoplaySpeed: slide_interval?.value || 3000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    adaptiveHeight: false,
    dots: blocksData?.length > 1,
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          arrows: false,
          pauseOnHover: false,
          swipe: blocksData?.length > 1,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          pauseOnHover: false,
          swipe: blocksData?.length > 1,
          swipeToSlide: false,
          touchThreshold: 80,
          draggable: false,
          touchMove: true,
        },
      },
    ],
  });

  useEffect(() => {
    if (autoplay?.value !== config.autoplay) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        infinite: blocksData?.length > 1,
        autoplay: autoplay?.value,
        dots: blocksData?.length > 1,
      }));
    }

    if (slide_interval?.value * 1000 !== config.autoplaySpeed) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        autoplaySpeed: slide_interval?.value * 1000,
        infinite: blocksData?.length > 1,
      }));
    }
    if (config.arrows !== blocksData?.length > 1) {
      setConfig((prevConfig) => ({
        ...prevConfig,
        infinite: blocksData?.length > 1,
        arrows: true,
        dots: blocksData?.length > 1,
      }));
    }
  }, [autoplay?.value, slide_interval?.value, blocksData]);

  return (
    <div
      className={styles.carouselImage}
      style={{
        paddingBottom: `${globalConfig?.section_margin_bottom}px`,
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

        {isClient && (
          <div
            style={{
              "--slick-dots": `${blocksData?.length * 22 + 10}px`,
            }}
          >
            <Slider
              {...config}
              initialSlide={0}
              className={blocksData?.length === 1 ? "no-nav" : ""}
            >
              {blocksData?.map((block, index) => (
                <IntersectionObserverComponent key={index}>
                  <MemoizedSlide
                    key={index}
                    block={block.props}
                    globalConfig={globalConfig}
                    index={index}
                  />
                </IntersectionObserverComponent>
              ))}
            </Slider>
          </div>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Horizontal Banner",
  blocks: [
    {
      name: "Banner card",
      type: "gallery",

      props: [
        {
          type: "image_picker",
          id: "image",
          label: "Desktop Image",
          default: "",
        },
        {
          type: "image_picker",
          id: "mobile_image",
          label: "Mobile Image",
          default: "",
        },
        {
          type: "url",
          id: "redirect_link",
          default: "",
          label: "Redirect Link",
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
      label: "Set Slide Timer",
      default: 3,
      info: "Autoplay slide duration",
    },
  ],
  preset: {
    blocks: [
      {
        name: "Banner card",
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
export default Component;
