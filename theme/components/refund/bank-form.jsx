import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles/bank-form.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import useRefundDetails from "../../page-layouts/orders/useRefundDetails";

function BankForm({ loadSpinner, fpi, addBankAccount }) {
  const [inProgress, setInProgress] = useState(false);
  const [isValidIfsc, setIsValidIfsc] = useState(false);
  const [branchName, setBranchName] = useState(null);
  const [bankName, setBankName] = useState(false);
  const [value, setValue] = useState(null);
  const ifscCodeId = useId();
  const accountNoId = useId();
  const confirmedAccountNoId = useId();
  const accounHolderId = useId();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ifscCode: "",
      accountNo: "",
      confirmedAccountNo: "",
      accounHolder: "",
    },
    mode: "onChange",
  });

  const { ifscDetails, verifyIfscCode } = useRefundDetails(fpi);

  const validateIfscCode = (value) => {
    if (value.length !== 11) {
      setIsValidIfsc(false);
      setBranchName("");
      setBankName("");
      return;
    }
    verifyIfscCode(value).then((data) => {
      setBranchName(data.verify_IFSC_code.branch_name);
      setBankName(data.verify_IFSC_code.bank_name);
      setIsValidIfsc(true);
    });
    return true;
  };
  const handleFormSubmit = (formdata) => {
    addBankAccount(formdata, ifscDetails);
  };
  const validateAccounHolder = (value) => {
    if (value.length === 0) {
      return false;
    }
    return true;
  };
  const validateAccountNo = (value) => {
    if (value.length === 0) {
      return false;
    }
    return true;
  };

  return (
    <div className={`${styles.formContainer} ${styles.lightxxs}`}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={`${styles.formItem}`}
      >
        <div
          className={`${styles.formItem} ${errors.ifscCode ? styles.error : ""}`}
        >
          <div className={styles.formTitle} htmlFor={ifscCodeId}>
            IFSC Code <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput}`}
              id={ifscCodeId}
              maxLength={11}
              type="text"
              {...register("ifscCode", {
                validate: (value) =>
                  validateIfscCode(value) || "Please Enter Valid IFSC Code",
              })}
            />
          </div>
          {errors.ifscCode && (
            <p className={styles.error}>{errors.ifscCode.message}</p>
          )}
          {isValidIfsc && (
            <div className={`${styles.branchName} ${styles.regularxs}`}>
              <SvgWrapper
                className={`${styles.inlineSvg}`}
                svgSrc="verified-tick"
              />
              <p>{branchName}</p>
            </div>
          )}
        </div>
        <div
          className={`${styles.formItem} ${errors.accountNo ? styles.error : ""}`}
        >
          <div className={styles.formTitle} htmlFor={accountNoId}>
            Account Number <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput} ${styles.paymentInputSecurity}`}
              id={accountNoId}
              type="number"
              {...register("accountNo", {
                validate: (value) =>
                  validateAccountNo(value) ||
                  "Please Enter Valid Account Number",
              })}
            />
          </div>
          {errors.accountNo && (
            <p className={styles.error}>{errors.accountNo.message}</p>
          )}
        </div>
        <div
          className={`${styles.formItem} ${errors.confirmedAccountNo ? styles.error : ""}`}
        >
          <div className={styles.formTitle} htmlFor={confirmedAccountNoId}>
            <span>Confirm Account Number</span>
            <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput}`}
              id={confirmedAccountNoId}
              type="number"
              {...register("confirmedAccountNo", {
                validate: (value) =>
                  value === getValues("accountNo") ||
                  "Please Re-Enter Valid Account Number",
              })}
            />
          </div>
          {errors.confirmedAccountNo && (
            <p className={styles.error}>{errors.confirmedAccountNo.message}</p>
          )}
        </div>
        <div
          className={`${styles.formItem} ${errors.accounHolder ? styles.error : ""}`}
        >
          <div className={styles.formTitle} htmlFor={accounHolderId}>
            Account Holder Name <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput}`}
              id={accounHolderId}
              type="text"
              {...register("accounHolder", {
                validate: (value) =>
                  validateAccounHolder(value) ||
                  "Please Enter Valid Account Holder Name",
              })}
            />
          </div>
          {errors.accounHolder && (
            <p className={styles.error}>{errors.accounHolder.message}</p>
          )}
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
      </form>
    </div>
  );
}

export default BankForm;
