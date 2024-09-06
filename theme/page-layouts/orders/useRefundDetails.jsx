import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GET_REFUND_DETAILS,
  GET_ACTVE_REFUND_MODE,
  VERIFY_IFSC_CODE,
  ADD_BENEFICIARY_DETAILS,
  VERIFY_OTP_FOR_WALLET,
  VERIFY_OTP_FOR_BANK,
} from "../../queries/refundQuery";

const useRefundDetails = (fpi) => {
  const location = useLocation();
  const [refundDetails, setRefundDetails] = useState({});
  const [activeRefundMode, setActiveRefundMode] = useState({});
  const [ifscDetails, setIfscDetails] = useState({});
  const [beneficiaryDetails, setBeneficiaryDetails] = useState({});

  function getRefundDetails(orderID) {
    try {
      const values = {
        orderId: orderID || "",
      };
      fpi.executeGQL(GET_REFUND_DETAILS, values).then((res) => {
        if (res?.data?.refund) {
          const data = res?.data?.refund;
          setRefundDetails(data);
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function getActiveRefundMode(orderID) {
    try {
      const values = {
        orderId: orderID || "",
      };
      fpi.executeGQL(GET_ACTVE_REFUND_MODE, values).then((res) => {
        if (res?.data?.refund) {
          const data = res?.data?.refund;
          setActiveRefundMode(data);
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function verifyIfscCode(ifscCode) {
    try {
      const values = {
        ifscCode: ifscCode || "",
      };
      return fpi.executeGQL(VERIFY_IFSC_CODE, values).then((res) => {
        if (res?.data?.payment) {
          const data = res?.data?.payment;
          setIfscDetails(data);
          return data;
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function addBeneficiaryDetails(details) {
    try {
      const values = {
        addBeneficiaryDetailsRequestInput: details,
      };
      return fpi.executeGQL(ADD_BENEFICIARY_DETAILS, values).then((res) => {
        if (res?.data?.addBeneficiaryDetails) {
          const data = res?.data?.addBeneficiaryDetails;
          setBeneficiaryDetails(data);
          return data;
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function verifyOtpForWallet(details) {
    try {
      const values = {
        WalletOtpRequestInput: details,
      };
      return fpi.executeGQL(VERIFY_OTP_FOR_WALLET, values).then((res) => {
        if (res?.data?.verifyOtpAndAddBeneficiaryForWallet) {
          const data = res?.data?.verifyOtpAndAddBeneficiaryForWallet;
          return data;
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function verifyOtpForBank(details) {
    try {
      const values = {
        addBeneficiaryViaOtpVerificationRequestInput: details,
      };
      return fpi.executeGQL(VERIFY_OTP_FOR_BANK, values).then((res) => {
        if (res?.data?.verifyOtpAndAddBeneficiaryForBank) {
          const data = res?.data?.verifyOtpAndAddBeneficiaryForBank;
          return data;
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  return {
    refundDetails,
    activeRefundMode,
    ifscDetails,
    beneficiaryDetails,
    getRefundDetails,
    getActiveRefundMode,
    verifyIfscCode,
    addBeneficiaryDetails,
    verifyOtpForWallet,
    verifyOtpForBank,
  };
};

export default useRefundDetails;
