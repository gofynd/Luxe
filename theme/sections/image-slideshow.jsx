import React, { memo, useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import FyImage from "fdk-react-templates/components/core/fy-image/fy-image";
import "fdk-react-templates/components/core/fy-image/fy-image.css";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import styles from "../styles/sections/image-slideshow.less";
import placeholderDesktop from "../assets/images/placeholder/image-slideshow-desktop.png";
import placeholderMobile from "../assets/images/placeholder/image-slideshow-mobile.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import { FDKLink } from "fdk-core/components";

function getMobileImage(block) {
  return block?.mobile_image?.value || placeholderMobile;
}
function getDesktopImage(block) {
  return block?.image?.value || placeholderDesktop;
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
          aspectRatio={16 / 5}
          mobileAspectRatio={3 / 4}
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
        aspectRatio={16 / 5}
        mobileAspectRatio={3 / 4}
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
    if (blocks.length === 0) {
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
    infinite: blocksData.length > 1,
    swipeToSlide: true,
    lazyLoad: autoplay?.value ? false : "ondemand",
    autoplay: autoplay?.value,
    autoplaySpeed: slide_interval?.value || 3000,
    pauseOnHover: true,
    cssEase: "linear",
    arrows: false,
    dots: blocksData.length > 1,
    nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
    prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          arrows: false,
          pauseOnHover: false,
          swipe: blocksData.length > 1,
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

  // useEffect(() => {
  //   console.log(sliderRef.current?.querySelector(".slick-dots"), "slicdots");
  // }, [blocksData, isClient, sliderRef]);

  return (
    <div
      className={styles.carouselImage}
      style={{
        paddingBottom: `${globalConfig?.section_margin_bottom + 16}px`,
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
            isFixedAspectRatio={false}
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
          </div>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "t:resource.sections.image_slideshow.image_slideshow",
  blocks: [
    {
      name: "t:resource.common.image_card",
      type: "gallery",

      props: [
        {
          type: "image_picker",
          id: "image",
          label: "t:resource.common.desktop_image",
          default: "",
          options: {
            aspect_ratio: "16:5",
          },
        },

        {
          type: "image_picker",
          id: "mobile_image",
          label: "t:resource.common.mobile_image",
          default: "",
          options: {
            aspect_ratio: "3:4",
          },
        },
        {
          type: "url",
          id: "redirect_link",
          label: "t:resource.sections.image_slideshow.slide_link",
        },
      ],
    },
  ],
  props: [
    {
      type: "checkbox",
      id: "autoplay",
      default: true,
      label: "t:resource.common.auto_play_slides",
      info: "t:resource.sections.image_slideshow.check_to_autoplay_slides",
    },
    {
      type: "range",
      id: "slide_interval",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "t:resource.common.change_slides_every",
      default: 3,
      info: "t:resource.sections.image_slideshow.autoplay_slide_duration",
    },
  ],
  preset: {
    blocks: [
      {
        name: "t:resource.common.image_card",
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
        name: "t:resource.common.image_card",
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
        name: "t:resource.common.image_card",
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
