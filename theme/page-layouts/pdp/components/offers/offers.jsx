import React, { useState, useEffect } from "react";
import OutsideClickHandler from "react-outside-click-handler";

import MoreOffers from "./more-offers";
import styles from "./offers.less";
import { isRunningOnClient } from "../../../../helper/utils";

function Offers({ couponsList, promotionsList }) {
  const [showMoreOffers, setShowMoreOffers] = useState(false);
  const [sidebarActiveTab, setSidebarActiveTab] = useState("coupons");

  //   useEffect(() => {
  //     const fetchCoupons = async () => {
  //       try {
  //         const response = await apiSDK.cart.getCoupons({});
  //         setCouponsList(response?.available_coupon_list || []);
  //       } catch (ex) {
  //         console.error('Error while fetching coupons:', ex);
  //       }
  //     };

  //     const fetchPromotions = async () => {
  //       try {
  //         const response = await apiSDK.cart.getPromotionOffers({
  //           slug: context.product.slug,
  //         });
  //         setPromotionsList(response?.available_promotions || []);
  //       } catch (ex) {
  //         console.error('Error while fetching promotions:', ex);
  //       }
  //     };

  //     fetchCoupons();
  //     fetchPromotions();
  //   }, [apiSDK.cart, context.product.slug]);

  const openMoreOffersSidebar = (offerType) => {
    setSidebarActiveTab(offerType);
    setShowMoreOffers(true);
  };

  useEffect(() => {
    if (isRunningOnClient() && typeof document !== "undefined") {
      document.querySelector("body").style.overflow = showMoreOffers
        ? "hidden"
        : "auto";
    }
  }, [showMoreOffers]);

  return (
    <div className={styles.offersWrapper}>
      {(couponsList?.length > 0 || promotionsList?.length > 0) && (
        <div>
          <div className={styles.offersHeading}>
            <h5>BEST OFFERS</h5>
          </div>
          <div className={styles.offersDetails}>
            {couponsList.length > 0 && (
              <div className={styles.offersDetailsBlock}>
                {couponsList[0].coupon_code && (
                  <div
                    className={`${styles.sh4} ${styles.offersDetailsBlockCode}`}
                  >
                    {couponsList[0].coupon_code}
                  </div>
                )}
                {couponsList[0].title && (
                  <div
                    className={`${styles.b4} ${styles.offersDetailsBlockTitle}`}
                  >
                    {couponsList[0].title}
                  </div>
                )}
                <button
                  type="button"
                  className={`${styles.b5} ${styles.offersDetailsBlockViewAll}`}
                  onClick={() => openMoreOffersSidebar("coupons")}
                >
                  VIEW ALL
                </button>
              </div>
            )}

            {promotionsList.length > 0 && (
              <div className={`${styles.offersDetailsBlock} ${styles.mt16}`}>
                {promotionsList[0].promotion_name && (
                  <div
                    className={`${styles.sh4} ${styles.offersDetailsBlockCode}`}
                  >
                    {promotionsList[0].promotion_name}
                  </div>
                )}
                {promotionsList[0].offer_text && (
                  <div
                    className={`${styles.b4} ${styles.offersDetailsBlockTitle}`}
                  >
                    {promotionsList[0].offer_text}
                  </div>
                )}
                <button
                  type="button"
                  className={`${styles.b5} ${styles.offersDetailsBlockViewAll}`}
                  onClick={() => openMoreOffersSidebar("promotions")}
                >
                  VIEW ALL
                </button>
              </div>
            )}
          </div>
          <OutsideClickHandler onOutsideClick={() => setShowMoreOffers(false)}>
            <MoreOffers
              isOpen={showMoreOffers}
              onCloseDialog={() => setShowMoreOffers(false)}
              couponsList={couponsList}
              promotionsList={promotionsList}
              sidebarActiveTab={sidebarActiveTab}
            />
          </OutsideClickHandler>
        </div>
      )}
    </div>
  );
}

export default Offers;
