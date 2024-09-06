import React, { useState } from "react";
import styles from "./styles/payment-list.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function PaymentList({ payments, selectpayment }) {
  return (
    <div className={`${styles.paymentList}`}>
      {payments?.map((payment, index) => (
        <div key={index}>
          {payment?.items?.length > 0 && (
            <p
              className={`${styles.paymentListItem} ${styles.nohover} ${styles.noborder} ${styles.darkersm}`}
            >
              {payment?.display_name}
            </p>
          )}
          <ul>
            {payment?.items?.map((item, index) => (
              <li
                key={index}
                className={`${styles.paymentListItem}`}
                onClick={() => selectpayment(item.display_name)}
              >
                <div className={`${styles.paymentDetails}`}>
                  <img
                    className={`${styles.paymentLogo}`}
                    src={item?.logo_small}
                    alt=""
                  />
                  <span className={`${styles.darkerxs}`}>
                    {item?.display_name}
                  </span>
                </div>
                <SvgWrapper svgSrc="plus-black" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default PaymentList;
