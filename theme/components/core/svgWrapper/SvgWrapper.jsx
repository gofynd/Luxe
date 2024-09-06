import React from "react";
import { svgTitleComponentsMappings } from "../../../constants/svgTitleComponentsMappings";

function SvgWrapper({ svgSrc, children, ...props }) {
  const SvgComponent = svgTitleComponentsMappings[svgSrc];
  return SvgComponent ? (
    <SvgComponent {...props}> {children} </SvgComponent>
  ) : null;
}

export default SvgWrapper;
