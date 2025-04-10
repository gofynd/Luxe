import React, { useId, useState } from "react";
import { useForm } from "react-hook-form";
import styles from "./styles/bank-form.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import useRefundDetails from "../../page-layouts/orders/useRefundDetails";
import { useGlobalTranslation } from "fdk-core/utils";

function BankForm({
  loadSpinner,
  fpi,
  addBankAccount,
  setShowBeneficiaryAdditionPage,
  exisitingBankRefundOptions,
}) {
  const { t } = useGlobalTranslation("translation");
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

  const validateIfscCode = async (value) => {
    if (value.length !== 11) {
      setIsValidIfsc(false);
      setBranchName("");
      setBankName("");
      return t("resource.order.enter_valid_ifsc_code");
    }

    try {
      const data = await verifyIfscCode(value);
      const ifscDetails = data?.verify_IFSC_code;

      if (ifscDetails && Object.keys(ifscDetails).length) {
        setBranchName(ifscDetails.branch_name);
        setBankName(ifscDetails.bank_name);
        setIsValidIfsc(true);
        return true;
      } else {
        setIsValidIfsc(false);
        setBranchName("");
        setBankName("");
        return data?.message || t("resource.common.invalid_ifsc_code");
      }
    } catch (error) {
      setIsValidIfsc(false);
      setBranchName("");
      setBankName("");
      return t("resource.common.error_validating_ifsc");
    }
  };
  const handleFormSubmit = (formdata) => {
    addBankAccount(formdata, ifscDetails, { selectedBankCheck: false });
  };
  const validateAccounHolder = (value) => {
    if (value.length === 0) {
      return false;
    }

    if (/\d/.test(value)) {
      return t("resource.common.error_numbers_not_allowed");
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
            {t("resource.common.ifsc_code")}{" "}
            <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput}`}
              id={ifscCodeId}
              maxLength={11}
              type="text"
              {...register("ifscCode", {
                validate: async (value) => validateIfscCode(value),
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
            {t("resource.order.account_number")}{" "}
            <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput} ${styles.paymentInputSecurity}`}
              id={accountNoId}
              type="number"
              {...register("accountNo", {
                validate: (value) =>
                  validateAccountNo(value) ||
                  t(
                    "resource.order.enter_valid_account_number"
                  ),
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
            <span>
              {t("resource.order.confirm_account_number")}
            </span>
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
                  t(
                    "resource.order.re_enter_valid_account_number"
                  ),
              })}
            />
          </div>
          {errors.confirmedAccountNo && (
            <p className={styles.error}>{errors.confirmedAccountNo.message}</p>
          )}
        </div>
        <div className={`${styles.formItem}`}>
          <div className={styles.formTitle} htmlFor={accounHolderId}>
            {t("resource.order.account_holder_name")}{" "}
            <span className={`${styles.formReq}`}>*</span>
          </div>
          <div className={`${styles.formInput}`}>
            <input
              className={`${styles.paymentInput}`}
              id={accounHolderId}
              type="text"
              {...register("accounHolder", {
                validate: (value) =>
                  validateAccounHolder(value) ||
                  t(
                    "resource.order.account_holder_name_validation"
                  ),
              })}
            />
          </div>
          {errors.accounHolder && (
            <p className={styles.error}>{errors.accounHolder.message}</p>
          )}
        </div>
        <div className={styles.footerSection}>
          <button
            className={`${styles.commonBtn} ${styles.btn} ${styles.modalBtn} ${styles.cancelButton}`}
            type="submit"
            onClick={() => {
              if (exisitingBankRefundOptions.length > 0) {
                setShowBeneficiaryAdditionPage(false);
              }
            }}
          >
            {t("resource.facets.cancel")}
          </button>
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

            {!loadSpinner && <span>{t("resource.common.continue")}</span>}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BankForm;
