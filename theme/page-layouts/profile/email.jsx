import React, { useCallback } from "react";
import EmailPage from "@gofynd/theme-template/pages/profile/email";
import { isLoggedIn } from "../../helper/auth-guard";
import ProfileRoot from "../../components/profile/profile-root";
import { useSnackbar } from "../../helper/hooks";
import { useEmail } from "./useEmail";
import "@gofynd/theme-template/pages/profile/email/email.css";

function Email({ fpi }) {
  const { showSnackbar } = useSnackbar();
  const {
    sendVerificationLinkToEmail,
    setEmailAsPrimary,
    addEmail,
    deleteEmail,
    emails,
  } = useEmail({
    fpi,
  });

  const handleVerification = useCallback(async (email) => {
    try {
      await sendVerificationLinkToEmail(email);
      showSnackbar(`Verification link sent to ${email}`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleSetPrimary = useCallback(async (email) => {
    try {
      await setEmailAsPrimary(email);
      showSnackbar(`${email} set as primary`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleDelete = useCallback(async (emailDetails) => {
    try {
      await deleteEmail(emailDetails);
      showSnackbar(`${emailDetails?.email} removed successfully`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleAddEmail = useCallback(async (email) => {
    try {
      await addEmail(email);
      showSnackbar(`Verification link sent to ${email}`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  return (
    <ProfileRoot fpi={fpi}>
      <EmailPage
        sendVerificationLinkToEmail={handleVerification}
        setEmailAsPrimary={handleSetPrimary}
        addEmail={handleAddEmail}
        deleteEmail={handleDelete}
        emails={emails}
      />
    </ProfileRoot>
  );
}

Email.authGuard = isLoggedIn;

export default Email;
