import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import styles from "../styles/order-tracking-details.less";
import useShipmentDetails from "../page-layouts/orders/useShipmentDetails";
import useOrdersListing from "../page-layouts/orders/useOrdersListing";
import Loader from "../components/loader/loader";
import OrderShipment from "../components/orders/order-shipment";
import ShipmentItem from "../components/orders/shipment-item";
import ShipmentTracking from "../components/orders/shipment-tracking";
import ShipmentBreakup from "../components/orders/shipment-breakup";

function OrderTrackingDetails({ fpi }) {
  const { isLoading, orderShipments } = useOrdersListing(fpi);
  const { invoiceDetails } = useShipmentDetails(fpi);
  const params = useParams();
  const [image, setImage] = useState("/public/assets/pngs/inst_mob.png");
  const [orderId, setOrderId] = useState(params.orderId);
  const [showError, setShowError] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedShipmentBag, setSelectedShipmentBag] =
    useState(orderShipments);
  const navigate = useNavigate();

  const trackOrder = () => {
    if (orderId.length <= 10) {
      setShowError(true);
      return;
    }
    navigate(`/order-tracking/${orderId}`);
  };

  const toggelInit = (item) => {
    navigate(`/profile/orders/shipment/${selectedShipmentBag?.shipment_id}`);
  };
  useEffect(() => {
    setSelectedShipmentBag(orderShipments?.shipments?.[0]);

    return () => {};
  }, [orderShipments?.shipments]);

  const getBag = () => {
    return selectedShipmentBag?.bags;
  };
  const getSlicedGroupedShipmentBags = () => {
    return selectedShipmentBag?.bags?.slice(
      0,
      show ? selectedShipmentBag?.bags?.length : 1 * 2
    );
  };
  const showMore = () => {
    setShow(true);
  };
  const showLess = () => {
    setShow(false);
  };
  return (
    <div className="basePageContainer margin0auto">
      <div className={`${styles.orderDetails}`}>
        <div>
          <div className={`${styles.orderData}`}>
            <input
              type="text"
              className={`${styles.secondaryInput}`}
              value={orderId}
              placeholder="Enter Order ID"
              maxlength="20"
              onChange={(e) => setOrderId(e.target.value)}
            />
            <div className={`${styles.track}`} onClick={trackOrder}>
              <button type="button" className={`${styles.secondaryBtn}`}>
                Track Order
              </button>
            </div>
            {showError && (
              <div
                className={`${styles.error} ${styles.regularxxs} ${showError ? styles.visible : ""}`}
              >
                Invalid Order Id
              </div>
            )}
          </div>

          {isLoading ? (
            <Loader />
          ) : (
            <>
              {(Object.keys(orderShipments)?.length === 0 ||
                orderShipments?.shipments?.length === 0) && (
                <div className={`${styles.error}`}>
                  <span className={`${styles.bold}`}>No results found</span>
                  <FDKLink to="/" className={`${styles.continueShoppingBtn}`}>
                    RETURN TO HOMEPAGE
                  </FDKLink>
                </div>
              )}
              {Object.keys(orderShipments)?.length !== 0 &&
                orderShipments?.shipments?.length !== 0 && (
                  <div className={`${styles.orderShipments}`}>
                    <OrderShipment
                      orderInfo={orderShipments}
                      isBuyAgainEligible={false}
                    ></OrderShipment>
                    <div className={`${styles.shipmentDetails}`}>
                      <div className={`${styles.shipmentBagItem}`}>
                        {getSlicedGroupedShipmentBags()?.map((item, index) => (
                          <div
                            style={{
                              display: "flex",
                              flex: "0 1 50%",
                              borderBottom: "1px solid #eeeeee",
                            }}
                            className={
                              !(
                                selectedShipmentBag.can_cancel ||
                                selectedShipmentBag.can_return
                              )
                                ? `${styles.updateDisable}`
                                : ""
                            }
                          >
                            <ShipmentItem
                              key={item.item.brand.name + index}
                              bag={item}
                              shipment={{
                                traking_no: selectedShipmentBag?.traking_no,
                                track_url: selectedShipmentBag?.track_url,
                              }}
                              type="tracking"
                            ></ShipmentItem>
                          </div>
                        ))}
                      </div>
                      {getBag() && getBag().length > 2 && (
                        <div>
                          {!show && (
                            <div
                              className={`${styles.view}`}
                              onClick={showMore}
                            >
                              +{getBag().length - 2}
                              view more
                            </div>
                          )}
                          {show && (
                            <div
                              className={`${styles.view}`}
                              onClick={showLess}
                            >
                              view less
                            </div>
                          )}
                        </div>
                      )}
                      <div className={`${styles.shipment}`}>
                        <ShipmentTracking
                          tracking={selectedShipmentBag?.tracking_details}
                          shipmentInfo={selectedShipmentBag}
                          changeinit={toggelInit}
                          invoiceDetails={invoiceDetails}
                        ></ShipmentTracking>
                      </div>
                      <div className={`${styles.shipment}`}>
                        <ShipmentBreakup
                          fpi={fpi}
                          type="tracking"
                          breakup={selectedShipmentBag?.breakup_values}
                          shipmentInfo={selectedShipmentBag}
                        ></ShipmentBreakup>
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTrackingDetails;
