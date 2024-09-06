import React, { useMemo } from "react";
import { useAccounts } from "../../helper/hooks";
import AuthContainer from "../auth/auth-container/auth-container";
import styles from "./account-locked-page.less";

function AccountLocked({ fpi }) {
  const supportEmail = useMemo(() => "", []);
  const { openHomePage } = useAccounts({ fpi });
  return (
    <AuthContainer>
      <div>
        <div className={styles.deleteAccountTxt}>Your Account is locked</div>
        <p className={styles.deleteAccountDesc}>
          As per your request, your account will be deleted soon. If you wish to
          restore your account, please contact on below support email id.
        </p>
        <p className={styles.supportEmail}>{{ supportEmail }}</p>
        <button
          className={styles.deleteAccountBtn}
          type="submit"
          onClick={() => openHomePage()}
        >
          Continue
        </button>
      </div>
    </AuthContainer>
  );
}

export default AccountLocked;
