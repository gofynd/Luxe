import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useEmail } from "../page-layouts/profile/useEmail";
import EmptyState from "../components/empty-state/empty-state";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";

function VerifyEmail({ fpi }) {
  const { t } = useGlobalTranslation("translation");
  const { verifyEmail } = useEmail({ fpi });

  const [searchParams] = useSearchParams();
  const [isEmailCodeValid, setIsEmailCodeValid] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const handleEmailVerification = useCallback(async () => {
    try {
      setIsLoading(true);
      const code = searchParams.get("code");
      await verifyEmail(code);
      setIsEmailCodeValid(true);
      setIsLoading(false);
    } catch (error) {
      setIsEmailCodeValid(false);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleEmailVerification();
  }, []);

  return isLoading ? (
    <></>
  ) : (
    <EmptyState
      showButton={false}
      Icon={
        <div>
          <SvgWrapper
            svgSrc={`${isEmailCodeValid ? "verified-tick" : "email-404"}`}
          />
        </div>
      }
      title={`${isEmailCodeValid ? t("resource.verify_email.email_success") : t("resource.verify_email.code_expired")}`}
    />
  );
}

export default VerifyEmail;
