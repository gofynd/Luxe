import React from "react";
import { loginGuard } from "../helper/auth-guard";
import LoginPage from "../page-layouts/login/login-page";

function Login({ fpi }) {
  return <LoginPage fpi={fpi} />;
}

export const settings = JSON.stringify({
  props: [
    {
      id: "image_layout",
      type: "select",
      options: [
        {
          value: "no_banner",
          text: "No Banner",
        },
        {
          value: "right_banner",
          text: "Right Banner",
        },
        {
          value: "left_banner",
          text: "Left Banner",
        },
      ],
      default: "no_banner",
      label: "Image Layout",
    },
    {
      type: "image_picker",
      id: "image_banner",
      default: "",
      label: "Image Banner",
    },
  ],
});

Login.serverFetch = () => {};

Login.authGuard = loginGuard;

export default Login;
