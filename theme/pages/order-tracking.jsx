import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "../styles/order-tracking.less";
import instMob from "../assets/images/inst_mob.png";

function OrderTracking({ fpi }) {
  const [showDetails, setShowDetails] = useState(false);
  const [image, setImage] = useState("/public/assets/pngs/inst_mob.png");
  const [orderId, setOrderId] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  const trackOrder = () => {
    if (orderId.length <= 10) {
      setShowError(true);
      return;
    }
    navigate(`/order-tracking/${orderId}`);
  };
  return (
    <div className="basePageContainer margin0auto">
      <div className={`${styles.trackOrderCntr}`}>
        <div className={`${styles.trackOrder}`}>
          <div className={`${styles.orderTitle}`}>Where is my order?</div>
          <div
            className={`${styles.error} ${styles.regularxxs} ${showError ? styles.visible : ""} `}
          >
            Invalid Order Id
          </div>
          <div className={`${styles.orderId}`}>
            <input
              type="text"
              className={`${styles.commonInput}`}
              value={orderId}
              placeholder="Enter Order ID"
              maxlength="20"
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <div className={`${styles.trackBtn}`}>
            <button
              type="button"
              className={`${styles.commonBtn}`}
              onClick={trackOrder}
            >
              TRACK ORDER
            </button>
          </div>
          <div
            className={`${styles.details} ${styles.regularxxs}`}
            onClick={() => setShowDetails(!showDetails)}
          >
            Where is Order Id?
          </div>
          {showDetails && (
            <div>
              <img src={instMob} alt={image} className={`${styles.demoImg}`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
