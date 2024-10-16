import { useState, useEffect } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useSearchParams } from "react-router-dom";

import {
  PAYMENT_AGG,
  SELECT_PAYMENT_MODE,
} from "../../../queries/checkoutQuery";
import { numberWithCommas } from "../../../helper/utils";

const usePayment = (fpi) => {
  const paymentOption = useGlobalStore(fpi?.getters?.PAYMENT_OPTIONS);
  const paymentConfig = useGlobalStore(fpi?.getters?.AGGREGATORS_CONFIG);
  const bagData = useGlobalStore(fpi?.getters?.CART_ITEMS);
  const loggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const [selectedTab, setSelectedTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");

  const PAYMENT_OPTIONS_SVG = {
    CARD: "card-payment",
    WL: "wallet",
    UPI: "upi",
    NB: "nb",
    CARDLESS_EMI: "emi",
    PL: "pay-later",
    COD: "cod",
  };

  useEffect(() => {
    fpi.executeGQL(PAYMENT_AGG);
  }, [fpi]);

  const getCurrencySymbol = (() => bagData?.currency?.symbol || "₹")();

  function getQueryParams() {
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return queryParams;
  }

  const selectedTabData = paymentOption?.payment_option?.find(
    (optn) => optn.name === selectedTab
  );

  const selectedUPIData = paymentOption?.payment_option?.filter(
    (optn) => optn.name === "UPI"
  )[0]?.list[0];

  const selectedNewCardData = paymentOption?.payment_option?.find(
    (optn) => optn.name === "CARD"
  );

  function addParamsToLocation(params) {
    // Get the current URL
    const currentUrl = window?.location?.href;
    // Remove the query parameters
    const urlWithoutQueryParams = currentUrl.split("?")[0];
    window?.history.pushState(
      {},
      null,
      `${urlWithoutQueryParams}?${Object.keys(params)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
        )
        .join("&")}`
    );
  }

  function orderBy(collection, iterates, orders) {
    if (!Array.isArray(collection) || collection.length === 0) {
      return [];
    }
    return [...collection].sort((a, b) => {
      for (let i = 0; i < iterates.length; i += 1) {
        const iteratee = iterates[i];
        const order = orders && orders[i] === "desc" ? -1 : 1;

        const aValue =
          typeof iteratee === "function" ? iteratee(a) : a?.[iteratee];
        const bValue =
          typeof iteratee === "function" ? iteratee(b) : b?.[iteratee];

        if (aValue < bValue) {
          return -1 * order;
        }
        if (aValue > bValue) {
          return 1 * order;
        }
      }

      return 0;
    });
  }

  const proceedToPay = async (mode, paymentPayload = {}) => {
    const {
      selectedCard,
      selectedCardData,
      isCardSecure,
      selectedCardless,
      selectedPayLater,
      selectedWallet,
      selectedOtherNB,
      selectedNB,
      vpa,
      selectedOtherPayment,
    } = paymentPayload;
    // Implement the logic to proceed with the payment
    if (mode === "newCARD") {
      // if (!isCardSecure) {
      //     openRbiGuidelineDialog = true;
      //     return;
      // }
      const payload = {
        aggregator_name: selectedNewCardData.aggregator_name,
        payment_mode: "CARD",
        id: cart_id,
      };
      setIsLoading(true);

      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedNewCardData.aggregator_name,
            payment_mode: "CARD",
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            ...options,
            queryParams: getQueryParams(),
            payment: {
              ...selectedNewCardData,
              ...selectedCardData,
              is_card_secure: isCardSecure,
            },
            address_id,
            billing_address_id: address_id,
            paymentflow:
              paymentOption?.payment_flows[
                selectedNewCardData.aggregator_name.toLowerCase()
              ],
          });
        });
    } else if (mode === "CARD") {
      if (
        !selectedCard.compliant_with_tokenisation_guidelines
        //  &&!isSavedCardSecure
      ) {
        // openRbiGuidelineDialog = true;
        // return;
      }

      const payload = {
        aggregator_name: selectedCard.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedCard.card_id,
        id: cart_id,
      };
      setIsLoading(true);
      // const confirmedPayment = fpi.payment.confirmPayment(payload);
      addParamsToLocation({
        ...getQueryParams(),
        aggregator_name: selectedCard.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedCard.card_id,
        card_reference: selectedCard.card_reference,
      });
      const { id, is_redirection, ...options } = payload;
      fpi.payment.checkoutPayment({
        ...options,
        payment: {
          ...selectedCard,
          // card_security_code: selectedCardCVV,
          is_card_secure: selectedCard.compliant_with_tokenisation_guidelines,

          // : isSavedCardSecure,
        },
        address_id,
        billing_address_id: address_id,
        paymentflow:
          paymentOption?.payment_flows[
            selectedCard.aggregator_name.toLowerCase()
          ],
      });
    } else if (mode === "WL") {
      const payload = {
        aggregator_name: selectedWallet.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedWallet.code,
        merchant_code: selectedWallet.merchant_code,
        id: cart_id,
      };
      setIsLoading(true);
      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedWallet.aggregator_name,
            payment_mode: mode,
            payment_identifier: selectedWallet.code,
            merchant_code: selectedWallet.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            ...options,
            payment: selectedWallet,
            address_id,
            billing_address_id: address_id,
            paymentflow:
              paymentOption?.payment_flows[selectedWallet.aggregator_name],
          });
        });
    } else if (mode === "UPI") {
      const payload = {
        aggregator_name: selectedUPIData.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedUPIData.code,
        merchant_code: selectedUPIData.merchant_code,
        id: cart_id,
      };
      setIsLoading(true);
      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedUPIData.aggregator_name,
            payment_mode: mode,
            payment_identifier: vpa,
            merchant_code: selectedUPIData.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            ...options,
            payment_identifier: vpa,
            payment: {
              ...selectedUPIData,
              upi: vpa,
            },
            address_id,
            billing_address_id: address_id,
            paymentflow:
              paymentOption?.payment_flows[selectedUPIData.aggregator_name],
          });
        });
    } else if (mode === "NB") {
      const payload = {
        aggregator_name:
          selectedNB === "otherNB"
            ? selectedOtherNB.aggregator_name
            : selectedNB.aggregator_name,
        payment_mode: mode,
        payment_identifier:
          selectedNB === "otherNB" ? selectedOtherNB.code : selectedNB.code,
        merchant_code:
          selectedNB === "otherNB"
            ? selectedOtherNB.merchant_code
            : selectedNB.merchant_code,
        id: cart_id,
      };
      setIsLoading(true);
      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          // if (res?.selectPaymentMode?.is_valid) {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name:
              selectedNB === "otherNB"
                ? selectedOtherNB.aggregator_name
                : selectedNB.aggregator_name,
            payment_mode: mode,
            payment_identifier:
              selectedNB === "otherNB" ? selectedOtherNB.code : selectedNB.code,
            merchant_code:
              selectedNB === "otherNB"
                ? selectedOtherNB.merchant_code
                : selectedNB.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            ...options,
            queryParams: getQueryParams(),
            payment: selectedNB === "otherNB" ? selectedOtherNB : selectedNB,
            address_id,
            billing_address_id: address_id,
            paymentflow: paymentOption?.payment_flows[options.aggregator_name],
          });
          // }
        });
    } else if (mode === "COD") {
      const payload = {
        aggregator_name: selectedTabData.aggregator_name,
        payment_mode: mode,
        // payment_identifier: "" + selectedTabData.payment_mode_id,
        id: cart_id,
      };

      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then((res) => {
          if (res?.data?.selectPaymentMode?.is_valid) {
            addParamsToLocation({
              ...getQueryParams(),
              aggregator_name: selectedTabData.aggregator_name,
              payment_mode: mode,
              payment_identifier: `${selectedTabData?.payment_mode_id}`,
            });
            const { id, is_redirection, ...options } = payload;
            fpi.payment.checkoutPayment({
              ...options,
              queryParams: getQueryParams(),
              payment: selectedTabData,
              address_id,
              billing_address_id: address_id,
              paymentflow:
                paymentOption?.payment_flows[selectedTabData.aggregator_name],
            });
          }
        });
    } else if (mode === "PL") {
      const payload = {
        aggregator_name: selectedPayLater.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedPayLater.code,
        merchant_code: selectedPayLater.merchant_code,
        id: cart_id,
      };
      setIsLoading(true);

      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedPayLater.aggregator_name,
            payment_mode: mode,
            payment_identifier: selectedPayLater.code,
            merchant_code: selectedPayLater.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            ...options,
            queryParams: getQueryParams(),
            payment: selectedPayLater,
            address_id,
            billing_address_id: address_id,
            paymentflow:
              paymentOption?.payment_flows[
                selectedPayLater.aggregator_name.toLowerCase()
              ],
          });
        });
    } else if (mode === "CARDLESS_EMI") {
      const payload = {
        aggregator_name: selectedCardless.aggregator_name,
        payment_mode: mode,
        payment_identifier: selectedCardless.code,
        merchant_code: selectedCardless.merchant_code,
        id: cart_id,
      };
      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedCardless.aggregator_name,
            payment_mode: mode,
            payment_identifier: selectedCardless.code,
            merchant_code: selectedCardless.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment.checkoutPayment({
            queryParams: getQueryParams(),
            ...options,
            payment: selectedCardless,
            address_id,
            billing_address_id: address_id,
            paymentflow:
              paymentOption?.payment_flows[selectedCardless.aggregator_name],
          });
        });
    } else if (mode === "Other") {
      const payload = {
        aggregator_name: selectedOtherPayment.aggregator_name,
        payment_mode: selectedOtherPayment.code,
        payment_identifier: selectedOtherPayment.code,
        merchant_code: selectedOtherPayment.merchant_code,
        id: cart_id,
      };
      await fpi
        .executeGQL(SELECT_PAYMENT_MODE, {
          updateCartPaymentRequestInput: payload,
        })
        .then(() => {
          addParamsToLocation({
            ...getQueryParams(),
            aggregator_name: selectedOtherPayment.aggregator_name,
            payment_mode: selectedOtherPayment.code,
            payment_identifier: selectedOtherPayment.code,
            merchant_code: selectedOtherPayment.merchant_code,
          });
          const { id, is_redirection, ...options } = payload;
          fpi.payment
            .checkoutPayment({
              ...options,
              payment: selectedOtherPayment,
              address_id,
              billing_address_id: address_id,
              paymentflow:
                paymentOption?.payment_flows[
                  selectedOtherPayment.aggregator_name?.toLowerCase()
                ],
            })
            .then((res) => {
              if (res?.error?.message) {
                console.log(
                  res,
                  "response while calling fpi.payment.checkoutPayment"
                );
              }
            });
        });
    }
  };

  const getTotalValue = () => {
    // Implement the logic to calculate the total value

    const totalObj = bagData?.breakup_values?.display?.find(
      (item) => item.key === "total"
    );
    return numberWithCommas(totalObj?.value);
  };

  const PaymentOptionsList = () => {
    const tempOpt = [];
    const orderedOptions = orderBy(
      paymentOption?.payment_option,
      "display_priority",
      "asc"
    );

    orderedOptions?.forEach((optn) => {
      const data = PAYMENT_OPTIONS_SVG[optn.name];
      if (data) {
        tempOpt.push({
          display_name: optn.display_name,
          svg: data,
          name: optn.name,
        });
      } else {
        tempOpt.push({
          display_name: optn.display_name,
          svg: "payment-other",
          name: optn.name,
        });
      }
    });

    return tempOpt;
  };

  return {
    selectedTab,
    getCurrencySymbol,
    selectedTabData,
    paymentConfig,
    paymentOption,
    isLoading,
    loggedIn,
    proceedToPay,
    getTotalValue,
    PaymentOptionsList,
    setSelectedTab,
  };
};

export default usePayment;
