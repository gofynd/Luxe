import React, { useId } from "react";
import Register from "fdk-react-templates/pages/register/register";
import "fdk-react-templates/pages/register/register.css";
import useRegister from "./useRegister";
import AuthContainer from "../auth/auth-container/auth-container";

// import Loader from '../../components/loader/loader';

function RegisterPage({ fpi }) {
  const { pageConfig, ...registerProps } = useRegister({ fpi });

  return (
    <AuthContainer
      bannerImage={pageConfig?.image_banner}
      bannerAlignment={pageConfig?.image_layout}
    >
      <Register {...registerProps} />
    </AuthContainer>
  );
}

export default RegisterPage;
