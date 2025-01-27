import React, { useCallback } from "react";
import { motion } from "framer-motion";
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
      throw error;
    }
  }, []);

  const handleSetPrimary = useCallback(async (email) => {
    try {
      await setEmailAsPrimary(email);
      showSnackbar(`${email} set as primary`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
      throw error;
    }
  }, []);

  const handleDelete = useCallback(async (emailDetails) => {
    try {
      await deleteEmail(emailDetails);
      showSnackbar(`${emailDetails?.email} removed successfully`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
      throw error;
    }
  }, []);

  const handleAddEmail = useCallback(async (email) => {
    try {
      await addEmail(email);
      showSnackbar(`Verification link sent to ${email}`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
      throw error;
    }
  }, []);

  return (
    <ProfileRoot fpi={fpi}>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <EmailPage
          sendVerificationLinkToEmail={handleVerification}
          setEmailAsPrimary={handleSetPrimary}
          addEmail={handleAddEmail}
          deleteEmail={handleDelete}
          emails={emails}
        />
      </motion.div>
    </ProfileRoot>
  );
}

Email.authGuard = isLoggedIn;

export default Email;
