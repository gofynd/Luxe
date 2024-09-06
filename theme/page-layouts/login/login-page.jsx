import React from "react";
// import styles from "./login-page.less";
import { useGlobalStore } from "fdk-core/utils";
import Login from "fdk-react-templates/pages/login/login";
import "fdk-react-templates/pages/login/login.css";
import useLogin from "./useLogin";
import AuthContainer from "../auth/auth-container/auth-container";

function LoginPage({ fpi }) {
  const { pageConfig, ...loginProps } = useLogin({ fpi });

  return (
    <AuthContainer
      bannerImage={pageConfig?.image_banner}
      bannerAlignment={pageConfig?.image_layout}
    >
      <Login {...loginProps} />
    </AuthContainer>
  );
}

export default LoginPage;