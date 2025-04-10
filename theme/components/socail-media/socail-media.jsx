import React from "react";
import styles from "./socail-media.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { FDKLink } from "fdk-core/components";

export default function SocailMedia({ social_links }) {
  return (
    <div className={styles.iconsContainer}>
      {Object.entries(social_links).map(
        ([key, { link, title }]) =>
          link && (
            <FDKLink key={key} to={link} target="_blank" title={title}>
              <SvgWrapper svgSrc={`socail-${key}`} />
            </FDKLink>
          )
      )}
    </div>
  );
}
