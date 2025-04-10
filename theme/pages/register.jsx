import React from "react";
import { loginGuard } from "../helper/auth-guard";
import RegisterPage from "../page-layouts/register/register-page";

function Register({ fpi }) {
  return <RegisterPage fpi={fpi} />;
}

export const settings = JSON.stringify({
  props: [
    {
      id: "image_layout",
      type: "select",
      options: [
        {
          value: "no_banner",
          text: "t:resource.common.no_banner",
        },
        {
          value: "right_banner",
          text: "t:resource.common.right_banner",
        },
        {
          value: "left_banner",
          text: "t:resource.common.left_banner",
        },
      ],
      default: "no_banner",
      label: "t:resource.common.image_layout",
    },
    {
      type: "image_picker",
      id: "image_banner",
      default: "",
      label: "t:resource.common.image_banner",
    },
  ],
});

Register.authGuard = loginGuard;

export const sections = JSON.stringify([]);
export default Register;
