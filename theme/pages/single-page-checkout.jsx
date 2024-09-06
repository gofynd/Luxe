import React, { useEffect, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useNavigate, useSearchParams } from "react-router-dom";

import CheckoutPage from "fdk-react-templates/pages/checkout/checkout";
import "fdk-react-templates/pages/checkout/checkout.css";
// import PriceBreakup from "fdk-react-templates/components/price-breakup/price-breakup";
// import "fdk-react-templates/components/price-breakup/price-breakup.css";

import { CHECKOUT_LANDING, PAYMENT_OPTIONS } from "../queries/checkoutQuery";
import useAddress from "../page-layouts/single-checkout/address/useAddress";
import usePayment from "../page-layouts/single-checkout/payment/usePayment";
import Loader from "../components/loader/loader";

function SingleCheckoutPage({ fpi }) {
  const bagData = useGlobalStore(fpi?.getters?.CART_ITEMS) || {};
  const shipments = useGlobalStore(fpi.getters.SHIPMENTS) || {};
  const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  const APP_FEATURES = useGlobalStore(fpi.getters.APP_FEATURES);
  const breakupValues = bagData?.breakup_values?.display || [];
  const [showShipment, setShowShipment] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [mapApiKey, setMapApiKey] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const buy_now = searchParams.get("buy_now") || false;
  const address_id = searchParams.get("address_id");

  useEffect(() => {
    const payload = {
      buyNow: buy_now === "true",
      includeAllItems: true,
      includeBreakup: true,
      includeCodCharges: true,
    };
    fpi.executeGQL(CHECKOUT_LANDING, payload);
  }, [fpi]);

  useEffect(() => {
    if (
      INTEGRATION_TOKENS &&
      APP_FEATURES?.cart?.google_map &&
      INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key
    ) {
      setMapApiKey(
        Buffer?.from(
          INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key,
          "base64"
        )?.toString()
      );
    }
  }, [INTEGRATION_TOKENS, APP_FEATURES]);

  function showPaymentOptions() {
    const payload = {
      pincode: localStorage?.getItem("pincode") || "",
      cartId: cart_id,
      checkoutMode: "self",
      amount: (shipments?.breakup_values?.raw?.total || 0.1) * 100,
    };
    fpi.executeGQL(PAYMENT_OPTIONS, payload);
    setShowShipment(false);
    setShowPayment(true);
  }

  const address = useAddress(setShowShipment, setShowPayment, fpi);
  const payment = usePayment(fpi);

  useEffect(() => {
    if (address_id?.length && address?.allAddresses?.length) {
      address?.selectAddress();
    }
  }, []);

  return (
    <>
      <CheckoutPage
        fpi={fpi}
        breakupValues={breakupValues}
        cartItemsCount={bagData?.items?.length}
        address={address}
        payment={payment}
        showShipment={showShipment}
        showPayment={showPayment}
        setShowPayment={setShowPayment}
        setShowShipment={setShowShipment}
        shipments={shipments?.shipments || []}
        showPaymentOptions={() => {
          showPaymentOptions();
        }}
        // mapApiKey={"AIzaSyAVCJQAKy6UfgFqZUNABAuGQp2BkGLhAgI"}
        showGoogleMap={APP_FEATURES?.cart?.google_map || true}
        mapApiKey={mapApiKey}
        loader={<Loader />}
      />
      {/* <PriceBreakup breakUpValues={breakupValues}></PriceBreakup> */}
    </>
  );
}

export default SingleCheckoutPage;