import React from "react";
import VerifyEmailPage from "@gofynd/theme-template/pages/verify-email";
import { useEmail } from "../page-layouts/profile/useEmail";

function VerifyEmail({ fpi }) {
  const { verifyEmail } = useEmail({ fpi });

  return <VerifyEmailPage verifyEmail={verifyEmail} />;
}

export default VerifyEmail;
