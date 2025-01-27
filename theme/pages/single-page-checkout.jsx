import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useSearchParams } from "react-router-dom";
import CheckoutPage from "@gofynd/theme-template/pages/checkout/checkout";
import "@gofynd/theme-template/pages/checkout/checkout.css";
// import PriceBreakup from "@gofynd/theme-template/components/price-breakup/price-breakup";
// import "@gofynd/theme-template/components/price-breakup/price-breakup.css";

import { CHECKOUT_LANDING, PAYMENT_OPTIONS } from "../queries/checkoutQuery";
import { useHyperlocalTat } from "../helper/hooks";
import useAddress from "../page-layouts/single-checkout/address/useAddress";
import usePayment from "../page-layouts/single-checkout/payment/usePayment";
import Loader from "../components/loader/loader";
import useCartCoupon from "../page-layouts/cart/useCartCoupon";
import useCartComment from "../page-layouts/cart/useCartComment";

function SingleCheckoutPage({ fpi }) {
  const bagData = useGlobalStore(fpi?.getters?.CART_ITEMS) || {};
  const shipments = useGlobalStore(fpi.getters.SHIPMENTS) || {};
  const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  const APP_FEATURES = useGlobalStore(fpi.getters.APP_FEATURES);
  const breakupValues = bagData?.breakup_values?.display || [];
  const [showShipment, setShowShipment] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [mapApiKey, setMapApiKey] = useState("");
  const { isHyperlocal, convertUTCToHyperlocalTat } = useHyperlocalTat({ fpi });
  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const buy_now = searchParams.get("buy_now") || false;
  const address_id = searchParams.get("address_id");
  const cartCoupon = useCartCoupon({ fpi, cartData: bagData });
  const cartComment = useCartComment({ fpi, cartData: bagData });

  const currencySymbol = useMemo(
    () => bagData?.currency?.symbol || "₹",
    [bagData]
  );

  const executeCheckoutLanding = useCallback(
    (reqBody = {}) => {
      const payload = {
        buyNow: false,
        includeAllItems: true,
        includeBreakup: true,
        includeCodCharges: true,
        ...reqBody,
      };
      fpi.executeGQL(CHECKOUT_LANDING, payload);
    },
    [fpi]
  );

  useEffect(() => {
    executeCheckoutLanding({ buyNow: buy_now === "true" });
    return () => {
      if (buy_now === "true") executeCheckoutLanding();
    };
  }, [executeCheckoutLanding, buy_now]);

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
        currencySymbol={currencySymbol}
        address={address}
        payment={payment}
        showShipment={showShipment}
        showPayment={showPayment}
        cartCouponProps={{
          ...cartCoupon,
        }}
        cartCommentProps={cartComment}
        setShowPayment={setShowPayment}
        setShowShipment={setShowShipment}
        shipments={shipments?.shipments || []}
        showPaymentOptions={() => {
          showPaymentOptions();
        }}
        // mapApiKey={"AIzaSyAVCJQAKy6UfgFqZUNABAuGQp2BkGLhAgI"}
        showGoogleMap={APP_FEATURES?.cart?.google_map}
        mapApiKey={mapApiKey}
        isHyperlocal={isHyperlocal}
        convertHyperlocalTat={convertUTCToHyperlocalTat}
        loader={<Loader />}
      />
      {/* <PriceBreakup breakUpValues={breakupValues}></PriceBreakup> */}
    </>
  );
}

export const sections = JSON.stringify([]);

export default SingleCheckoutPage;
