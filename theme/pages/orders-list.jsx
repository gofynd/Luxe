import React from "react";
import { motion } from "framer-motion";
import styles from "../styles/order-list.less";
import useOrdersListing from "../page-layouts/orders/useOrdersListing";
import OrdersHeader from "fdk-react-templates/components/order-header/order-header";
import "fdk-react-templates/components/order-header/order-header.css";
import OrderShipment from "fdk-react-templates/components/order-shipment/order-shipment";
import "fdk-react-templates/components/order-shipment/order-shipment.css";
import Loader from "../components/loader/loader";
import ProfileRoot from "../components/profile/profile-root";
import EmptyState from "../components/empty-state/empty-state";
import { isLoggedIn } from "../helper/auth-guard";
import { useGlobalTranslation } from "fdk-core/utils";

function OrdersList({ fpi }) {
  const { t } = useGlobalTranslation("translation");
  const { isLoading, orders, handelBuyAgain } = useOrdersListing(fpi);
  const orderShipments = orders;
  const getOrdersCount = () => {
    if (orderShipments?.page?.item_total) {
      return `${orderShipments.page.item_total} ${t("resource.order.list.orders_count_suffix")}`;
    } else {
      return "";
    }
  };

  return (
    <ProfileRoot fpi={fpi}>
      {isLoading ? (
        <Loader />
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
          initial="hidden"
          animate="visible"
          className="basePageContainer margin0auto"
        >
          {orderShipments?.items?.length !== 0 && (
            <OrdersHeader
              filters={orderShipments?.filters}
              title={t("resource.order.list.my_orders")}
              subtitle={getOrdersCount()}
              flag={false}
            ></OrdersHeader>
          )}

          {
            orderShipments?.items?.length === 0 && (
              <div className={`${styles.error}`}>
                <EmptyState title={t("resource.common.empty_state")}></EmptyState>
              </div>
            )
          }
          {
            orderShipments?.items?.length !== 0 && (
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
            )
          }
        </motion.div >
      )
      }
    </ProfileRoot >
  );
}

OrdersList.authGuard = isLoggedIn;
export const sections = JSON.stringify([]);

export default OrdersList;
