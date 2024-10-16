import React, { useState, useEffect } from "react";
import styles from "../styles/sections/featured-product.less";
import { FDKLink } from "fdk-core/components";
import OutsideClickHandler from "react-outside-click-handler";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import useProductDescription from "../page-layouts/pdp/product-description/useProductDescription";
import PdpImageGallery from "../page-layouts/pdp/components/image-gallery/image-gallery";
import ProductVariants from "../page-layouts/pdp/components/product-variants/product-variants";
import SizeGuide from "../page-layouts/pdp/size-guide/size-guide";
import CheckPincodeModal from "../components/pincode-modal/check-pincode-modal";

export function Component({ props, globalConfig, fpi }) {
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

  const [slug, setSlug] = useState(product?.value ? product?.value : "");

  const {
    productDetails,
    isLoading,
    productPriceBySlug,
    productMeta,
    pageConfig,
    followed,
    setCurrentSize,
    addToWishList,
    removeFromWishlist,
    addProductForCheckout,
    currentPincode,
    selectPincodeError,
    pincodeErrorMessage,
    setCurrentPincode,
    checkPincode,
    setPincodeErrorMessage,
  } = useProductDescription(fpi, slug);
  const priceDataDefault = productMeta?.price;

  const isMto = productDetails?.custom_order?.is_custom_order || false;

  const { show_price, disable_cart, button_options } = globalConfig;

  const { media, name, short_description, variants, sizes } = productDetails;

  const images = [
    {
      alt: "image",
      type: "image",
      url: "https://hdn-1.fynd.com/company/884/applications/000000000000000000000001/theme/pictures/free/original/theme-image-1623307821127.png",
    },
  ];

  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const priceDataBySize = productPriceBySlug?.price;
  const isSizeSelectionBlock = size_selection_style?.value === "block";
  const isSingleSize = sizes?.sizes?.length === 1;
  const isSizeCollapsed = hide_single_size?.value && isSingleSize;
  const preSelectFirstOfMany = pageConfig?.preselect_size;

  function getProductPrice(key) {
    if (selectedSize && productPriceBySlug) {
      if (productPriceBySlug?.set) {
        return productPriceBySlug?.price_per_piece[key] || "";
      }
      const price = productPriceBySlug?.price || "";
      return `${price?.currency_symbol || ""} ${price?.[key] || ""}`;
    }
    if (priceDataDefault) {
      return priceDataDefault?.[key]?.min !== priceDataDefault?.[key]?.max
        ? `${priceDataDefault?.[key]?.currency_symbol || ""} ${
            priceDataDefault?.[key]?.min || ""
          } - ${priceDataDefault?.[key]?.max || ""}`
        : `${priceDataDefault?.[key]?.currency_symbol || ""} ${
            priceDataDefault?.[key]?.max || ""
          } `;
    }
  }

  function onSizeSelection(size) {
    if (size?.quantity === 0 && !isMto) {
      return;
    }
    setSelectedSize(size?.value);
    setCurrentSize(size);
    setShowSizeDropdown(false);
  }

  useEffect(() => {
    if (isSizeCollapsed || (preSelectFirstOfMany && sizes !== undefined)) {
      onSizeSelection(sizes?.sizes?.[0]);
    }
  }, [isSizeCollapsed, preSelectFirstOfMany]);
  useEffect(() => {
    if (sizes?.sizes?.length > 0) onSizeSelection(sizes?.sizes?.[0]);
  }, [sizes?.sizes?.length]);

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = productMeta?.size_chart?.headers || {};
    return (
      Object.keys(sizeChartHeader).length > 0 || productMeta?.size_chart?.image
    );
  };

  const getProductSlug = () => {
    window.open(`${window.location.href}product/${slug}`);
  };
  const [openPincodeModal, setOpenPicodeModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // return bannerImage?.value ? <ImageBanner bannerImage={bannerImage} /> : null;
  return (
    <div className={styles.featured_product_container}>
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
                product={productDetails}
                iconColor={pageConfig?.icon_color || ""}
                globalConfig={globalConfig}
                hiddenDots={true}
                addToWishList={addToWishList}
                removeFromWishlist={removeFromWishlist}
                slideTabCentreNone={true}
                hideImagePreview={true}
                followed={followed}
              />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.product}>
              {/* ---------- Product Name ----------  */}
              <h1
                className={`${styles.product__title} ${styles.h2} ${styles.fontHeader} fontHeader`}
              >
                {slug && name}
              </h1>
              {/* ---------- Product Price ---------- */}
              {show_price && productMeta?.sellable && (
                <div className={styles.product__price}>
                  <h4 className={styles["product__price--effective"]}>
                    {getProductPrice("effective")}
                  </h4>
                  {getProductPrice("marked") &&
                    pageConfig?.mrp_label &&
                    getProductPrice("effective") !==
                      getProductPrice("marked") && (
                      <span
                        className={`${styles.mrpLabel} ${styles["mrpLabel--marked"]}`}
                      >
                        &nbsp;MRP:
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
                <div className={`${styles.captionNormal} ${styles.taxLabel}`}>
                  ({tax_label?.value})
                </div>
              )}

              {/* ---------- Short Description ----------  */}
              {short_description?.length > 0 && (
                <p
                  className={`${styles.b2} ${styles.fontBody} ${styles.shortDescription}`}
                >
                  {slug && short_description}
                </p>
              )}
              {/* ---------- Product Variants ----------  */}
              {slug && variants?.length > 0 && (
                <div>
                  <ProductVariants
                    product={productDetails}
                    variants={variants}
                    currentSlug={slug}
                    globalConfig={globalConfig}
                    preventRedirect={true}
                    setSlug={setSlug}
                  />
                </div>
              )}
              {/* ---------- Seller Details ---------- */}
              {show_seller?.value && (
                <div className={`${styles.sellerInfo} ${styles.fontBody}`}>
                  <div
                    className={`${styles.storeSeller} ${styles.captionNormal}`}
                  >
                    <span className={styles.soldByLabel}>Seller :</span>
                    <div
                      className={`${styles.nameWrapper} ${
                        pageConfig?.seller_store_selection && styles.selectable
                      }`}
                    >
                      <p className={styles.storeSellerName}>
                        {`${productPriceBySlug?.seller?.name || ""}`}
                      </p>
                      {productPriceBySlug?.seller?.count > 1 && (
                        <span
                          className={`${styles.captionSemiBold} ${styles.otherSellers}`}
                        >
                          &nbsp;&&nbsp;
                          {`${(productPriceBySlug?.seller?.count ?? 2) - 1} Other${
                            productPriceBySlug?.seller?.count > 1 > 2 ? "s" : ""
                          }`}
                        </span>
                      )}
                      {pageConfig?.seller_store_selection && (
                        <SvgWrapper
                          svgSrc="arrow-down"
                          className={styles.dropdownArrow}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {/* ---------- Size Container ---------- */}
              <div className={styles.sizeContainer}>
                {isSizeSelectionBlock && (
                  <div
                    className={`${styles.sizeSelection} ${
                      isSizeCollapsed ? styles["sizeSelection--collapse"] : ""
                    }`}
                  >
                    <div>
                      <p
                        className={`${styles.b2} ${styles.sizeSelection__label}`}
                      >
                        <span>Size :</span>
                      </p>

                      <div className={styles.sizeSelection__wrapper}>
                        {sizes?.sizes?.map((size) => (
                          <button
                            type="button"
                            key={`${size?.display}`}
                            className={`${styles.b2} ${
                              styles.sizeSelection__block
                            } ${
                              size.quantity === 0 &&
                              !isMto &&
                              styles["sizeSelection__block--disable"]
                            } ${
                              (size?.quantity !== 0 || isMto) &&
                              styles["sizeSelection__block--selectable"]
                            } ${
                              selectedSize === size?.value &&
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
              {isSizeGuideAvailable() && productMeta?.sellable && (
                <div>
                  {show_size_guide?.value && (
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className={`${styles["product__size--guide"]} ${styles.buttonFont} ${styles.fontBody}`}
                    >
                      <span>SIZE GUIDE</span>
                      <SvgWrapper svgSrc="scale" className={styles.scaleIcon} />
                    </button>
                  )}
                  {showSizeGuide && (
                    <SizeGuide
                      customClass={styles.sizeGuide}
                      isOpen={showSizeGuide}
                      productMeta={productMeta}
                      onCloseDialog={() => setShowSizeGuide(false)}
                    />
                  )}
                </div>
              )}
              {/* ---------- Size Dropdown And Action Buttons ---------- */}
              <div className={styles.sizeCartContainer}>
                {size_selection_style?.value === "dropdown" && (
                  <div
                    className={`${styles.sizeWrapper} ${
                      isSizeCollapsed && styles["sizeWrapper--collapse"]
                    }`}
                  >
                    <div
                      className={` ${styles.sizeButton} ${
                        styles.flexAlignCenter
                      } ${styles.justifyBetween} ${styles.fontBody} ${
                        sizes?.sizes?.length && styles.disabledButton
                      }`}
                      onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                      disabled={!sizes?.sizes?.length}
                    >
                      <p
                        className={`${styles.buttonFont} ${styles.selectedSize}`}
                        title={
                          selectedSize
                            ? `Size : ${selectedSize}`
                            : "SELECT SIZE"
                        }
                      >
                        {selectedSize
                          ? `Size : ${selectedSize}`
                          : "SELECT SIZE"}
                      </p>
                      <SvgWrapper
                        svgSrc="arrow-down"
                        className={`${styles.dropdownArrow} ${
                          showSizeDropdown && styles.rotateArrow
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
                            className={`${
                              selectedSize === size.display &&
                              styles.selected_size
                            } ${
                              size.quantity === 0 && !isMto
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
                    className={`${styles.cartWrapper} ${
                      isSizeSelectionBlock && styles["cartWrapper--half-width"]
                    }`}
                  >
                    {!disable_cart && (
                      <button
                        type="button"
                        className={`${styles.button} ${styles.btnSecondary} ${styles.flexCenter} ${styles.addToCart} ${styles.fontBody}`}
                        onClick={(e) => {
                          if (localStorage.getItem("pincode")) {
                            addProductForCheckout(e, selectedSize, false);
                          } else {
                            setOpenPicodeModal(!openPincodeModal);
                          }
                        }}
                        disabled={!slug || isLoading}
                      >
                        <SvgWrapper svgSrc="cart" className={styles.cartIcon} />
                        ADD TO CART
                      </button>
                    )}
                  </div>
                )}

                {button_options?.includes("buynow") && isSizeSelectionBlock && (
                  <div
                    className={`${styles.actionBuyNow} ${
                      button_options?.includes("addtocart") &&
                      styles["actionBuyNow--ml-12"]
                    }`}
                  >
                    {!disable_cart && (
                      <button
                        type="button"
                        className={`${styles.button} ${styles.btnPrimary} ${styles.buyNow} ${styles.fontBody}`}
                        onClick={(e) => {
                          if (localStorage.getItem("pincode")) {
                            addProductForCheckout(e, selectedSize, true);
                          } else {
                            setOpenPicodeModal(!openPincodeModal);
                          }
                        }}
                        disabled={!slug || isLoading}
                      >
                        <SvgWrapper
                          svgSrc="buy-now"
                          className={styles.buyNow__icon}
                        />
                        BUY NOW
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
                      className={`${styles.button} ${styles.btnPrimary} ${styles.buyNow} ${styles.fontBody}`}
                      onClick={(e) => {
                        if (localStorage.getItem("pincode")) {
                          addProductForCheckout(e, selectedSize, true);
                        } else {
                          setOpenPicodeModal(!openPincodeModal);
                        }
                      }}
                      disabled={!slug || isLoading}
                    >
                      <SvgWrapper
                        svgSrc="buy-now'"
                        className={styles.buyNow__icon}
                      />
                      BUY NOW
                    </button>
                  )}
                </div>
              )}
              <div
                onClick={slug && getProductSlug}
                className={styles["view-more"]}
              >
                View more details
              </div>
            </div>
          </div>
        </div>
      </div>
      {openPincodeModal && (
        <CheckPincodeModal
          setOpenPicodeModal={setOpenPicodeModal}
          pincode={currentPincode}
          tat={productPriceBySlug?.delivery_promise}
          selectPincodeError={selectPincodeError}
          pincodeErrorMessage={pincodeErrorMessage}
          setCurrentPincode={setCurrentPincode}
          setErrorMessage={setErrorMessage}
          checkPincode={checkPincode}
          fpi={fpi}
          setPincodeErrorMessage={setPincodeErrorMessage}
        />
      )}
    </div>
  );
}
export const settings = {
  label: "Featured Products",
  props: [
    {
      type: "product",
      name: "Product",
      id: "product",
      label: "Select a Product",
      info: "Product Item to be displayed",
    },
    {
      type: "text",
      id: "Heading",
      default: "",
      label: "Heading",
      info: "Heading text of the section",
    },
    {
      type: "text",
      id: "description",
      default: "",
      label: "Description",
      info: "Description text of the section",
    },
    {
      type: "checkbox",
      id: "show_seller",
      label: "Show Seller",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_size_guide",
      label: "Show Size Guide",
      default: true,
    },
    {
      type: "radio",
      id: "size_selection_style",
      label: "Size selection style",
      default: "dropdown",
      options: [
        {
          value: "dropdown",
          text: "Dropdown style",
        },
        {
          value: "block",
          text: "Block style",
        },
      ],
    },
    {
      type: "checkbox",
      id: "hide_single_size",
      label: "Hide single size",
      default: false,
    },
    {
      type: "text",
      id: "tax_label",
      label: "Price tax label text",
      default: "Price inclusive of all tax",
    },
  ],
};
