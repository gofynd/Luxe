import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OrdersHeader from "fdk-react-templates/components/order-header/order-header";
import "fdk-react-templates/components/order-header/order-header.css";
import ShipmentItem from "fdk-react-templates/components/shipment-item/shipment-item";
import "fdk-react-templates/components/shipment-item/shipment-item.css";
import ShipmentTracking from "fdk-react-templates/components/shipment-tracking/shipment-tracking";
import "fdk-react-templates/components/shipment-tracking/shipment-tracking.css";
import ShipmentBreakup from "fdk-react-templates/components/shipment-breakup/shipment-breakup";
import "fdk-react-templates/components/shipment-breakup/shipment-breakup.css";
import ShipmentAddress from "fdk-react-templates/components/shipment-address/shipment-address";
import "fdk-react-templates/components/shipment-address/shipment-address.css";
import PaymentDetailCard from "fdk-react-templates/components/payment-detail-card/payment-detail-card";
import "fdk-react-templates/components/payment-detail-card/payment-detail-card.css";
import styles from "./styles/profile-my-order-shipment-page.less";
import useShipmentDetails from "../orders/useShipmentDetails";
import Loader from "../../components/loader/loader";
import EmptyState from "../../components/empty-state/empty-state";
import ProfileRoot from "../../components/profile/profile-root";

function ProfileMyOrderShipmentPage({ fpi }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, shipmentDetails, invoiceDetails, getInvoice } =
    useShipmentDetails(fpi);
  const [initial, setInitial] = useState(true);
  const [show, setShow] = useState(false);
  const [selectId, setSelectId] = useState("");
  const [goToLink, setGoToLink] = useState("");

  useEffect(() => {
    if (shipmentDetails?.shipment_id) {
      getInvoice({
        shipmentId: shipmentDetails?.shipment_id,
      });
    }
    return () => {};
  }, [shipmentDetails?.shipment_id]);

  const getBag = () => {
    return shipmentDetails?.bags;
  };
  const getSlicedGroupedShipmentBags = () => {
    return shipmentDetails?.bags?.slice(
      0,
      show ? shipmentDetails?.bags?.length : 1 * 2
    );
  };
  const toggelInit = (item) => {
    setInitial(!initial);
    setGoToLink(item.link);
  };
  const goToReasons = () => {
    if (shipmentDetails?.can_cancel || shipmentDetails?.can_return) {
      const querParams = new URLSearchParams(location.search);
      querParams.set("selectedBagId", selectId);
      navigate({
        pathname: goToLink,
        search: querParams.toString(),
      });
    }
  };
  const onselectreason = (id) => {
    setSelectId(id);
  };
  const btndisable = useMemo(() => {
    return !!selectId;
  }, [selectId]);
  const showMore = () => {
    setShow(true);
  };
  const showLess = () => {
    setShow(false);
  };

  return (
    <ProfileRoot fpi={fpi}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={`${styles.basePageContainer}`}>
          {!shipmentDetails && (
            <div className={`${styles.error}`}>
              <EmptyState></EmptyState>
            </div>
          )}
          <div>
            {shipmentDetails && (
              <div className={`${styles.shipmentWrapper}`}>
                <div className={`${styles.shipmentHeader}`}>
                  <img
                    src="https://img.icons8.com/ios/50/000000/delivery--v2.png"
                    alt="icons"
                  />
                  <OrdersHeader
                    title={shipmentDetails?.shipment_id}
                  ></OrdersHeader>
                  {shipmentDetails?.shipment_status && (
                    <div
                      className={`${styles.status}`}
                      style={{
                        backgroundColor:
                          shipmentDetails?.shipment_status.hex_code || "green",
                      }}
                    >
                      {shipmentDetails?.shipment_status.title}
                    </div>
                  )}
                </div>
                <div className={`${styles.shipmentBagItem}`}>
                  {getSlicedGroupedShipmentBags()?.map((item, index) => (
                    <div
                      key={item.item.brand.name + index}
                      className={
                        !(item.can_cancel || item.can_return)
                          ? `${styles.updateDisable}`
                          : ""
                      }
                    >
                      <ShipmentItem
                        key={item.item.brand.name + index}
                        bag={item}
                        initial={initial}
                        onChangeValue={onselectreason}
                        shipment={{
                          traking_no: shipmentDetails?.traking_no,
                          track_url: shipmentDetails?.track_url,
                        }}
                        deliveryAddress={shipmentDetails?.delivery_address}
                        selectId={selectId}
                        type="my-orders"
                      ></ShipmentItem>
                    </div>
                  ))}
                </div>
                {getBag()?.length > 2 && (
                  <div>
                    {!show && (
                      <div className={`${styles.viewMore} `} onClick={showMore}>
                        {`+ ${getBag().length - 2} view more`}
                      </div>
                    )}
                    {show && (
                      <div className={`${styles.showLess} `} onClick={showLess}>
                        view less
                      </div>
                    )}
                  </div>
                )}
                {initial && (
                  <>
                    <div className={`${styles.shipment}`}>
                      <ShipmentTracking
                        tracking={shipmentDetails?.tracking_details}
                        shipmentInfo={shipmentDetails}
                        changeinit={toggelInit}
                        invoiceDetails={invoiceDetails}
                      ></ShipmentTracking>
                    </div>
                    <div className={`${styles.shipment}`}>
                      <ShipmentAddress
                        address={shipmentDetails?.delivery_address}
                      ></ShipmentAddress>
                    </div>
                    {shipmentDetails?.payment && (
                      <div className={`${styles.shipment}`}>
                        <PaymentDetailCard
                          breakup={shipmentDetails?.breakup_values}
                          paymentInfo={shipmentDetails?.payment}
                        ></PaymentDetailCard>
                      </div>
                    )}
                    <div className={`${styles.shipment}`}>
                      <ShipmentBreakup
                        fpi={fpi}
                        breakup={shipmentDetails?.breakup_values}
                        shipmentInfo={shipmentDetails}
                      ></ShipmentBreakup>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {!initial && (
            <div className={`${styles.btndiv}`}>
              <div className={`${styles.updateBtns}`}>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.cancelBtn}`}
                  onClick={() => setInitial(!initial)}
                >
                  cancel
                </button>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.btn}`}
                  disabled={!btndisable}
                  onClick={goToReasons}
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </ProfileRoot>
  );
}

export default ProfileMyOrderShipmentPage;
