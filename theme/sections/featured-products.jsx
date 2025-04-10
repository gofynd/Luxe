import React, { useState, useEffect } from "react";
import styles from "../styles/sections/featured-product.less";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import PdpImageGallery from "../page-layouts/pdp/components/image-gallery/image-gallery";
import ProductVariants from "../page-layouts/pdp/components/product-variants/product-variants";
import SizeGuide from "../page-layouts/pdp/size-guide/size-guide";
import CheckPincodeModal from "../components/pincode-modal/check-pincode-modal";
import {
  FEATURE_PRODUCT_DETAILS,
  FEATURE_PRODUCT_SIZE_PRICE,
} from "../queries/featureProductQuery";
import { useGlobalStore, useFPI, useGlobalTranslation } from "fdk-core/utils";
import useFeatureProductDetails from "../components/featured-product/useFeatureProductDetails";
import { LOCALITY } from "../queries/logisticsQuery";
import { currencyFormat } from "../helper/utils";

export function Component({ props, globalConfig = {} }) {
  const { t } = useGlobalTranslation("translation");
  const {
    size_selection_style,
    hide_single_size,
    product,
    Heading,
    description,
    show_seller,
    show_size_guide,
    tax_label,
  } = props;
  const [slug, setSlug] = useState(product?.value);
  const fpi = useFPI();

  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const i18nDetails = useGlobalStore(fpi.getters.i18N_DETAILS);
  const featureProductDetails = `featureProductDetails-${slug}`;

  const isMto =
    customValues?.[featureProductDetails]?.productDetails?.product?.custom_order
      ?.is_custom_order || false;

  const { show_price, disable_cart, button_options } = globalConfig;

  const { media, name, short_description, variants, sizes, uid, moq } =
    customValues?.[featureProductDetails]?.productDetails?.product || {};
  const {
    seller,
    price_per_piece,
    delivery_promise,
    store,
    article_id,
    article_assignment,
  } = customValues?.[featureProductDetails]?.productPrice?.productPrice || {};

  const [selectedSize, setSelectedSize] = useState(
    sizes?.sizes?.find((size) => size?.is_available)?.value || ""
  );
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [currentPincode, setCurrentPincode] = useState("");
  const [showShareIcon, setShowShareIcon] = useState(false);
  const isSizeSelectionBlock = size_selection_style?.value === "block";
  const isSingleSize = sizes?.sizes?.length === 1;
  const isSizeCollapsed = hide_single_size?.value && isSingleSize;
  const {
    addProductForCheckout,
    pincodeErrorMessage,
    setPincodeErrorMessage,
    followed,
    removeFromWishlist,
    addToWishList,
  } = useFeatureProductDetails({
    fpi,
    moq,
    selectedSize,
    article_assignment,
    article_id,
    uid,
    seller,
    store,
    currentPincode,
  });

  const images = [
    {
      alt: "image",
      type: "image",
      url: "https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/theme-image-1623307821127.png",
    },
  ];

  function getProductPrice(key) {
    if (selectedSize) {
      if (price_per_piece?.[key]) {
        return currencyFormat(
          price_per_piece?.[key],
          price_per_piece?.currency_symbol
        );
      }
      const priceDataDefault = sizes?.price;

      if (priceDataDefault) {
        return priceDataDefault?.[key]?.min !== priceDataDefault?.[key]?.max
          ? `${priceDataDefault?.[key]?.currency_symbol || ""} ${currencyFormat(priceDataDefault?.[key]?.min) || ""
          } - ${currencyFormat(priceDataDefault?.[key]?.max) || ""}`
          : currencyFormat(
            priceDataDefault?.[key]?.max,
            priceDataDefault?.[key]?.currency_symbol
          ) || "";
      }
    }
  }

  async function onSizeSelection(size) {
    if (size?.quantity === 0 && !isMto) {
      return;
    }
    setSelectedSize(size?.value);
    setShowSizeDropdown(false);

    const payload = {
      slug,
      pincode: "",
      size: size?.value,
    };

    const productPrice = await fpi.executeGQL(
      FEATURE_PRODUCT_SIZE_PRICE,
      payload,
      {
        skipStoreUpdate: true,
      }
    );

    fpi.custom.setValue(`featureProductDetails-${slug}`, {
      ...customValues?.[featureProductDetails],
      productPrice: productPrice?.data,
    });
  }

  useEffect(() => {
    if (localStorage.getItem("pincode")) {
      setCurrentPincode(localStorage.getItem("pincode"));
    }
    const fetchProductData = async () => {
      const values = {
        slug,
      };
      try {
        const productDetails = await fpi.executeGQL(
          FEATURE_PRODUCT_DETAILS,
          values,
          {
            skipStoreUpdate: true,
          }
        );
        const { sizes } = productDetails?.data?.product;
        const size = sizes?.sizes?.find((size) => size?.is_available)?.value;
        const payload = {
          slug,
          pincode: "",
          size: selectedSize || size,
        };
        const productPrice = await fpi.executeGQL(
          FEATURE_PRODUCT_SIZE_PRICE,
          payload,
          {
            skipStoreUpdate: true,
          }
        );

        return fpi.custom.setValue(`featureProductDetails-${slug}`, {
          productDetails: productDetails?.data,
          productPrice: productPrice?.data,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (slug) {
      fetchProductData();
    }
  }, [slug, locationDetails?.pincode, i18nDetails?.currency?.code]);

  useEffect(() => {
    if (!selectedSize) {
      setSelectedSize(sizes?.sizes?.find((size) => size?.is_available)?.value);
    }
  }, [sizes?.sizes]);
  const isSizeGuideAvailable = () => {
    const sizeChartHeader = sizes?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0 || sizes?.size_chart?.image;
  };

  const getProductSlug = () => {
    window.open(`${window.location.href}product/${slug}`);
  };
  const [openPincodeModal, setOpenPicodeModal] = useState(false);

  const checkPincode = (postCode) => {
    fpi
      .executeGQL(LOCALITY, {
        locality: `pincode`,
        localityValue: `${postCode}`,
      })
      .then((res) => {
        if (res?.data?.locality) {
          localStorage?.setItem("pincode", postCode);
          setCurrentPincode(postCode);
          setOpenPicodeModal(false);
        } else {
          localStorage?.removeItem("pincode");
          setPincodeErrorMessage(
            res?.errors?.[0]?.message ||
            t(
              "resource.common.address.pincode_verification_failure"
            )
          );
        }
      });
  };
  // return bannerImage?.value ? <ImageBanner bannerImage={bannerImage} /> : null;
  return (
    <div
      className={styles.featured_product_container}
      style={{
        paddingTop: `16px`,
        paddingBottom: `${globalConfig?.section_margin_bottom + 16}px`,
      }}
    >
      <div className={styles["featured-products-header"]}>
        {Heading?.value && (
          <h2 className={`${styles.title} fontHeader`}>{Heading?.value}</h2>
        )}
        {description?.value && (
          <div className={`${styles.description} fontBody`}>
            {description?.value}
          </div>
        )}
      </div>
      <div className={`${styles.mainContainer} fontBody`}>
        <div className={styles.productDescContainer}>
          <div className={styles.left}>
            <div className={styles.imgWrap}>
              <PdpImageGallery
                key={slug}
                images={slug && media?.length ? media : images}
                product={
                  customValues?.[featureProductDetails]?.productDetails?.product
                }
                globalConfig={globalConfig}
                hiddenDots={true}
                addToWishList={addToWishList}
                removeFromWishlist={removeFromWishlist}
                slideTabCentreNone={true}
                hideImagePreview={true}
                followed={followed}
                showShareIcon={showShareIcon}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.product}>
              {/* ---------- Product Name ----------  */}
              <h1
                className={`${styles.product__title} h2 ${styles.fontHeader} fontHeader`}
              >
                {slug && name}
              </h1>
              {/* ---------- Product Price ---------- */}
              {show_price && sizes?.sellable && (
                <div className={styles.product__price}>
                  <h4 className={styles["product__price--effective"]}>
                    {getProductPrice("effective")}
                  </h4>
                  {getProductPrice("marked") &&
                    getProductPrice("effective") !==
                    getProductPrice("marked") && (
                      <span
                        className={`${styles.mrpLabel} ${styles["mrpLabel--marked"]}`}
                      >
                        &nbsp;{t("resource.common_common_words.mrp")}
                      </span>
                    )}
                  {getProductPrice("effective") !==
                    getProductPrice("marked") && (
                      <span className={styles["product__price--marked"]}>
                        {getProductPrice("marked")}
                      </span>
                    )}
                  {sizes?.discount && (
                    <span className={styles["product__price--discount"]}>
                      {sizes?.discount}
                    </span>
                  )}
                </div>
              )}
              {/* ---------- Product Tax Label ---------- */}
              {tax_label?.value && (
                <div className={`captionNormal ${styles.taxLabel}`}>
                  ({tax_label?.value})
                </div>
              )}

              {/* ---------- Short Description ----------  */}
              {short_description?.length > 0 && (
                <p
                  className={`b2 ${styles.fontBody} ${styles.shortDescription}`}
                >
                  {slug && short_description}
                </p>
              )}
              {/* ---------- Product Variants ----------  */}
              {slug && variants?.length > 0 && (
                <div>
                  <ProductVariants
                    product={
                      customValues?.[featureProductDetails]?.productDetails
                        ?.product
                    }
                    variants={variants}
                    currentSlug={slug}
                    globalConfig={globalConfig}
                    preventRedirect={true}
                    setSlug={setSlug}
                  />
                </div>
              )}
              {/* ---------- Seller Details ---------- */}
              {show_seller?.value && seller?.name && (
                <div className={`${styles.sellerInfo} ${styles.fontBody}`}>
                  <div className={`${styles.storeSeller} captionNormal`}>
                    <span className={styles.soldByLabel}>Seller :</span>
                    <div className={`${styles.nameWrapper} `}>
                      <p className={styles.storeSellerName}>{seller?.name}</p>
                      {seller?.count > 1 && (
                        <span
                          className={`captionSemiBold ${styles.otherSellers}`}
                        >
                          &nbsp;&&nbsp;
                          {`${(seller?.count ?? 2) - 1} ${t(seller?.count > 1 ? 'resource.common.other_plural' : 'resource.common.other')}`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* ---------- Size Container ---------- */}
              <div className={styles.sizeContainer}>
                {isSizeSelectionBlock && (
                  <div
                    className={`${styles.sizeSelection} ${isSizeCollapsed ? styles["sizeSelection--collapse"] : ""
                      }`}
                  >
                    <div>
                      <p className={`b2 ${styles.sizeSelection__label}`}>
                        <span>
                          {t("resource.common.size")} :
                        </span>
                      </p>

                      <div className={styles.sizeSelection__wrapper}>
                        {sizes?.sizes?.map((size) => (
                          <button
                            type="button"
                            key={`${size?.display}`}
                            className={`b2 ${styles.sizeSelection__block} ${size.quantity === 0 &&
                              !isMto &&
                              styles["sizeSelection__block--disable"]
                              } ${(size?.quantity !== 0 || isMto) &&
                              styles["sizeSelection__block--selectable"]
                              } ${selectedSize === size?.value &&
                              styles["sizeSelection__block--selected"]
                              } `}
                            title={size?.value}
                            onClick={() => onSizeSelection(size)}
                          >
                            {size?.display}
                            {size?.quantity === 0 && !isMto && (
                              <svg>
                                <line x1="0" y1="100%" x2="100%" y2="0" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* ---------- Size Guide ---------- */}
              {isSizeGuideAvailable() && sizes?.sellable && (
                <div>
                  {show_size_guide?.value && (
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className={`${styles["product__size--guide"]} ${styles.buttonFont} ${styles.fontBody}`}
                    >
                      <span>
                        {t(
                          "resource.common.size_guide"
                        )}
                      </span>
                      <SvgWrapper svgSrc="scale" className={styles.scaleIcon} />
                    </button>
                  )}
                  {showSizeGuide && (
                    <SizeGuide
                      customClass={styles.sizeGuide}
                      isOpen={showSizeGuide}
                      productMeta={sizes}
                      onCloseDialog={() => setShowSizeGuide(false)}
                    />
                  )}
                </div>
              )}
              {/* ---------- Size Dropdown And Action Buttons ---------- */}
              <div className={styles.sizeCartContainer}>
                {size_selection_style?.value === "dropdown" && (
                  <div
                    className={`${styles.sizeWrapper} ${isSizeCollapsed && styles["sizeWrapper--collapse"]
                      }`}
                  >
                    <div
                      className={` ${styles.sizeButton} ${styles.flexAlignCenter
                        } ${styles.justifyBetween} ${styles.fontBody} ${sizes?.sizes?.length && styles.disabledButton
                        }`}
                      onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                      disabled={!sizes?.sizes?.length}
                    >
                      <p
                        className={`${styles.buttonFont} ${styles.selectedSize}`}
                        title={
                          selectedSize
                            ? `${t("resource.common.size")} : ${selectedSize}`
                            : t(
                              "resource.common.select_size_caps"
                            )
                        }
                      >
                        {selectedSize
                          ? `${t("resource.common.size")} : ${selectedSize}`
                          : t(
                            "resource.common.select_size_caps"
                          )}
                      </p>
                      <SvgWrapper
                        svgSrc="arrow-down"
                        className={`${styles.dropdownArrow} ${showSizeDropdown && styles.rotateArrow
                          }`}
                      />
                    </div>
                    <OutsideClickHandler
                      onOutsideClick={() => {
                        setShowSizeDropdown(false);
                      }}
                    >
                      <ul
                        className={styles.sizeDropdown}
                        style={{
                          display: showSizeDropdown ? "block" : "none",
                        }}
                      >
                        {sizes?.sizes?.map((size) => (
                          <li
                            onClick={() => onSizeSelection(size)}
                            key={size?.value}
                            className={`${selectedSize === size.display &&
                              styles.selected_size
                              } ${size.quantity === 0 && !isMto
                                ? styles.disabled_size
                                : styles.selectable_size
                              }`}
                          >
                            {size.display}
                          </li>
                        ))}
                      </ul>
                    </OutsideClickHandler>
                  </div>
                )}

                {button_options?.includes("addtocart") && (
                  <div
                    className={`${styles.cartWrapper} ${isSizeSelectionBlock && styles["cartWrapper--half-width"]
                      }`}
                  >
                    {!disable_cart && (
                      <button
                        type="button"
                        className={`${styles.button} btnSecondary ${styles.flexCenter} ${styles.addToCart} ${styles.fontBody}`}
                        onClick={(e) => {
                          if (localStorage.getItem("pincode")) {
                            addProductForCheckout(e, selectedSize, false);
                          } else {
                            setOpenPicodeModal(!openPincodeModal);
                          }
                        }}
                        disabled={!slug}
                      >
                        <SvgWrapper svgSrc="cart" className={styles.cartIcon} />
                        {t(
                          "resource.common.add_to_cart"
                        )}
                      </button>
                    )}
                  </div>
                )}

                {button_options?.includes("buynow") && isSizeSelectionBlock && (
                  <div
                    className={`${styles.actionBuyNow} ${button_options?.includes("addtocart") &&
                      styles["actionBuyNow--ml-12"]
                      }`}
                  >
                    {!disable_cart && (
                      <button
                        type="button"
                        className={`${styles.button} btnPrimary ${styles.buyNow} ${styles.fontBody}`}
                        onClick={(e) => {
                          if (localStorage.getItem("pincode")) {
                            addProductForCheckout(e, selectedSize, true);
                          } else {
                            setOpenPicodeModal(!openPincodeModal);
                          }
                        }}
                        disabled={!slug}
                      >
                        <SvgWrapper
                          svgSrc="buyNow"
                          className={styles.buyNow__icon}
                        />
                        {t("resource.common.buy_now_caps")}
                      </button>
                    )}
                  </div>
                )}
              </div>
              {/* ---------- Buy Now and Custom Button ---------- */}
              {button_options?.includes("buynow") && !isSizeSelectionBlock && (
                <div className={styles.actionBuyNow}>
                  {!disable_cart && (
                    <button
                      type="button"
                      className={`${styles.button} btnPrimary ${styles.buyNow} ${styles.fontBody}`}
                      onClick={(e) => {
                        if (localStorage.getItem("pincode")) {
                          addProductForCheckout(e, selectedSize, true);
                        } else {
                          setOpenPicodeModal(!openPincodeModal);
                        }
                      }}
                      disabled={!slug}
                    >
                      <SvgWrapper
                        svgSrc="buyNow"
                        className={styles.buyNow__icon}
                      />
                      {t("resource.common.buy_now_caps")}
                    </button>
                  )}
                </div>
              )}
              <div
                onClick={() => {
                  if (slug) getProductSlug();
                }}
                className={styles["view-more"]}
              >
                {t("resource.common.view_more_details")}
              </div>
            </div>
          </div>
        </div>
      </div>
      {openPincodeModal && (
        <CheckPincodeModal
          setOpenPicodeModal={setOpenPicodeModal}
          pincode={currentPincode}
          tat={delivery_promise}
          pincodeErrorMessage={pincodeErrorMessage}
          setCurrentPincode={setCurrentPincode}
          checkPincode={checkPincode}
          fpi={fpi}
          setPincodeErrorMessage={setPincodeErrorMessage}
        />
      )}
    </div>
  );
}
export const settings = {
  label: "t:resource.sections.featured_products",
  props: [
    {
      type: "product",
      name: "t:resource.common.product",
      id: "product",
      label: "t:resource.common.select_a_product",
      info: "t:resource.common.product_item_display",
    },
    {
      type: "text",
      id: "Heading",
      default: "",
      label: "t:resource.common.heading",
      info: "t:resource.common.section_heading_text",
    },
    {
      type: "text",
      id: "description",
      default: "",
      label: "t:resource.common.description",
      info: "t:resource.common.section_description_text",
    },
    {
      type: "checkbox",
      id: "show_seller",
      label: "t:resource.common.show_seller",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_size_guide",
      label: "t:resource.common.show_size_guide",
      default: true,
    },
    {
      type: "radio",
      id: "size_selection_style",
      label: "t:resource.common.size_selection_style",
      default: "dropdown",
      options: [
        {
          value: "dropdown",
          text: "t:resource.common.dropdown_style",
        },
        {
          value: "block",
          text: "t:resource.common.block_style",
        },
      ],
    },
    {
      type: "checkbox",
      id: "hide_single_size",
      label: "t:resource.common.hide_single_size",
      default: false,
    },
    {
      type: "text",
      id: "tax_label",
      label: "t:resource.common.price_tax_label_text",
      default: "Price inclusive of all tax",
    },
  ],
};

Component.serverFetch = async ({ fpi, props }) => {
  const slug = props?.product?.value;
  if (slug) {
    const values = {
      slug,
    };

    const productDetails = await fpi.executeGQL(
      FEATURE_PRODUCT_DETAILS,
      values,
      {
        skipStoreUpdate: true,
      }
    );
    const { sizes } = productDetails?.data?.product;
    const payload = {
      slug,
      pincode: "",
      size: sizes?.sizes?.find((size) => size?.is_available)?.value,
    };
    const productPrice = await fpi.executeGQL(
      FEATURE_PRODUCT_SIZE_PRICE,
      payload,
      { skipStoreUpdate: true }
    );

    return fpi.custom.setValue(`featureProductDetails-${slug}`, {
      productDetails: productDetails?.data,
      productPrice: productPrice?.data,
    });
  }
};
export default Component;
