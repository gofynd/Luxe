import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles/bank-form.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useSnackbar } from "../../helper/hooks";
import useRefundDetails from "../../page-layouts/orders/useRefundDetails";

function WalletForm({ fpi, addWalletAccount, loadSpinner }) {
  const [inProgress, setInProgress] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [mobileObj, setMobileObj] = useState({});
  const [resend, setResend] = useState(0);
  const { verifyOtpForWallet } = useRefundDetails(fpi);
  const { showSnackbar } = useSnackbar();

  const phoneId = useId();
  const otpId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: "",
      otp: "",
    },
    mode: "onChange",
  });

  const validPhone = (value) => {
    if (value.length === 0) {
      return false;
    } else if (value.length !== 10) {
      return false;
    }
    setMobile(value);
    return true;
  };
  const validOtp = (value) => {
    if (value.length === 0) {
      return false;
    }
    return true;
  };
  const sendOtp = () => {
    const data = {
      mobile,
      country_code: mobileObj?.country?.dialCode,
    };
    setInProgress(true);
    verifyOtpForWallet(data)
      .then((data) => {
        showSnackbar("OTP sent successfully", "success");
        setRequestId(data.request_id);
        setOtpSent(true);
        setInProgress(false);
      })
      .catch((err) => {
        const errMsg = err.response || "Something went wrong";
        showSnackbar(errMsg, "error");
        setInProgress(false);
      })
      .finally(() => {
        setInProgress(false);
      });
  };
  const handleFormSubmit = (formdata) => {
    addWalletAccount(formdata, requestId);
  };
  return (
    <div className={`${styles.formContainer} ${styles.lightxxs}`}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`${styles.formItem}`}
      >
        <div
          className={`${styles.formItem} ${errors.phone ? styles.error : ""}`}
        >
          <div className={styles.formTitle} htmlFor={phoneId}>
            Mobile Number <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput} ${styles.paymentInputSecurity}`}
              id={phoneId}
              type="number"
              {...register("phone", {
                validate: (value) =>
                  validPhone(value) || "Please Enter Valid Mobile Number",
              })}
            />
          </div>
          {errors.phone && (
            <p className={styles.error}>{errors.phone.message}</p>
          )}
        </div>
        <div className={`${styles.formItem} ${errors.otp ? styles.error : ""}`}>
          <div className={styles.formTitle} htmlFor={otpId}>
            Enter OTP <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput} ${styles.paymentInputSecurity}`}
              id={otpId}
              type="number"
              {...register("otp", {
                validate: (value) =>
                  validOtp(value) || "Please Enter Valid Enter OTP",
              })}
            />
          </div>
          {errors.otp && <p className={styles.error}>{errors.otp.message}</p>}
        </div>
        <button
          className={`${styles.commonBtn} ${styles.btn} ${styles.modalBtn}`}
          type="submit"
        >
          {loadSpinner && (
            <SvgWrapper
              className={`${styles.spinner}`}
              svgSrc="button-spinner"
            />
          )}

          {!loadSpinner && <span>Add</span>}
        </button>
        {/* {item.name === "otp" && otpSent && resend !== 2 && (
          <div
            className={`${styles.resendOtp} ${styles.uktLinks} ${styles.regularxxxs}`}
            onClick="sendOtp();resend++;"
          >
            Resend OTP
          </div>
        )} */}
      </form>
    </div>
  );
}

export default WalletForm;
