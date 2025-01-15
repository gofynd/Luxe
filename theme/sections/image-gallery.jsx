import React, { useEffect, useState, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import Slider from "react-slick";
import styles from "../styles/sections/image-gallery.less";
import FyImage from "@gofynd/theme-template/components/core/fy-image/fy-image";
import "@gofynd/theme-template/components/core/fy-image/fy-image.css";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../helper/utils";
import placeholder from "../assets/images/img-placeholder-1.png";
import IntersectionObserverComponent from "../components/intersection-observer/intersection-observer";
import { useWindowWidth } from "../helper/hooks";

export function Component({ props, blocks = [], globalConfig = {}, preset }) {
  const {
    autoplay: { value: autoplay } = {},
    play_slides: { value: playSlides } = {},
    title: { value: title } = {},
    description: { value: description } = {},
    desktop_layout: { value: desktopLayout } = {},
    item_count: { value: itemCount } = {},
    mobile_layout: { value: mobileLayout } = {},
    item_count_mobile: { value: itemCountMobile } = {},
    card_radius: { value: cardRadius } = {},
  } = props;

  const galleryItems = blocks?.length ? blocks : preset?.blocks || [];
  const windowWidth = useWindowWidth();
  const [isClient, setIsClient] = useState(false);

  const isStackView = useMemo(() => {
    if (windowWidth > 768) {
      return desktopLayout === "grid";
    }
    return mobileLayout === "grid";
  }, [desktopLayout, mobileLayout, windowWidth]);

  const isHorizontalView = useMemo(() => {
    if (windowWidth > 768) {
      return desktopLayout === "horizontal";
    }
    return mobileLayout === "horizontal";
  }, [desktopLayout, mobileLayout, windowWidth]);

  const getImgSrcSet = useMemo(() => {
    if (globalConfig?.img_hd) {
      return [
        { breakpoint: { min: 1024 }, width: 900 },
        { breakpoint: { min: 768 }, width: 500 },
        { breakpoint: { min: 481 }, width: 900 },
        { breakpoint: { max: 390 }, width: 800 },
      ];
    }
    return [
      { breakpoint: { min: 1024 }, width: 450 },
      { breakpoint: { min: 768 }, width: 250 },
      { breakpoint: { min: 481 }, width: 480 },
      { breakpoint: { max: 390 }, width: 390 },
    ];
  }, [globalConfig?.img_hd]);

  useEffect(() => {
    setIsClient(isRunningOnClient());
  }, []);

  return (
    <div
      style={{
        paddingTop: "16px",
        paddingBottom: `${globalConfig?.section_margin_bottom}px`,
        "--bd-radius": `${(cardRadius || 0) / 2}%`,
      }}
    >
      <div>
        <div className={styles.titleBlock}>
          {title && <h2 className={styles.sectionHeading}>{title}</h2>}
          {description && (
            <p className={`${styles.description} b2`}>{description}</p>
          )}
        </div>
        <noscript>
          <div
            className={styles.imageGrid}
            style={{
              "--col-count": itemCount,
              "--col-count-mobile": itemCountMobile,
            }}
          >
            {galleryItems.slice(0, itemCount).map(({ props: block }, index) => (
              <div key={index}>
                <FDKLink to={block?.link?.value || ""}>
                  <FyImage
                    customClass={styles.imageGallery}
                    src={block?.image?.value || placeholder}
                    sources={getImgSrcSet}
                    isFixedAspectRatio={false}
                  />
                </FDKLink>
              </div>
            ))}
          </div>
        </noscript>
        {isClient && (
          <>
            <IntersectionObserverComponent>
              {isHorizontalView && (
                <HorizontalLayout
                  items={galleryItems}
                  globalConfig={globalConfig}
                  colCount={itemCount}
                  colCountMobile={itemCountMobile}
                  sources={getImgSrcSet}
                  autoplay={autoplay}
                  autoplaySpeed={playSlides * 1000}
                />
              )}
              {isStackView && (
                <StackLayout
                  items={galleryItems}
                  globalConfig={globalConfig}
                  colCount={itemCount}
                  colCountMobile={itemCountMobile}
                  sources={getImgSrcSet}
                />
              )}
            </IntersectionObserverComponent>
          </>
        )}
      </div>
    </div>
  );
}

const StackLayout = ({
  items,
  globalConfig,
  colCount,
  colCountMobile,
  sources,
}) => {
  const dynamicStyles = {
    "--item-count": `${colCount}`,
    "--item-count-mobile": `${colCountMobile}`,
  };

  return (
    <div className={styles.imageGrid} style={dynamicStyles}>
      {items.map(({ props: block }, index) => (
        <div key={index}>
          <FDKLink to={block?.link?.value || ""}>
            <FyImage
              customClass={styles.imageGallery}
              src={block?.image?.value || placeholder}
              sources={sources}
              globalConfig={globalConfig}
              isFixedAspectRatio={false}
            />
          </FDKLink>
        </div>
      ))}
    </div>
  );
};

const HorizontalLayout = ({
  items,
  globalConfig,
  colCount,
  colCountMobile,
  sources,
  autoplay,
  autoplaySpeed,
}) => {
  const config = useMemo(
    () => ({
      dots: items.length > colCount,
      speed: 500,
      slidesToShow: items?.length < 4 ? items.length : 4,
      slidesToScroll: items?.length < 4 ? items.length : 4,
      swipeToSlide: true,
      lazyLoad: "ondemand",
      autoplay,
      autoplaySpeed,
      cssEase: "linear",
      // arrows: getGallery.length > item_count?.value || false,
      nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
      prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
      arrows: items?.length > colCount,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            arrows: false,
            slidesToShow: items.length < 3 ? items.length : 3,
            slidesToScroll: items.length < 3 ? items.length : 3,
            swipe: true,
            swipeToSlide: false,
            touchThreshold: 80,
            draggable: false,
            touchMove: true,
          },
        },
        {
          breakpoint: 480,
          settings: {
            dots: true,
            arrows: false,
            slidesToShow: colCountMobile,
            slidesToScroll: colCountMobile,
            centerMode: false,
            centerPadding: "25px",
            swipe: true,
            swipeToSlide: false,
            touchThreshold: 80,
            draggable: false,
            touchMove: true,
          },
        },
      ],
    }),
    [colCount, colCountMobile, autoplay, autoplaySpeed]
  );

  return (
    <div
      className={`${styles.slideWrap}`}
      style={{
        "--slick-dots": `${Math.ceil(items?.length / colCount) * 22 + 10}px`,
      }}
    >
      <Slider
        {...config}
        className={`${items?.length / colCount === 0 || items?.length < colCount ? "no-nav" : ""} ${styles.customSlider}`}
      >
        {items.map(({ props: block }, index) => (
          <div key={index} className={styles.sliderView}>
            <FDKLink to={block?.link?.value || ""}>
              <FyImage
                customClass={styles.imageGallery}
                src={block?.image?.value || placeholder}
                sources={sources}
                globalConfig={globalConfig}
                isFixedAspectRatio={false}
              />
            </FDKLink>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export const settings = {
  label: "Image Gallery",
  props: [
    {
      type: "text",
      id: "title",
      default: "Customize Your Style",
      label: "Heading",
    },
    {
      type: "text",
      id: "description",
      default:
        "This flexible gallery lets you highlight key products and promotions, guiding customers to the right places.",
      label: "Description",
    },
    {
      type: "range",
      id: "card_radius",
      min: 0,
      max: 100,
      step: 1,
      unit: "%",
      label: "Card Radius",
      default: 0,
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
      info: "Items per row should be less than number of blocks to show horizontal scroll",
    },
    {
      type: "range",
      id: "item_count",
      min: 3,
      max: 10,
      step: 1,
      unit: "",
      label: "Items per row (Desktop)",
      default: 5,
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
          text: "Horizontal scroll ",
        },
      ],
      default: "grid",
      label: "Mobile Layout",
      info: "Alignment of content",
    },
    {
      type: "range",
      id: "item_count_mobile",
      min: 1,
      max: 5,
      step: 1,
      unit: "",
      label: "Items per row (Mobile)",
      default: 2,
    },
    {
      type: "checkbox",
      id: "autoplay",
      default: false,
      label: "Auto Play Slides",
    },
    {
      type: "range",
      id: "play_slides",
      min: 1,
      max: 10,
      step: 1,
      unit: "sec",
      label: "Change slides every",
      default: 3,
    },
  ],
  blocks: [
    {
      name: "Image card",
      type: "gallery",
      props: [
        {
          type: "image_picker",
          id: "image",
          label: "Image",
          default: "",
          options: {
            aspect_ratio: "1:1",
          },
        },
        {
          type: "url",
          id: "link",
          label: "Redirect",
          default: "",
          info: "Search Link Type",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
      {
        name: "Image card",
        props: {
          image: {
            type: "image_picker",
          },
          link: {
            type: "url",
          },
        },
      },
    ],
  },
};
export default Component;
