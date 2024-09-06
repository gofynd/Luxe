import { useState, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useLocation } from "react-router-dom";
import { useAccounts } from "../../helper/hooks";
import useVerifyDetails from "../auth/useVerifyDetails";
// import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';

const useRegister = ({ fpi }) => {
  const { pathname } = useLocation();

  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const pageConfig =
    mode?.page?.find((f) => f.page === "register")?.settings?.props || {};

  console.log({ mode });

  const platformData = useGlobalStore(fpi.getters.PLATFORM_DATA);

  const [isFormSubmitSuccess, setIsFormSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [verifyBothData, setVerifyBothData] = useState(null);

  const { signUp, openHomePage, openLogin } = useAccounts({ fpi });
  const verifyDetailsProp = useVerifyDetails({ fpi, verifyBothData });

  const isEmail = platformData?.required_fields?.email?.is_required;
  const emailLevel = platformData?.required_fields?.email?.level;

  const isMobile = platformData?.required_fields?.mobile?.is_required;
  const mobileLevel = platformData?.required_fields?.mobile?.level;

  const handleLoginClick = () => {
    if (pathname === "/auth/register") {
      openLogin({ redirect: false });
    }
  };

  const handleFormSubmit = (formData) => {
    const user = { ...formData, registerToken: "" };
    signUp(user)
      .then((res) => {
        setVerifyBothData(res);
        if (res?.verify_mobile_otp || res?.verify_email_otp) {
          setIsFormSubmitSuccess(true);
        } else {
          openHomePage();
        }
      })
      .catch((err) => {
        setError({
          message: err?.message || "Something went wrong",
        });
      });
  };

  return {
    pageConfig,
    isFormSubmitSuccess,
    isEmail,
    emailLevel,
    isMobile,
    mobileLevel,
    error,
    loginButtonLabel: "GO TO LOGIN",
    verifyDetailsProp,
    onLoginButtonClick: handleLoginClick,
    onRegisterFormSubmit: handleFormSubmit,
  };
};

export default useRegister;
