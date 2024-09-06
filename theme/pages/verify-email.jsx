import React from "react";
import { useEmail } from "../page-layouts/profile/useEmail";
import VerifyEmailPage from "fdk-react-templates/pages/verify-email";

function VerifyEmail({ fpi }) {
  const { verifyEmail } = useEmail({ fpi });

  return <VerifyEmailPage verifyEmail={verifyEmail} />;
}

export default VerifyEmail;
