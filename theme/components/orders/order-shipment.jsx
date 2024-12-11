import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./styles/order-shipment.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function OrderShipment({
  orderInfo,
  onBuyAgainClick = () => {},
  isBuyAgainEligible,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const convertUTCDateToLocalDate = (date, format) => {
    if (!format) {
      format = {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
    }
    const utcDate = new Date(date);
    // Convert the UTC date to the local date using toLocaleString() with specific time zone
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const options = {
      ...format,
      timeZone: browserTimezone,
    };
    // Convert the UTC date and time to the desired format
    const formattedDate = utcDate
      .toLocaleString("en-US", options)
      .replace(" at ", ", ");
    return formattedDate;
  };

  const getTime = (time) => {
    return convertUTCDateToLocalDate(time);
  };
  const clickopen = () => {
    setIsOpen(!isOpen);
  };
  const naivgateToShipment = (item) => {
    let link = "";
    if (isBuyAgainEligible) {
      link = `/profile/orders/shipment/${item.shipment_id}`;
    } else {
      link = `/order-tracking/${item.order_id}/${item.shipment_id}`;
    }
    navigate(link);
  };
  const getProductsName = (bags) => {
    let items = bags.map((it) => {
      return it.item;
    });
    items = items.filter(Boolean);

    if (items && items.length) {
      const productNames = items.map((it) => {
        return it.name;
      });

      return [...new Set(productNames)];
    }
    return [];
  };
  const getTotalItems = (items) => {
    return items === 1 ? `${items} Item` : `${items} Items`;
  };
  const getTotalPieces = (pieces) => {
    const total = pieces.reduce((pre, curr) => {
      return pre + curr.quantity;
    }, 0);

    return total === 1 ? `${total} Piece` : `${total} Pieces`;
  };

  return (
    <div className={`${styles.orderItem}`} key={orderInfo.order_id}>
      <div className={`${styles.orderHeader}`} onClick={clickopen}>
        <span className={`${styles.filter} `}>
          <SvgWrapper
            className={`${isOpen ? styles.filterArrowUp : styles.filterArrowdown}`}
            svgSrc="arrowDropdownBlack"
          />
        </span>
        <h3 className={`${styles.bold}`}>{orderInfo.order_id}</h3>
        <h4 className={`${styles.light}`}>
          {getTime(orderInfo.order_created_time)}
        </h4>
      </div>
      {isOpen && (
        <div>
          {orderInfo?.shipments?.map((item, index) => {
            return (
              <div
                className={`${styles.shipmentData}`}
                key={`${item.shipment_id}`}
              >
                <div onClick={() => naivgateToShipment(item)}>
                  <div className={`${styles.shipmentLeft}`}>
                    <img
                      className={`${isOpen ? styles.filterArrowUp : styles.filterArrowdown}`}
                      src={item?.bags?.[0]?.item?.image?.[0]}
                      alt={item?.shipment_images?.[0]}
                    />
                    {item?.bags?.length > 1 && (
                      <div id="total-item">
                        + {(item?.bags?.length || 0) - 1 || 0}
                        more
                      </div>
                    )}
                  </div>
                  <div className={`${styles.shipmentRight}`}>
                    <div className={`${styles.uktLinks}`}>
                      {item?.bags?.length > 1 ? (
                        <div>
                          {getProductsName(item?.bags)?.[0]} +
                          {item.bags.length - 1}
                          more
                        </div>
                      ) : (
                        <div>{getProductsName(item?.bags)?.[0]}</div>
                      )}
                    </div>
                    <div
                      className={`${styles.shipmentId} ${styles.boldls} ${styles.uktLinks}`}
                    >
                      Shipment: {item?.shipment_id}
                    </div>
                    <div className={`${styles.shipmentStats} ${styles.light}`}>
                      <span>{getTotalItems(item?.bags?.length)}</span>
                      <span>{` | `}</span>
                      <span>{getTotalPieces(item?.bags)}</span>
                    </div>
                    <div
                      className={`${styles.status} ${styles.regular}`}
                      style={{
                        backgroundColor:
                          item.shipment_status.hex_code || "green",
                      }}
                    >
                      {item?.shipment_status?.title}
                    </div>
                    {isAdmin && (
                      <div className={`${styles.shipmentBrands}`}>
                        <span className={`${styles.bold}`}>Brand</span> :
                        {item?.brand_name}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isBuyAgainEligible && (
            <div className={`${styles.buttons}`}>
              <button
                type="button"
                className={`${styles.ordercheckout}`}
                onClick={() => onBuyAgainClick(orderInfo)}
              >
                <SvgWrapper
                  className={`${styles.reorderIcon}`}
                  svgSrc="re-order"
                />
                BUY AGAIN
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderShipment;
