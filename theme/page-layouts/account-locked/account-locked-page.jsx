import React from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useAccounts } from "../../helper/hooks";
import AccountLockedPage from "fdk-react-templates/page-layouts/auth/account-locked/account-locked";
import "fdk-react-templates/page-layouts/auth/account-locked/account-locked.css";
import AuthContainer from "../auth/auth-container/auth-container";

function AccountLocked({ fpi }) {
  const supportInfo = useGlobalStore(fpi.getters.SUPPORT_INFORMATION);
  const { openHomePage } = useAccounts({ fpi });

  const { email } = supportInfo?.contact ?? {};

  return (
    <AuthContainer>
      <AccountLockedPage email={email} openHomePage={openHomePage} />
    </AuthContainer>
  );
}

export default AccountLocked;
