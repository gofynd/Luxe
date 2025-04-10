import React from "react";
import styles from "./styles/beneficiary-list-item.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";

function BeneficiaryItem({ beneficiary, selectedBeneficiary, change }) {
  const { t } = useGlobalTranslation("translation");
  const getTitle = () => {
    return beneficiary.title;
  };
  const getSubtitle = () => {
    return beneficiary.transfer_mode === "bank"
      ? `${t("resource.order.account_details")}: ${beneficiary.account_holder} | ${beneficiary.account_no
      } ${beneficiary.bank_name ? `| ${beneficiary.bank_name}` : ""}`
      : beneficiary.subtitle;
  };

  return (
    <div className={`${styles.beneficiaryItem}`}>
      <div>
        <div className={`${styles.beneficiaryContent}`}>
          {(!selectedBeneficiary ||
            selectedBeneficiary.beneficiary_id !==
            beneficiary.beneficiary_id) && (
              <SvgWrapper onClick={() => change(beneficiary)} svgSrc="regular" />
            )}
          {selectedBeneficiary &&
            selectedBeneficiary.beneficiary_id ===
            beneficiary.beneficiary_id && (
              <SvgWrapper svgSrc="radio-selected" />
            )}
          <div className={`${styles.text}`}>
            <div className={`${styles.beneficiaryTitle} ${styles.boldxs}`}>
              {getTitle()}
            </div>
            <div
              className={`${styles.beneficiarySubtitle} ${styles.regularxs}`}
            >
              {getSubtitle()}
            </div>
            {beneficiary.transfer_mode === "bank" && beneficiary.ifsc_code && (
              <div
                className={`${styles.beneficiarySubtitle} ${styles.regularxs}`}
              >
                {t(
                  "resource.common.ifsc_code"
                )}
                : {beneficiary.ifsc_code}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BeneficiaryItem;
