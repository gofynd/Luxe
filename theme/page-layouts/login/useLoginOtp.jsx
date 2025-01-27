import { useState, useRef, useEffect } from "react";
import { useAccounts } from "../../helper/hooks";
import useInternational from "../../components/header/useInternational";

const useLoginOtp = ({ fpi, isLoginToggle }) => {
  const [submittedMobile, setSubmittedMobile] = useState("");
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [isFormSubmitSuccess, setIsFormSubmitSuccess] = useState(false);
  const [sendOtpResponse, setSendOtpResponse] = useState({});
  const [otpError, setOtpError] = useState(null);

  const resendTimerRef = useRef(null);

  const { sendOtp, signInWithOtp, resendOtp } = useAccounts({ fpi });
  const { currentCountry } = useInternational({ fpi });

  const clearTimer = () => {
    if (resendTimerRef.current) {
      clearInterval(resendTimerRef.current);
    }
  };

  const timer = (remaining) => {
    let remainingTime = remaining;
    resendTimerRef.current = setInterval(() => {
      remainingTime -= 1;
      if (remainingTime <= 0) {
        clearTimer();
      }
      setOtpResendTime(remainingTime);
    }, 1000);
  };

  const handleLoginWithOtp = ({ phone }) => {
    const payload = {
      mobile: phone.mobile,
      countryCode: phone.countryCode,
    };
    sendOtp(payload)
      .then((response) => {
        if (response?.success) {
          setIsFormSubmitSuccess(true);
          setSendOtpResponse(response);
          setSubmittedMobile(response.mobile);
          setOtpResendTime(response?.resend_timer);
          timer(response?.resend_timer);
        }
      })
      .catch((err) => {
        setIsFormSubmitSuccess(false);
      });
  };
  const verifyOtp = ({ mobileOtp }) => {
    if (!mobileOtp) {
      return;
    }
    const payload = {
      otp: mobileOtp,
      requestId: sendOtpResponse?.request_id,
      isRedirection: true,
    };
    signInWithOtp(payload)
      .then((res) => {})
      .catch((err) => {
        if (err?.details?.meta?.is_deleted) {
          // return this.$router.push({
          //     path: '/auth/account-locked',
          //     query: this.$router.currentRoute.query,
          // });
        }
        setOtpError({ message: err?.message || "Something went wrong" });
      });
  };
  const handleResendOtp = ({ phone }) => {
    clearTimer();
    const payload = {
      mobile: phone?.mobile,
      countryCode: phone?.countryCode,
      token: sendOtpResponse?.resend_token,
      action: "resend",
    };
    resendOtp(payload).then((res) => {
      if (res?.success) {
        // setSendOtpResponse(res);
        setOtpResendTime(res?.resend_timer);
        timer(res?.resend_timer);
      }
    });
  };

  useEffect(() => {
    setSubmittedMobile("");
    setOtpResendTime(0);
    setIsFormSubmitSuccess(false);
    setSendOtpResponse({});
    setOtpError(null);
    clearTimer();
    resendTimerRef.current = null;
  }, [isLoginToggle]);

  return {
    mobileInfo: {
      countryCode: currentCountry?.phone_code?.replace("+", "") ?? "91",
      mobile: "",
      isValidNumber: false,
    },
    submittedMobile,
    otpResendTime,
    otpError,
    isFormSubmitSuccess,
    onOtpSubmit: verifyOtp,
    onResendOtpClick: handleResendOtp,
    handleLoginWithOtp,
  };
};

export default useLoginOtp;
