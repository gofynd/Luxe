import React from "react";
import { getGlobalConfigValue } from "../helper/utils";

export function Component({ props, globalConfig }) {
  const margin_bottom = getGlobalConfigValue(
    globalConfig,
    "section_margin_bottom"
  );
  const { code } = props;

  return !code?.value ? null : (
    <div
      className="basePageContainer margin0auto"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: code.value }}
      style={{ marginBottom: `${margin_bottom}px` }}
    />
  );
}

export const settings = {
  name: "custom-html",
  label: "Custom HTML",
  props: [
    {
      id: "code",
      label: "Your Code Here",
      type: "code",
      default: "",
      info: "Add Your custom HTML Code below. You can also use the full screen icon to open a code editor and add your code",
    },
  ],
  blocks: [],
};
