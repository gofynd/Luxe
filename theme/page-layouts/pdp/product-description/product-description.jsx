import React, { useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";

import OutsideClickHandler from "react-outside-click-handler";
import styles from "./product-description.less";

import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import useProductDescription from "./useProductDescription";
import PdpImageGallery from "../components/image-gallery/image-gallery";
import ProductVariants from "../components/product-variants/product-variants";
import SizeGuide from "../size-guide/size-guide";
import FyImage from "../../../components/core/fy-image/fy-image";
import DeliveryInfo from "../components/delivery-info/delivery-info";
import Offers from "../components/offers/offers";
import ProdDesc from "../components/prod-desc/prod-desc";
import BreadCrumb from "../components/breadcrumb/breadcrumb";
import Badges from "../components/badges/badges";
import ProductCompareButton from "../../compare/product-compare-button";

function ProductDescriptionPdp({ fpi, slug }) {
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const {
    productDetails,
    isLoading,
    productPriceBySlug,
    productMeta,
    currentPincode,
    pageConfig,
    globalConfig,
    coupons,
    followed,
    promotions,
    selectPincodeError,
    pincodeErrorMessage,
    setCurrentSize,
    setCurrentPincode,
    addToWishList,
    removeFromWishlist,
    addProductForCheckout,
    checkPincode,
  } = useProductDescription(fpi, slug);
  const priceDataDefault = productMeta?.price;
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [errMessage, setErrorMessage] = useState("");
  const {
    media,
    grouped_attributes,
    name,
    short_description,
    variants,
    sizes,
  } = productDetails;

  const isMto = productDetails?.custom_order?.is_custom_order || false;

  const {
    show_price,
    show_size_guide = true,
    disable_cart,
    button_options,
    custom_button_text,
    custom_button_link,
    custom_button_icon,
  } = globalConfig;

  const priceDataBySize = productPriceBySlug?.price;
  const isSizeSelectionBlock = pageConfig?.size_selection_style === "block";
  const isSingleSize = sizes?.sizes?.length === 1;
  const isSizeCollapsed = pageConfig?.hide_single_size && isSingleSize;
  const preSelectFirstOfMany = pageConfig?.preselect_size;

  function getManufacturingTime() {
    const custom_order = productDetails?.custom_order;

    if (
      custom_order?.manufacturing_time >= 0 &&
      custom_order?.manufacturing_time_unit
    ) {
      return custom_order;
    }

    return false;
  }

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

  const isSizeGuideAvailable = () => {
    const sizeChartHeader = productMeta?.size_chart?.headers || {};
    return (
      Object.keys(sizeChartHeader).length > 0 || productMeta?.size_chart?.image
    );
  };

  return (
    <>
      <div className={`${styles.mainContainer} fontBody`}>
        <BreadCrumb
          productData={productDetails}
          pageConfig={pageConfig}
          customClass={styles.isDesktop}
        />
        <div className={styles.productDescContainer}>
          <div className={styles.left}>
            {media?.length > 0 && (
              <div className={styles.imgWrap}>
                <PdpImageGallery
                  key={slug}
                  images={media}
                  product={productDetails}
                  iconColor={pageConfig?.icon_color || ""}
                  globalConfig={globalConfig}
                  followed={followed}
                  removeFromWishlist={removeFromWishlist}
                  addToWishList={addToWishList}
                />
              </div>
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.product}>
              <BreadCrumb
                productData={productDetails}
                pageConfig={pageConfig}
                customClass={styles.isMobile}
              />
              {/* ---------- Product Name ----------  */}
              <h1
                className={`${styles.product__title} ${styles.h2} ${styles.fontHeader} fontHeader`}
              >
                {name}
              </h1>
              {/* ---------- Product Price ---------- */}
              {show_price && !isLoading && productMeta?.sellable && (
                <div className={styles.product__price}>
                  {getProductPrice("effective") &&
                    pageConfig?.mrp_label &&
                    getProductPrice("effective") ===
                      getProductPrice("marked") && (
                      <span
                        className={`${styles.mrpLabel} ${styles["mrpLabel--effective"]}`}
                        style={{ marginLeft: 0 }}
                      >
                        MRP:
                      </span>
                    )}
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
                  {productPriceBySlug?.discount && (
                    <span className={styles["product__price--discount"]}>
                      {productPriceBySlug?.discount}
                    </span>
                  )}
                </div>
              )}
              {/* ---------- Product Tax Label ---------- */}
              {pageConfig?.tax_label && productMeta?.sellable && (
                <div className={`${styles.captionNormal} ${styles.taxLabel}`}>
                  {pageConfig?.tax_label}
                </div>
              )}
              {/* ---------- Product Rating ---------- */}
              {/* {getReviewRatingInfo.avg_ratings ||
  (getReviewRatingInfo.review_count && (
    <div class="review-rating-container">
      {getReviewRatingInfo.avg_ratings && (
        <div class="rating-wrapper">
          <span class="b1">
            {getReviewRatingInfo.avg_ratings}
          </span>
          <SvgWrapper
            svgSrc="star"
            className={styles.ratingIcon}
          />
        </div>
      )}
      {getReviewRatingInfo.avg_ratings &&
        getReviewRatingInfo.review_count && (
          <div className={styles.separator}>&nbsp;</div>
        )}
      {getReviewRatingInfo.review_count && (
        <div
          class={`${styles.reviewWrapper} ${styles.captionNormal}`}
        >
          {getReviewRatingInfo.review_count +
            ` Review${
              getReviewRatingInfo.review_count > 1 ? "s" : ""
            }`}
        </div>
      )}
    </div>
  ))} */}
              {/* ---------- Short Description ----------  */}
              {short_description?.length > 0 && (
                <p
                  className={`${styles.b2} ${styles.fontBody} ${styles.shortDescription}`}
                >
                  {short_description}
                </p>
              )}
              {/* ---------- Product Variants ----------  */}
              {variants?.length > 0 && (
                <div>
                  <ProductVariants
                    product={productDetails}
                    variants={variants}
                    currentSlug={slug}
                    globalConfig={globalConfig}
                  />
                </div>
              )}
              {/* ---------- Seller Details ---------- */}
              {pageConfig?.show_seller && selectedSize && (
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
                  {/* <store-modal
      :is-open="showStoreModal"
      :active-store-info="storeInfo"
      :all_stores_info="all_stores_info"
      :seller-data="sellerData"
      :app_features="context.app_features"
      @closedialog="toggleStoreSidebar"
      @store-filter="updateStoreFilter"
      @store-item-select="setStoreInfo"
    ></store-modal> */}
                </div>
              )}
              {/* ---------- Size Container ---------- */}
              <div className={styles.sizeContainer}>
                {isSizeSelectionBlock && productMeta?.sellable && (
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
              {show_size_guide &&
                isSizeGuideAvailable() &&
                productMeta?.sellable && (
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowSizeGuide(true)}
                      className={`${styles["product__size--guide"]} ${styles.buttonFont} ${styles.fontBody}`}
                    >
                      <span>SIZE GUIDE</span>
                      <SvgWrapper svgSrc="scale" className={styles.scaleIcon} />
                    </button>
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
                {pageConfig?.size_selection_style === "dropdown" &&
                  productMeta?.sellable && (
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
                    {!disable_cart && productMeta?.sellable && (
                      <button
                        type="button"
                        className={`${styles.button} ${styles.btnSecondary} ${styles.flexCenter} ${styles.addToCart} ${styles.fontBody}`}
                        onClick={(e) =>
                          addProductForCheckout(e, selectedSize, false)
                        }
                      >
                        <SvgWrapper svgSrc="cart" className={styles.cartIcon} />
                        ADD TO CART
                      </button>
                    )}
                    {!productMeta?.sellable && (
                      <button
                        type="button"
                        disabled
                        className={`${styles.button} ${styles.btnPrimary} ${styles.notAvailable} ${styles.fontBody}`}
                      >
                        PRODUCT NOT AVAILABLE
                      </button>
                    )}
                  </div>
                )}

                {button_options?.includes("buynow") &&
                  isSizeSelectionBlock &&
                  productMeta?.sellable && (
                    <div
                      className={`${styles.actionBuyNow} ${
                        button_options?.includes("addtocart") &&
                        styles["actionBuyNow--ml-12"]
                      }`}
                    >
                      {!disable_cart && productMeta?.sellable && (
                        <button
                          type="button"
                          className={`${styles.button} ${styles.btnPrimary} ${styles.buyNow} ${styles.fontBody}`}
                          onClick={(e) =>
                            addProductForCheckout(e, selectedSize, true)
                          }
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
                  {!disable_cart && productMeta?.sellable && (
                    <button
                      type="button"
                      className={`${styles.button} ${styles.btnPrimary} ${styles.buyNow} ${styles.fontBody}`}
                      onClick={(e) =>
                        addProductForCheckout(e, selectedSize, true)
                      }
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

              {custom_button_text && button_options?.includes("button") && (
                <FDKLink to={custom_button_link}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.btnPrimary} ${styles.buyNow} ${styles.fontBody}`}
                  >
                    {custom_button_icon && (
                      <FyImage
                        customClass={styles.customIcon}
                        src={custom_button_icon}
                        globalConfig={globalConfig}
                      />
                    )}
                    {custom_button_text}
                  </button>
                </FDKLink>
              )}

              {/* ---------- Pincode ---------- */}
              {productMeta?.sellable && selectedSize && (
                <DeliveryInfo
                  pincode={currentPincode}
                  tat={productPriceBySlug?.delivery_promise}
                  selectPincodeError={selectPincodeError}
                  pincodeErrorMessage={pincodeErrorMessage}
                  setCurrentPincode={setCurrentPincode}
                  setErrorMessage={setErrorMessage}
                  checkPincode={checkPincode}
                  fpi={fpi}
                />
              )}
              {pageConfig?.add_to_compare && (
                <ProductCompareButton
                  customClass={styles.compareBtn}
                  fpi={fpi}
                  slug={slug}
                />
              )}

              {/* ---------- Offers---------- */}
              {productMeta?.sellable && pageConfig?.show_offers && (
                <Offers couponsList={coupons} promotionsList={promotions} />
              )}
              {/* ----------Prod Meta ---------- */}
              <ul className={`${styles.productDetail} ${styles.fontBody}`}>
                {pageConfig?.return && (
                  <>
                    {productPriceBySlug?.return_config?.returnable && (
                      <li className={styles.b2}>
                        {`${productPriceBySlug?.return_config?.time} ${productPriceBySlug?.return_config?.unit} return`}
                      </li>
                    )}
                    {/* v-else-if="returnConfig.returnable === false"  */}
                    {!productPriceBySlug?.return_config?.returnable &&
                      selectedSize && (
                        <li className={styles.b2}>
                          No return available on this product
                        </li>
                      )}
                  </>
                )}
                {getManufacturingTime() && selectedSize && (
                  <li className={styles.b2}>
                    {`Shipping within ${productDetails?.custom_order?.manufacturing_time} ${productDetails?.custom_order?.manufacturing_time_unit}`}
                  </li>
                )}
                {pageConfig?.item_code && productDetails?.item_code && (
                  <li className={styles.b2}>
                    Item code : {productDetails?.item_code}
                  </li>
                )}
              </ul>

              {/* ---------- Trust Markers ---------- */}
              <Badges pageConfig={pageConfig} />

              {/* ---------- Prod Desc ---------- */}
              {pageConfig.variant_position === "accordion" && (
                <div className={styles.productDescDesktop}>
                  <ProdDesc product={productDetails} pageConfig={pageConfig} />
                </div>
              )}
            </div>
          </div>
        </div>
        <ProdDesc
          customClass={
            pageConfig.variant_position === "tabs"
              ? ""
              : styles.productDescMobileAcc
          }
          product={productDetails}
          pageConfig={pageConfig}
        />
      </div>

      {/* {isLoading && <Loader />} */}
    </>
  );
}

export default ProductDescriptionPdp;
