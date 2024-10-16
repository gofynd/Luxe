import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "fdk-react-templates/components/core/modal/modal";
import "fdk-react-templates/components/core/modal/modal.css";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import DeliveryInfo from "../delivery-info/delivery-info";
import SizeGuide from "../../size-guide/size-guide";
import styles from "./sticky-addtocart.less";

const StickyAddToCart = ({
  addToCartBtnRef,
  productMeta,
  selectedSize,
  onSizeSelection,
  pageConfig,
  sizes,
  getProductPrice,
  addProductForCheckout,
  productPriceBySlug,
  isSizeGuideAvailable,
  deliveryInfoProps,
}) => {
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const observerRef = useRef(null);
  useEffect(() => {
    const onAddToCartIntersection = (entries) => {
      if (entries[0]?.isIntersecting) {
        setIsComponentVisible(false);
      } else {
        setIsComponentVisible(true);
      }
    };
    observerRef.current = new IntersectionObserver(onAddToCartIntersection, {
      threshold: 1.0,
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (!productMeta?.loading) {
      observerRef.current.observe(addToCartBtnRef?.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [productMeta]);

  const openSizeModal = (e) => {
    e.preventDefault();
    setShowSizeModal(true);
  };
  const addToCartHandler = async (e) => {
    const outRes = await addProductForCheckout(e, selectedSize, false);
    if (outRes?.data?.addItemsToCart?.success) {
      setShowSizeModal(false);
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isComponentVisible && (
          <motion.div
            className={`${styles.stickyAddtocart} ${showSizeGuide && styles["stickyAddtocart--zIndex"]}`}
            key="add-to-cart-container"
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: "0%" }}
            exit={{ opacity: 0, y: "100%" }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              className={`${styles.btnSecondary} ${styles.button}`}
              onClick={openSizeModal}
            >
              <SvgWrapper svgSrc="cart" className={styles.cartIcon} />
              ADD TO CART
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className={styles.addToCartModal}>
        <Modal
          isOpen={showSizeModal}
          title="Select Size"
          closeDialog={() => setShowSizeModal(false)}
          headerClassName={styles.customMHeader}
          bodyClassName={styles.customMBody}
          isCancellable={false}
        >
          <div>
            <div className={styles.guideCta}>
              <span style={{ width: "65%" }}>
                {selectedSize
                  ? `Style : Size (${selectedSize})`
                  : "SELECT SIZE"}
              </span>
              {isSizeGuideAvailable && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowSizeGuide(true);
                    }}
                    className={styles["product__size--guide"]}
                  >
                    <span>SIZE GUIDE</span>
                    <SvgWrapper svgSrc="scale" className={styles.scaleIcon} />
                  </button>
                </>
              )}
            </div>

            <div className={styles.sizes}>
              <ul>
                {sizes?.sizes?.map?.((size, index) => (
                  <li
                    key={index}
                    onClick={() => onSizeSelection(size)}
                    className={`${styles.product__size} ${selectedSize === size.display && styles["product__size--selected"]} ${size.quantity === 0 && styles["product__size--disabled"]}`}
                  >
                    {size.display.length < 15
                      ? size.display
                      : `${size.display.substring(0, 15)}...`}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.priceBlock}>
            <div className={styles.productPrice}>
              {getProductPrice("effective") &&
                pageConfig?.mrp_label &&
                getProductPrice("effective") === getProductPrice("marked") && (
                  <span className="mrp-label">MRP:</span>
                )}
              <h4 className={styles["productPrice--effective"]}>
                {getProductPrice("effective")}
              </h4>

              {getProductPrice("marked") &&
                pageConfig?.mrp_label &&
                getProductPrice("effective") !== getProductPrice("marked") && (
                  <>
                    <span className={styles.mrpLabel}>MRP:</span>
                    <span className={styles["productPrice--marked"]}>
                      {getProductPrice("marked")}
                    </span>
                  </>
                )}

              {productPriceBySlug?.discount && (
                <span className={styles["productPrice--discount"]}>
                  {productPriceBySlug?.discount}
                </span>
              )}
            </div>

            {pageConfig?.tax_label && (
              <div className={`${styles["caption-normal"]} ${styles.taxLabel}`}>
                {pageConfig?.tax_label}
              </div>
            )}
          </div>

          {selectedSize && <DeliveryInfo {...deliveryInfoProps} />}

          <button
            type="button"
            className={`${styles.btnSecondary} ${styles.button}`}
            onClick={addToCartHandler}
            disabled={!productMeta.sellable}
          >
            <SvgWrapper svgSrc="cart" className={styles.cartIcon} />
            ADD TO CART
          </button>
        </Modal>
        {isSizeGuideAvailable && (
          <SizeGuide
            customClass={styles.sizeGuide}
            isOpen={showSizeGuide}
            onCloseDialog={(e) => {
              e.preventDefault();
              setShowSizeGuide(false);
            }}
            productMeta={productMeta}
          />
        )}
      </div>
    </>
  );
};

export default StickyAddToCart;
