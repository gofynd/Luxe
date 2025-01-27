import React, { useState, useMemo, useEffect, useRef } from "react";
import Slider from "react-slick";
import { FDKLink } from "fdk-core/components";
import { useGlobalStore, useFPI } from "fdk-core/utils";
import {
  useAccounts,
  useViewport,
  useWishlist,
  useThemeFeature,
} from "../helper/hooks";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { FEATURED_COLLECTION } from "../queries/collectionsQuery";
import styles from "../styles/sections/multi-collection-product-list.less";
import ProductCard from "@gofynd/theme-template/components/product-card/product-card";
import "@gofynd/theme-template/components/product-card/product-card.css";
import FyImage from "@gofynd/theme-template/components/core/fy-image/fy-image";
import "@gofynd/theme-template/components/core/fy-image/fy-image.css";
import Modal from "@gofynd/theme-template/components/core/modal/modal";
import "@gofynd/theme-template/components/core/modal/modal.css";
import AddToCart from "@gofynd/theme-template/page-layouts/plp/Components/add-to-cart/add-to-cart";
import "@gofynd/theme-template/page-layouts/plp/Components/add-to-cart/add-to-cart.css";
import SizeGuide from "@gofynd/theme-template/page-layouts/plp/Components/size-guide/size-guide";
import "@gofynd/theme-template/page-layouts/plp/Components/size-guide/size-guide.css";
import { isRunningOnClient } from "../helper/utils";
import useAddToCartModal from "../page-layouts/plp/useAddToCartModal";

export function Component({ props = {}, blocks = [], globalConfig = {} }) {
  const fpi = useFPI();
  const { isInternational } = useThemeFeature({ fpi });
  const {
    heading,
    position,
    viewAll,
    per_row,
    show_wishlist_icon,
    show_add_to_cart,
  } = props;
  const showAddToCart =
    !isInternational && show_add_to_cart?.value && !globalConfig?.disable_cart;
  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE) ?? {};
  const [activeLink, setActiveLink] = useState(0);
  const [activeCollectionItems, setActiveCollectionItems] = useState([]);
  const { isLoggedIn, openLogin } = useAccounts({ fpi });
  const { toggleWishlist, followedIdList } = useWishlist({ fpi });
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const listingPrice =
    CONFIGURATION?.app_features?.common?.listing_price?.value || "range";
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);
  const isTablet = useViewport(0, 768);

  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const pageConfig =
    mode?.page?.find((f) => f.page === "product-listing")?.settings?.props ||
    {};

  const addToCartModalProps = useAddToCartModal({ fpi, pageConfig });

  const {
    handleAddToCart,
    isOpen: isAddToCartOpen,
    showSizeGuide,
    handleCloseSizeGuide,
    ...restAddToModalProps
  } = addToCartModalProps;

  const pincode = useMemo(() => {
    if (!isRunningOnClient()) {
      return "";
    }
    return pincodeDetails?.localityValue || locationDetails?.pincode || "";
  }, [pincodeDetails, locationDetails]);

  const lastPincodeRef = useRef(pincode);

  const handleWishlistToggle = (data) => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    toggleWishlist(data);
  };

  const config = useMemo(() => {
    return {
      dots: activeCollectionItems?.length > per_row?.value,
      speed: 500,
      slidesToShow: per_row?.value ?? 4,
      slidesToScroll: per_row?.value ?? 4,
      swipeToSlide: true,
      lazyLoad: true,
      autoplay: false,
      autoplaySpeed: 3000,
      cssEase: "linear",
      arrows: activeCollectionItems?.length > per_row?.value,

      nextArrow: <SvgWrapper svgSrc="glideArrowRight" />,
      prevArrow: <SvgWrapper svgSrc="glideArrowLeft" />,
      adaptiveHeight: true,
      responsive: [
        {
          breakpoint: 780,
          settings: {
            arrows: false,
            slidesToShow: per_row?.value ?? 4,
            slidesToScroll: per_row?.value ?? 4,
          },
        },
        {
          breakpoint: 480,
          settings: {
            dots: false,
            arrows: false,
            slidesToShow: activeCollectionItems?.length >= 2 ? 2 : 1,
            slidesToScroll: activeCollectionItems?.length >= 2 ? 2 : 1,
            centerMode: activeCollectionItems?.length !== 1,
            centerPadding: "25px",
          },
        },
      ],
    };
  }, [activeCollectionItems, per_row]);

  const dynamicStyles = {
    paddingBottom: `${globalConfig?.section_margin_bottom}px`,
  };
  const handleLinkChange = (index) => {
    setActiveLink(index);
  };
  const navigationsAndCollections = useMemo(
    () =>
      (blocks ?? []).reduce((result, block) => {
        if (
          block?.props?.navigation?.value ||
          block?.props?.icon_image?.value
        ) {
          result.push({
            collection: block?.props?.collection?.value,
            navigation: block?.props?.navigation?.value,
            link: block?.props?.collection?.value
              ? `/collection/${block?.props?.collection?.value}`
              : block?.props?.redirect_link?.value,
            iconImage: block?.props?.icon_image?.value,
          });
        }
        return result;
      }, []),
    [blocks]
  );
  const fetchCollection = (slug) => {
    const payload = {
      slug,
      first: 12,
      pageNo: 1,
    };

    fpi.executeGQL(FEATURED_COLLECTION, payload).then((res) => {
      fpi.custom.setValue(
        `mcpl-${slug}`,
        res?.data?.collection?.products?.items ?? []
      );
      setActiveCollectionItems(res?.data?.collection?.products?.items);
    });
  };
  useEffect(() => {
    const activeCollection =
      navigationsAndCollections?.[activeLink]?.collection;
    if (
      customValues[`mcpl-${activeCollection}`] &&
      lastPincodeRef.current === pincode
    ) {
      setActiveCollectionItems(customValues[`mcpl-${activeCollection}`]);
    } else {
      lastPincodeRef.current = pincode;
      fetchCollection(activeCollection);
    }
  }, [activeLink, navigationsAndCollections, pincode]);

  return (
    <>
      <div style={dynamicStyles} className={`${styles.sectionWrapper} `}>
        {heading?.value && (
          <div
            className={`${styles.titleBlock} ${
              position?.value === "center" ? styles.moveCenter : ""
            } ${viewAll?.value ? styles.isViewAllCta : ""}`}
          >
            <h2>{heading.value}</h2>
            {viewAll?.value && (
              <div className={styles.viewAllCta}>
                <FDKLink
                  to={navigationsAndCollections?.[activeLink]?.link ?? ""}
                >
                  <span>View All</span>
                </FDKLink>
              </div>
            )}
          </div>
        )}

        <div className={styles.navigationBlockWrapper}>
          <div
            className={`${styles.navigationBlock} ${
              position?.value === "center" ? styles.moveCenter : ""
            }`}
          >
            {navigationsAndCollections.map((nav, index) =>
              nav.collection ? (
                <button
                  key={index + nav.navigation}
                  className={`${styles.navigation} ${
                    activeLink === index ? styles.activeLink : ""
                  }`}
                  onClick={() => handleLinkChange(index)}
                >
                  {nav.iconImage && (
                    <FyImage
                      customClass={styles.iconImage}
                      src={nav.iconImage}
                      sources={[{ width: 40 }]}
                      defer={true}
                      alt={`${nav.navigation} icon`}
                      showSkeleton={false}
                      isFixedAspectRatio={false}
                      isLazyLoaded={false}
                      backgroundColor="transparent"
                    />
                  )}
                  {nav.navigation}
                </button>
              ) : (
                <FDKLink
                  key={index + nav.navigation}
                  className={`${styles.navigation} ${
                    activeLink === index ? styles.activeLink : ""
                  }`}
                  to={nav.link ?? ""}
                >
                  {nav.iconImage && (
                    <FyImage
                      customClass={styles.iconImage}
                      src={nav.iconImage}
                      sources={[{ width: 40 }]}
                      defer={true}
                      alt={`${nav.navigation} icon`}
                      showSkeleton={false}
                      isFixedAspectRatio={false}
                      isLazyLoaded={false}
                      backgroundColor="transparent"
                    />
                  )}
                  {nav.navigation}
                </FDKLink>
              )
            )}
          </div>
        </div>
        <div className={styles.productContainer}>
          <noscript>
            <div
              className={styles.ssrSlider}
              style={{
                "--col-count": per_row?.value,
                "--col-count-mobile":
                  customValues[`mcpl-${blocks?.[0]?.props?.collection?.value}`]
                    ?.length >= 2
                    ? 2
                    : 1,
              }}
            >
              {customValues[
                `mcpl-${blocks?.[0]?.props?.collection?.value}`
              ]?.map((product, index) => (
                <div
                  key={index}
                  className={`${styles.ssrSlide} ${styles.sliderView}`}
                >
                  <FDKLink to={`/product/${product.slug}`}>
                    <ProductCard
                      product={product}
                      listingPrice={listingPrice}
                      isSaleBadgeDisplayed={false}
                      isWishlistDisplayed={false}
                      isWishlistIcon={show_wishlist_icon?.value}
                      isPrice={globalConfig?.show_price}
                      isImageFill={true}
                      onWishlistClick={handleWishlistToggle}
                      followedIdList={followedIdList}
                      showAddToCart={showAddToCart}
                      handleAddToCart={handleAddToCart}
                      isSlider
                      columnCount={{
                        desktop: per_row?.value >= 2 ? 4 : 2,
                        tablet: per_row?.value >= 2 ? 2 : 3,
                        mobile: activeCollectionItems?.length >= 2 ? 2 : 1,
                      }}
                    />
                  </FDKLink>
                </div>
              ))}
            </div>
          </noscript>
          {activeCollectionItems?.length > 0 && (
            <div
              className={styles.slideWrap}
              style={{
                "--slick-dots": `${Math.ceil(activeCollectionItems?.length / per_row?.value) * 22 + 10}px`,
              }}
            >
              <Slider
                className={`
                ${
                  activeCollectionItems?.length <= per_row?.value
                    ? "no-nav"
                    : ""
                } ${styles.customSlider}`}
                {...config}
              >
                {activeCollectionItems?.map((product, index) => (
                  <div
                    data-cardtype="'Products'"
                    key={index}
                    className={styles.sliderView}
                  >
                    <FDKLink to={`/product/${product.slug}`}>
                      <ProductCard
                        product={product}
                        listingPrice={listingPrice}
                        isSaleBadgeDisplayed={false}
                        isWishlistDisplayed={false}
                        isWishlistIcon={show_wishlist_icon?.value}
                        isPrice={globalConfig?.show_price}
                        isImageFill={true}
                        onWishlistClick={handleWishlistToggle}
                        followedIdList={followedIdList}
                        showAddToCart={showAddToCart}
                        handleAddToCart={handleAddToCart}
                        isSlider
                        columnCount={{
                          desktop: per_row?.value > 2 ? 4 : 2,
                          tablet: per_row?.value > 2 ? 3 : 2,
                          mobile: activeCollectionItems?.length >= 2 ? 2 : 1,
                        }}
                      />
                    </FDKLink>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
      {showAddToCart && (
        <>
          <Modal
            isOpen={isAddToCartOpen}
            hideHeader={!isTablet}
            bodyClassName={styles.addToCartBody}
            title={
              isTablet ? restAddToModalProps?.productData?.product?.name : ""
            }
            closeDialog={restAddToModalProps?.handleClose}
            containerClassName={styles.addToCartContainer}
          >
            <AddToCart {...restAddToModalProps} globalConfig={globalConfig} />
          </Modal>
          <SizeGuide
            isOpen={showSizeGuide}
            onCloseDialog={handleCloseSizeGuide}
            productMeta={restAddToModalProps?.productData?.product?.sizes}
          />
        </>
      )}
    </>
  );
}

export const settings = {
  label: "Multi Collection Product List",
  props: [
    {
      type: "text",
      id: "heading",
      default: "",
      label: "Heading",
    },
    {
      type: "range",
      id: "per_row",
      min: 2,
      max: 6,
      step: 1,
      unit: "",
      label: "Products per row",
      default: 4,
      info: "Maximum products allowed per row",
    },

    {
      id: "position",
      type: "select",
      options: [
        {
          value: "left",
          text: "Left",
        },
        {
          value: "center",
          text: "Center",
        },
      ],
      default: "left",
      label: "Header Position",
    },
    {
      type: "checkbox",
      id: "viewAll",
      default: false,
      label: "Show View All",
      info: "Display View All",
    },
    {
      type: "checkbox",
      id: "show_wishlist_icon",
      label: "Show Wish List Icon",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_add_to_cart",
      label: "Show Add to Cart",
      default: true,
    },
  ],
  blocks: [
    {
      type: "collection-item",
      name: "Navigation",
      props: [
        {
          type: "image_picker",
          id: "icon_image",
          label: "Icon",
          default: "",
        },
        {
          type: "text",
          id: "navigation",
          label: "Navigation Name",
          default: "",
        },
        {
          type: "collection",
          id: "collection",
          label: "Collection",
          info: "Select a collection to display its products",
        },
        {
          type: "url",
          id: "redirect_link",
          label: "Button Link",
        },
      ],
    },
  ],
  preset: {
    blocks: [
      {
        name: "Navigation",
      },
    ],
  },
};

Component.serverFetch = async ({ fpi, props, blocks }) => {
  const slug = blocks?.[0]?.props?.collection?.value;
  const navigation = blocks?.[0]?.props?.navigation?.value;
  if (slug && navigation) {
    const payload = {
      slug,
      first: 12,
      pageNo: 1,
    };

    return fpi.executeGQL(FEATURED_COLLECTION, payload).then((res) => {
      const items = res?.data?.collection?.products?.items ?? [];
      return fpi.custom.setValue(`mcpl-${slug}`, items);
    });
  }
};
export default Component;
