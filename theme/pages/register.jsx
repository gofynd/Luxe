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

Register.authGuard = loginGuard;

export const sections = JSON.stringify([]);
export default Register;
