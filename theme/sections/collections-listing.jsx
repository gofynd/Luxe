import React, { useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";

import Slider from "react-slick";
import styles from "../styles/sections/collections-listing.less";
import FyImage from "../components/core/fy-image/fy-image";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { isRunningOnClient, throttle } from "../helper/utils";
import { COLLECTION_ITEMS } from "../queries/collectionsQuery";
import { useGlobalStore } from "fdk-core/utils";

export function Component({ props, blocks, globalConfig, fpi }) {
  const {
    heading,
    description,
    layout_mobile,
    layout_desktop,
    button_text,
    per_row,
    img_container_bg,
    img_fill,
  } = props;
  const [windowWidth, setWindowWidth] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);

  const [collections, setCollections] = useState(
    blocks?.reduce(
      (acc, b) =>
        b?.props?.collection?.value
          ? [...acc, b?.props?.collection?.value]
          : acc,
      []
    ) || []
  );

  const isDemoBlock = () => {
    if (
      collectionsForScrollView().length > 0 ||
      collectionsForStackedView().length > 0
    ) {
      return false;
    }
    const collections =
      blocks?.reduce(
        (acc, b) =>
          b?.props?.collection?.value
            ? [...acc, b?.props?.collection?.value]
            : acc,
        []
      ) || [];
    return collections.length === 0;
  };

  useEffect(() => {
    if (customValues?.collectionData?.length > 0) {
      setCollections(customValues?.collectionData);
    }
  }, [JSON.stringify(blocks)]);

  useEffect(() => {
    const handleResize = throttle(() => {
      setWindowWidth(isRunningOnClient() ? window.innerWidth : 0);
    }, 500);

    if (isRunningOnClient()) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const getImgSrcSet = () => {
    if (globalConfig?.img_hd) {
      return [
        {
          breakpoint: { min: 1023 },
          width: 1000,
        },
        {
          breakpoint: { min: 481 },
          width: 800,
        },
        {
          breakpoint: { max: 480 },
          width: 900,
        },
      ];
    }
    return [
      {
        breakpoint: { min: 1023 },
        width: 500,
      },
      {
        breakpoint: { min: 481 },
        width: 416,
      },
      {
        breakpoint: { max: 480 },
        width: 480,
      },
    ];
  };

  const collectionsForStackedView = () => {
    let totalItems = 0;

    if (collections && collections?.length) {
      if (windowWidth <= 480) {
        totalItems = 4;
      } else if (windowWidth <= 768) {
        totalItems = 6;
      } else {
        totalItems = per_row?.value ?? 3 * 2;
      }

      return collections.slice(0, totalItems);
    }

    return [];
  };

  const getPlaceHolder = () => {
    return require("../assets/images/placeholder9x16.png");
  };
  const collectionsForScrollView = () => {
    const totalItems = 12;

    if (collections && collections?.length) {
      return collections.slice(0, totalItems);
    }

    return [];
  };

  const showStackedView = () => {
    const hasCollection = (collectionsForStackedView() || []).length > 0;
    if (
      collectionsForScrollView().length === 1 &&
      layout_desktop?.value === "grid"
    ) {
      return true;
    }
    if (windowWidth <= 768) {
      return hasCollection && layout_mobile?.value === "stacked";
    }
    return hasCollection && layout_desktop?.value === "grid";
  };

  const showScrollView = () => {
    const hasCollection = (collectionsForScrollView() || []).length > 0;
    if (windowWidth <= 768) {
      return hasCollection && layout_mobile?.value === "horizontal";
    }
    return hasCollection && layout_desktop?.value === "horizontal";
  };
  const getColumns = () => {
    const itemsPerRow = per_row?.value;
    return {
      "--grid-columns": itemsPerRow || 1,
    };
  };

  const [config, setConfig] = useState({
    dots: collectionsForScrollView().length > 1,
    speed: 500,
    slidesToShow:
      collectionsForScrollView().length < 3
        ? collectionsForScrollView().length
        : Number(per_row?.value),
    slidesToScroll:
      collectionsForScrollView().length < 3
        ? collectionsForScrollView().length
        : Number(per_row?.value),
    swipeToSlide: true,
    lazyLoad: true,
    autoplay: false,
    autoplaySpeed: 3000,
    focusOnSelect: true,
    infinite: collectionsForScrollView().length > 1,
    cssEase: "linear",
    arrows: collectionsForScrollView().length > 1,
    nextArrow: <SvgWrapper svgSrc="arrow-right" />,
    prevArrow: <SvgWrapper svgSrc="arrow-left" />,
    // adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: collectionsForScrollView()?.length !== 1,
          centerPadding: "25px",
        },
      },
    ],
  });
  const dynamicStyles = {
    paddingBottom: "16px",
    marginBottom: `
    ${globalConfig.section_margin_bottom}px`,
    "--bg-color": `${img_container_bg?.value || "#00000000"}`,
    maxWidth: "100vw",
  };

  return (
    <div style={dynamicStyles} className={styles.collections__template}>
      <div>
        <div className={styles["section-title-block"]}>
          <h2 className={`${styles["section-title"]} fontHeader`}>
            {heading?.value}
          </h2>
          <p className={`${styles["section-description"]} fontBody`}>
            {description.value}
          </p>
        </div>
        {!isLoading && showStackedView() && (
          <div className={styles["collection-grid"]} style={getColumns()}>
            {collectionsForStackedView().map((card, index) => (
              <div
                key={`COLLECTIONS${index}`}
                className={`${styles["collection-block"]} ${styles["animation-fade-up"]}animate`}
                style={{ "--delay": `${150 * (index + 1)}ms` }}
              >
                <div className={styles["card-img"]} data-cardtype="COLLECTIONS">
                  <FDKLink
                    to={card?.data?.collection?.action}
                    className={styles["button-font"]}
                  >
                    <FyImage
                      src={
                        card?.data?.collection?.banners?.portrait?.url
                          ? card?.data?.collection?.banners?.portrait?.url
                          : getPlaceHolder()
                      }
                      aspectRatio={0.8}
                      mobileAspectRatio={0.8}
                      customClass={`${styles.imageGallery} ${
                        img_fill?.value ? styles.streach : ""
                      }`}
                      className={
                        img_fill?.value
                          ? styles.streach
                          : styles["group-item-img"]
                      }
                      srcSet={getImgSrcSet()}
                      alt=""
                    />
                    <div className={styles["collection-title-block"]}>
                      <div className={styles.background}></div>
                      {card?.data?.collection?.name && (
                        <h3
                          className={styles["collection-title"]}
                          title={card?.data?.collection?.name}
                        >
                          {card?.data?.collection?.name}
                        </h3>
                      )}
                      <span
                        title={button_text?.value}
                        className={`${styles["collection-button"]}`}
                      >
                        {button_text?.value}
                      </span>
                    </div>
                  </FDKLink>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && showScrollView() && (
          <div
            className={`${styles["collection-horizontal"]} ${collectionsForScrollView().length === 1 && styles["single-card"]}`}
          >
            <div>
              <Slider {...config}>
                {collectionsForScrollView()?.map((card, index) => (
                  <div
                    key={`COLLECTIONS${index}`}
                    className={`${styles["collection-block"]} ${styles["animation-fade-up"]}animate`}
                    style={{ "--delay": `${150 * (index + 1)}ms` }}
                  >
                    <div
                      data-cardtype="COLLECTIONS"
                      className={`${styles["pos-relative"]} ${collectionsForScrollView().length < 3 && styles["single-card-view"]}`}
                    >
                      <FDKLink
                        to={convertActionToUrl(card?.data?.collection?.action)}
                        key={index}
                      >
                        <div style={{ padding: "0 10px" }}>
                          <FyImage
                            aspectRatio={0.8}
                            mobileAspectRatio={0.8}
                            customClass={`${styles.imageGallery} ${
                              img_fill?.value ? styles.streach : ""
                            }`}
                            src={
                              card?.data?.collection?.banners?.portrait?.url
                                ? card?.data?.collection?.banners?.portrait?.url
                                : getPlaceHolder()
                            }
                            sources={getImgSrcSet()}
                          />
                          <div className={styles["collection-title-block"]}>
                            <div className={styles.background}></div>
                            <h3
                              className={`${styles["collection-title"]}`}
                              title={card?.data?.collection?.name}
                            >
                              {card?.data?.collection?.name}
                            </h3>
                            <span
                              title={button_text?.value}
                              className={`${styles["collection-button"]}`}
                            >
                              {button_text?.value}
                            </span>
                          </div>
                        </div>
                      </FDKLink>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
        {!isLoading && isDemoBlock() && (
          <div className={styles.defaultGrid}>
            {[1, 2, 3].map((index) => (
              <div key={`COLLECTIONS${index}`}>
                <div className={styles["collection-block"]}>
                  <div className="card-img" data-cardtype="COLLECTIONS">
                    <FDKLink className="button-font">
                      <FyImage
                        src={getPlaceHolder()}
                        aspectRatio={0.8}
                        mobileAspectRatio={0.8}
                        customClass={`${styles.imageGallery} ${
                          img_fill?.value ? styles.streach : ""
                        }`}
                        className={`${styles["group-item-img"]} ${styles.streach}`}
                        alt=""
                        srcSet={getImgSrcSet()}
                      />
                      <div className={styles["collection-title-block"]}>
                        <div className={styles.background}></div>
                        <h3
                          className={`${styles["collection-title"]}`}
                          title={`COLLECTION ${index}`}
                        >
                          {`COLLECTION ${index}`}
                        </h3>
                        <span
                          title={button_text?.value}
                          className={`${styles["collection-button"]}`}
                        >
                          {button_text?.value}
                        </span>
                      </div>
                    </FDKLink>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const settings = {
  label: "Collections Listing",
  props: [
    {
      type: "text",
      id: "heading",
      default: "Top Collections",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "textarea",
      id: "description",
      default: "We stay on top so you can be on top",
      label: "Description",
      info: "Description text of the section",
    },
    {
      id: "layout_mobile",
      type: "select",
      options: [
        {
          value: "stacked",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal",
        },
      ],
      default: "horizontal",
      label: "Layout(Mobile)",
      info: "Alignment of content",
    },
    {
      id: "layout_desktop",
      type: "select",
      options: [
        {
          value: "grid",
          text: "Stack",
        },
        {
          value: "horizontal",
          text: "Horizontal",
        },
      ],
      default: "horizontal",
      label: "Layout(Desktop)",
      info: "Alignment of content",
    },
    {
      type: "text",
      id: "button_text",
      default: "Shop Now",
      label: "Button Text",
    },
    {
      type: "range",
      id: "per_row",
      label: "Display collections per row (desktop)",
      min: "3",
      max: "4",
      step: "1",
      info: "It'll not work for mobile layout",
      default: "3",
    },
    {
      type: "color",
      id: "img_container_bg",
      category: "Image Container",
      default: "#00000000",
      label: "Container Background Color",
      info: "This color will be used as the container background color of the Product/Collection/Category/Brand images wherever applicable",
    },
    {
      type: "checkbox",
      id: "img_fill",
      category: "Image Container",
      default: false,
      label: "Fit image to the container",
      info: "If the image aspect ratio is different from the container, the image will be clipped to fit the container. The aspect ratio of the image will be maintained",
    },
  ],
  blocks: [
    {
      type: "collection-item",
      name: "Collection Item",
      props: [
        {
          type: "collection",
          id: "collection",
          label: "Select Collection",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Collection 1",
      },
      {
        name: "Collection 2",
      },
      {
        name: "Collection 3",
      },
    ],
  },
};

Component.serverFetch = async ({ fpi, blocks }) => {
  try {
    const promisesArr = blocks.map(async (block) => {
      if (block.props?.collection?.value) {
        return fpi.executeGQL(COLLECTION_ITEMS, {
          slug: block.props.collection.value.split(" ").join("-"),
        });
      }
    });
    const responses = await Promise.all(promisesArr);
    return fpi.custom.setValue("collectionData", responses);
  } catch (err) {
    console.log(err);
  }
};
