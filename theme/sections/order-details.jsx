import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { BlockRenderer } from "fdk-core/components";
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

import styles from "../page-layouts/profile/styles/profile-my-order-shipment-page.less";
import useShipmentDetails from "../page-layouts/orders/useShipmentDetails";
import EmptyState from "../components/empty-state/empty-state";
import Loader from "../components/loader/loader";
import { useGlobalTranslation, useNavigate } from "fdk-core/utils";

export function Component({ blocks, fpi }) {
  const { t } = useGlobalTranslation("translation");
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
    return () => { };
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
      navigate(goToLink + (querParams?.toString() ? `?${querParams.toString()}` : ""));
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="basePageContainer">
          {!shipmentDetails && (
            <div className={`${styles.error}`}>
              <EmptyState
                title={t("resource.section.order.empty_state_title")}
                description={t(
                  "resource.section.order.empty_state_desc"
                )}
                btnLink="/profile/orders"
                btnTitle={t("resource.section.order.emptybtn_title")}
              ></EmptyState>
            </div>
          )}
          <div>
            {shipmentDetails && (
              <div className={`${styles.shipmentWrapper}`}>
                {blocks &&
                  blocks.map((block) => {
                    switch (block.type) {
                      case "order_header":
                        return (
                          <div className={`${styles.shipmentHeader}`}>
                            <div className="flexCenter">
                              <SvgWrapper svgSrc="order-delivery" />
                            </div>
                            <div className={styles.title}>
                              {shipmentDetails?.shipment_id}
                            </div>
                            {
                              shipmentDetails?.shipment_status && (
                                <div
                                  className={`${styles.status}`}
                                  style={{
                                    backgroundColor:
                                      shipmentDetails?.shipment_status.hex_code ||
                                      "green",
                                  }}
                                >
                                  {shipmentDetails?.shipment_status.title}
                                </div>
                              )
                            }
                          </div >
                        );

                      case "shipment_items":
                        return (
                          <>
                            <div className={`${styles.shipmentBagItem}`}>
                              {getSlicedGroupedShipmentBags()?.map(
                                (item, index) => (
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
                                      deliveryAddress={
                                        shipmentDetails?.delivery_address
                                      }
                                      selectId={selectId}
                                      type="my-orders"
                                    ></ShipmentItem>
                                  </div>
                                )
                              )}
                            </div>
                            {getBag()?.length > 2 && (
                              <div>
                                {!show && (
                                  <div
                                    className={`${styles.viewMore} `}
                                    onClick={showMore}
                                  >
                                    {`+ ${getBag().length - 2}${" "}${t("resource.facets.view_more")}`}
                                  </div>
                                )}
                                {show && (
                                  <div
                                    className={`${styles.showLess} `}
                                    onClick={showLess}
                                  >
                                    {t(
                                      "resource.facets.view_less"
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );

                      case "shipment_tracking":
                        return (
                          <>
                            {initial && (
                              <div className={`${styles.shipment}`}>
                                <ShipmentTracking
                                  tracking={shipmentDetails?.tracking_details}
                                  shipmentInfo={shipmentDetails}
                                  changeinit={toggelInit}
                                  invoiceDetails={invoiceDetails}
                                ></ShipmentTracking>
                              </div>
                            )}
                          </>
                        );

                      case "shipment_address":
                        return (
                          <>
                            {initial && (
                              <div className={`${styles.shipment}`}>
                                <ShipmentAddress
                                  address={shipmentDetails?.delivery_address}
                                ></ShipmentAddress>
                              </div>
                            )}
                          </>
                        );

                      case "payment_details_card":
                        return (
                          <>
                            {initial &&
                              shipmentDetails?.payment_info?.length > 0 && (
                                <div className={`${styles.shipment}`}>
                                  <PaymentDetailCard
                                    breakup={shipmentDetails?.breakup_values}
                                    paymentDetails={
                                      shipmentDetails?.payment_info
                                    }
                                  />
                                </div>
                              )}
                          </>
                        );

                      case "shipment_breakup":
                        return (
                          <>
                            {initial && (
                              <div className={`${styles.shipment}`}>
                                <ShipmentBreakup
                                  fpi={fpi}
                                  breakup={shipmentDetails?.breakup_values}
                                  shipmentInfo={shipmentDetails}
                                ></ShipmentBreakup>
                              </div>
                            )}
                          </>
                        );

                      case "extension-binding":
                        return <BlockRenderer block={block} />;

                      default:
                        return (
                          <h1>
                            {t("resource.common.invalid_block")}
                          </h1>
                        );
                    }
                  })}
              </div >
            )}
          </div >

          {!initial && (
            <div className={`${styles.btndiv}`}>
              <div className={`${styles.updateBtns}`}>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.cancelBtn}`}
                  onClick={() => setInitial(!initial)}
                >
                  {t("resource.facets.cancel")}
                </button>
                <button
                  type="button"
                  className={`${styles.commonBtn} ${styles.btn}`}
                  disabled={!btndisable}
                  onClick={goToReasons}
                >
                  {t("resource.common.continue")}
                </button>
              </div>
            </div>
          )}
        </div >
      )}
    </>
  );
}

export const settings = {
  label: "t:resource.sections.order_details.order_details",
  props: [],
  blocks: [
    {
      type: "order_header",
      name: "t:resource.sections.order_details.order_header",
      props: [],
    },
    {
      type: "shipment_items",
      name: "t:resource.sections.order_details.shipment_items",
      props: [],
    },
    {
      type: "shipment_tracking",
      name: "t:resource.sections.order_details.shipment_tracking",
      props: [],
    },
    {
      type: "shipment_address",
      name: "t:resource.sections.order_details.shipment_address",
      props: [],
    },
    {
      type: "payment_details_card",
      name: "t:resource.sections.order_details.payment_details_card",
      props: [],
    },
    {
      type: "shipment_breakup",
      name: "t:resource.sections.order_details.shipment_breakup",
      props: [],
    },
  ],
  preset: {
    blocks: [
      {
        name: "t:resource.sections.order_details.order_header",
      },
      {
        name: "t:resource.sections.order_details.shipment_items",
      },
      {
        name: "t:resource.sections.order_details.shipment_tracking",
      },
      {
        name: "t:resource.sections.order_details.shipment_address",
      },
      {
        name: "t:resource.sections.order_details.payment_details_card",
      },
      {
        name: "t:resource.sections.order_details.shipment_breakup",
      },
    ],
  },
};
export default Component;
