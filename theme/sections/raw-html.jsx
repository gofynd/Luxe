import React from "react";

export function Component({ props, globalConfig }) {
  const { code } = props;

  return !code?.value ? null : (
    <div
      className="basePageContainer margin0auto"
      dangerouslySetInnerHTML={{ __html: code.value }}
      style={{
        paddingTop: `16px`,
        paddingBottom: `${globalConfig?.section_margin_bottom + 16}px`,
      }}
    />
  );
}

export const settings = {
  label: "t:resource.sections.custom_html.custom_html",
  props: [
    {
      id: "code",
      label: "t:resource.sections.custom_html.your_code_here",
      type: "code",
      default: "",
      info: "t:resource.sections.custom_html.custom_html_code_editor",
    },
  ],
  blocks: [],
};
export default Component;
