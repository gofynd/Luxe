import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FDKLink } from "fdk-core/components";

import OrderStatusPage from "fdk-react-templates/pages/order-status/order-status";
import { useLoggedInUser } from "../helper/hooks";
import empty from "../assets/images/empty_state.png";
import { ORDER_BY_ID } from "../queries/checkoutQuery";

import "fdk-react-templates/pages/order-status/order-status.css";
import Loader from "../components/loader/loader";

function OrderPolling({ isLoggedIn }) {
  return (
    <>
      <h3
        style={{ color: "var(--textHeading)", marginTop: "20%" }}
        className="h2 fontBody"
      >
        Sorry Its Taking Longer. We will notify you once the order is processed.
        You can also check
        {isLoggedIn ? " My Orders" : " Track Order"} in sometime to track the
        order.
      </h3>
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <FDKLink
          to="/"
          className="btnPrimary fontBody"
          style={{ padding: "10px 20px" }}
        >
          RETURN TO HOMEPAGE
        </FDKLink>
      </div>
    </>
  );
}

function OrderStatus({ fpi }) {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("order_id");
  const [orderData, setOrderData] = useState(null);
  const { loggedIn: isloggedIn } = useLoggedInUser(fpi);
  const [attempts, setAttempts] = useState(0);
  const [showPolling, setShowPolling] = useState(false);
  const navigate = useNavigate();

  const fetchOrder = useCallback(() => {
    setTimeout(() => {
      fpi.executeGQL(ORDER_BY_ID, { orderId }).then((res) => {
        if (res?.data?.order !== null && orderData === null) {
          setOrderData(res?.data?.order);
          setShowPolling(false);
        } else {
          setAttempts((prev) => prev + 1);
        }
      });
    }, 2000);
  }, [orderId, orderData]);

  useEffect(() => {
    if (attempts < 5 && orderData === null) {
      fetchOrder();
    } else if (attempts >= 5) {
      setShowPolling(true);
      // navigate("/cart/order-status?success=false");
    }
  }, [attempts, fetchOrder, navigate, orderData]);

  return (
    <div className="basePageContainer margin0auto">
      <OrderStatusPage
        success={success}
        orderData={orderData}
        isLoggedIn={isloggedIn}
        orderFailImg={empty}
        showPolling={showPolling}
        pollingComp={<OrderPolling isLoggedIn={isloggedIn} />}
        onOrderFailure={() => navigate("/cart/bag")}
        loader={<Loader />}
      />
    </div>
  );
}

export default OrderStatus;
