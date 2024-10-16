import React from "react";
import { FDKLink } from "fdk-core/components";
import styles from "./socail-media.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

export default function SocailMedia({ social_links }) {
  return (
    <div className={styles.iconsContainer}>
      {Object.entries(social_links).map(
        ([key, { link, title }]) =>
          link && (
            <FDKLink key={key} to={link} target="_blank" title={title}>
              <SvgWrapper svgSrc={`socail-${title?.toLowerCase()}`} />
            </FDKLink>
          )
      )}
    </div>
  );
}
