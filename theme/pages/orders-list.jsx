import React, { useCallback, useEffect, useState } from "react";
import { FDKLink } from "fdk-core/components";
import styles from "../styles/order-list.less";
import useOrdersListing from "../page-layouts/orders/useOrdersListing";
import OrdersHeader from "../components/orders/order-header";
import ProfileRoot from "../components/profile/profile-root";
import OrderShipment from "../components/orders/order-shipment";
import Loader from "../components/loader/loader";

function OrdersList({ fpi }) {
  const { isLoading, orders, handelBuyAgain } = useOrdersListing(fpi);
  const orderShipments = orders;
  const getOrdersCount = () => {
    if (orderShipments?.page?.item_total) {
      return `${orderShipments.page.item_total} Orders`;
    } else {
      return `0 Order`;
    }
  };

  return (
    <ProfileRoot fpi={fpi}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${styles.basePageContainer} ${styles.margin0auto}`}>
          <OrdersHeader
            filters={orderShipments?.filters}
            title="My Orders"
            subtitle={getOrdersCount()}
            flag={false}
          ></OrdersHeader>
          {orderShipments?.items?.length === 0 && (
            <div className={`${styles.error}`}>
              <span className={`${styles.bold}`}>No results found</span>
              <FDKLink to="/" className={`${styles.continueShoppingBtn}`}>
                RETURN TO HOMEPAGE
              </FDKLink>
            </div>
          )}

          <div className={`${styles.myOrders}`}>
            {orderShipments?.items?.map((item, index) => (
              <OrderShipment
                key={index}
                orderInfo={item}
                onBuyAgainClick={handelBuyAgain}
                isBuyAgainEligible={true}
              ></OrderShipment>
            ))}
          </div>
        </div>
      )}
    </ProfileRoot>
  );
}

export default OrdersList;
