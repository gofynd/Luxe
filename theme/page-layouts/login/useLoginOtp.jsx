import { useState, useRef, useMemo } from "react";
import { useAccounts } from "../../helper/hooks";

const useLoginOtp = ({ fpi }) => {
  const mobileInfo = useRef({
    countryCode: "91",
    mobile: "",
    isValidNumber: false,
  });
  const [submittedMobile, setSubmittedMobile] = useState("");
  const [otpResendTime, setOtpResendTime] = useState(0);
  const [isFormSubmitSuccess, setIsFormSubmitSuccess] = useState(false);
  const [sendOtpResponse, setSendOtpResponse] = useState({});
  const [otpError, setOtpError] = useState(null);

  const resendTimerRef = useRef(null);

  const { sendOtp, signInWithOtp, resendOtp } = useAccounts({ fpi });

  const timer = (remaining) => {
    let remainingTime = remaining;
    resendTimerRef.current = setInterval(() => {
      remainingTime -= 1;
      if (remainingTime <= 0) {
        clearInterval(resendTimerRef.current);
      }
      setOtpResendTime(`${remainingTime}`);
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
      .then((res) => {
        // console.log("verifyOtp", { res });
        // if (data?.errors) {
        //   throw data?.errors?.[0];
        // }
      })
      .catch((err) => {
        if (err?.details?.meta?.is_deleted) {
          // return this.$router.push({
          //     path: '/auth/account-locked',
          //     query: this.$router.currentRoute.query,
          // });
        }
        // console.log(err);
        setOtpError({ message: err?.message || "Something went wrong" });
      });
  };
  const handleResendOtp = ({ phone }) => {
    clearInterval(resendTimerRef.current);
    const payload = {
      mobile: phone?.mobile,
      countryCode: phone?.countryCode,
      token: sendOtpResponse?.resend_token,
      action: "resend",
    };
    resendOtp(payload).then((res) => {
      if (res?.success) {
        setSendOtpResponse(res);
        setOtpResendTime(res?.resend_timer);
        timer(res?.resend_timer);
      }
    });
  };

  return {
    mobileInfo: mobileInfo.current,
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
