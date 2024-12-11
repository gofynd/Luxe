import React from "react";
import { FDKLink } from "fdk-core/components";
import FyImage from "../components/core/fy-image/fy-image";
import styles from "../styles/sections/horizontal-banner.less";

export function Component({ props, globalConfig }) {
  const { image_desktop, banner_link } = props;

  const getDesktopImage = () =>
    image_desktop?.value
      ? image_desktop?.value
      : require("../assets/images/banner-placeholder.png");

  const dynamicStyles = {
    marginBottom: `${globalConfig.section_margin_bottom}px`,
  };

  return (
    <div style={dynamicStyles} className={styles["banner-wrapper"]}>
      <FDKLink to={banner_link?.value}>
        <FyImage
          customClass={styles.imageWrapper}
          src={getDesktopImage()}
          sources={[
            { breakpoint: { min: 481 }, width: 1920 },
            { breakpoint: { max: 480 }, width: 1000 },
          ]}
        />
      </FDKLink>
    </div>
  );
}

export const settings = {
  label: "Horizontal Banner",
  props: [
    {
      type: "image_picker",
      id: "image_desktop",
      label: "Image",
      default: "",
    },
    {
      type: "url",
      id: "banner_link",
      default: "",
      label: "Redirect Link",
    },
  ],
};
