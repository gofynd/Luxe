import React, { useState } from "react";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { FDKLink } from "fdk-core/components";
import styles from "./share-item.less";
import { copyToClipboard } from "../../helper/utils";

function ShareItom({ setShowSocialLinks, description }) {
  const [btnText, setBtnText] = useState("Copy Link");

  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(window?.location?.href);

  const handleCopyToClipboard = (event) => {
    event.stopPropagation();
    const url = window.location.href;
    copyToClipboard(url);
    setBtnText("Copied");
    setTimeout(() => {
      setBtnText("Copy Link");
    }, 5000);
  };

  return (
    <>
      <div
        className={styles["overlay-share"]}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowSocialLinks(false);
        }}
      ></div>
      <div className={styles["share-popup-overlay"]}>
        <span className={styles.upArrow}>
          <SvgWrapper svgSrc="polygon" />
        </span>
        <div
          className={styles["share-popup"]}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${styles["popup-title"]} fontHeader`}>
            Share
            <span
              className={styles["close-icon"]}
              onClick={() => setShowSocialLinks(false)}
            >
              <SvgWrapper svgSrc="close" />
            </span>
          </div>
          <div className={styles.icons}>
            {/* <div className="social-links"> */}
            <span>
              <FDKLink
                to={`https://wa.me/?text=${encodedDescription} ${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SvgWrapper svgSrc="wattsappShare" />
              </FDKLink>
            </span>
            <span>
              <FDKLink
                to={`https://twitter.com/share?url=${encodedUrl}&text=${encodedDescription}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SvgWrapper svgSrc="twitterShare" />
              </FDKLink>
            </span>

            <span>
              <FDKLink
                to={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SvgWrapper svgSrc="facebookShare" />
              </FDKLink>
            </span>
          </div>
          <div className={styles["copy-input"]}>
            <input type="text" value={window?.location?.href} readOnly />
            <button
              onClick={handleCopyToClipboard}
              className={`${btnText === "Copied" ? styles["white-btn"] : ""}`}
            >
              {btnText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShareItom;
