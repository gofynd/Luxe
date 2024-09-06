import React from "react";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";
import styles from "./footer.less";
import useHeader from "../header/useHeader";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import fallbackLogo from "../../assets/images/logo.png";
import IntersectionObserverComponent from "../intersection-observer/intersection-observer";

function Footer({ fpi }) {
  const { globalConfig, FooterNavigation, contactInfo, supportInfo } =
    useHeader(fpi);
  const { email, phone } = supportInfo?.contact ?? {};
  const { active: emailActive = false, email: emailArray = [] } = email ?? {};
  const { active: phoneActive = false, phone: phoneArray = [] } = phone ?? {};

  const getArtWork = () => {
    if (globalConfig?.footer_image) {
      return {
        "--background-desktop": `url(${
          globalConfig?.footer_image_desktop ||
          "../../assets/images/placeholder19x6.png"
        })`,
        "--background-mobile": `url(${
          globalConfig?.footer_image_mobile ||
          "../../assets/images/placeholder4x5.png"
        })`,
        "--footer-opacity": 0.25,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover ",
        backgroundPosition: "center",
      };
    }
    return {};
  };

  function getSocialIcon(title) {
    return title && typeof title === "string"
      ? `footer-${title.toLowerCase()}`
      : "";
  }

  const getLogo = globalConfig?.logo?.replace("original", "resize-h:100");

  const isSocialLinks = Object.values(contactInfo?.social_links ?? {}).some(
    (value) => value?.link?.trim?.()?.length > 0
  );

  function hasOne() {
    return emailArray?.length || phoneArray?.length || isSocialLinks;
  }

  return (
    <footer className={`${styles.footer} fontBody`} style={getArtWork()}>
      <>
        <div className={styles.footer__top}>
          <div className={styles.footerContainer}>
            <div className={`${styles["footer__top--wrapper"]}`}>
              <div className={styles["footer__top--info"]}>
                <IntersectionObserverComponent>
                  {getLogo?.length > 0 && (
                    <div className={styles.logo}>
                      <img
                        src={getLogo}
                        loading="lazy"
                        alt="Footer Logo"
                        fetchpriority="low"
                      />
                    </div>
                  )}
                </IntersectionObserverComponent>
                <p
                  className={`${styles.description} ${styles.b1} ${styles.fontBody}`}
                >
                  {globalConfig?.footer_description}
                </p>
              </div>
              <div className={`${styles["footer__top--menu"]}`}>
                {FooterNavigation?.slice(0, 3)?.map((item, index) => (
                  <div className={styles.linkBlock} key={index}>
                    <h5 className={`${styles.menuTitle} ${styles.fontBody}`}>
                      {convertActionToUrl(item?.action)?.length > 0 ? (
                        <FDKLink to={convertActionToUrl(item?.action)}>
                          {item.display}
                        </FDKLink>
                      ) : (
                        <p>{item.display}</p>
                      )}
                    </h5>
                    <ul className={styles.list}>
                      {item?.sub_navigation?.map((subItem, subIndex) =>
                        subItem?.active ? (
                          <li
                            className={`${styles.menuItem} ${styles.b1} ${styles.fontBody}`}
                            key={subIndex}
                          >
                            {convertActionToUrl(subItem?.action).length > 0 ? (
                              <FDKLink to={convertActionToUrl(subItem?.action)}>
                                {subItem.display}
                              </FDKLink>
                            ) : (
                              <p>{subItem.display}</p>
                            )}
                          </li>
                        ) : null
                      )}
                    </ul>
                  </div>
                ))}
                {FooterNavigation?.length === 1 && (
                  <div className={styles.lineBlock} />
                )}
                {FooterNavigation?.length === 2 && (
                  <div className={styles.lineBlock} />
                )}
              </div>
            </div>
            {hasOne() && (
              <div className={`${styles["footer__top--contactInfo"]}`}>
                {phoneActive && phoneArray?.[0]?.number && (
                  <div className={styles.list}>
                    <h5
                      className={`${styles.title} ${styles.contacts} ${styles.fontBody}`}
                    >
                      Contact Us
                    </h5>
                    <div
                      className={`${styles.detail} ${styles.b1} ${styles.fontBody}`}
                    >
                      {`${
                        phoneArray?.[0]?.code
                          ? `+ ${phoneArray?.[0]?.code} -`
                          : ""
                      } ${phoneArray?.[0]?.number}`}
                    </div>
                  </div>
                )}
                {emailActive && emailArray?.[0]?.value && (
                  <div className={styles.list}>
                    <h5
                      className={`${styles.title} ${styles.contacts} ${styles.fontBody}`}
                    >
                      Email ID
                    </h5>
                    <a
                      href={`mailto:${emailArray?.[0]?.value}`}
                      className={`${styles.detail} ${styles.b1} ${styles.fontBody}`}
                    >
                      {emailArray?.[0]?.value}
                    </a>
                  </div>
                )}
                <div className={styles.list}>
                  {isSocialLinks && (
                    <>
                      <h5
                        className={`${styles.title} ${styles.contacts} ${styles.fontBody}`}
                      >
                        Social Media
                      </h5>
                      <span>
                        <ul
                          className={`${styles.social} ${styles.flexAlignCenter}`}
                        >
                          {Object.keys(contactInfo?.social_links).map((key) =>
                            contactInfo?.social_links?.[key]?.link?.length >
                              0 && key !== "__typename" ? (
                              <li className={styles.socialIcon} key={key}>
                                <FDKLink
                                  to={contactInfo?.social_links?.[key].link}
                                  target="_blank"
                                  title={contactInfo?.social_links?.[key].title}
                                  className={styles.flexAlignCenter}
                                >
                                  <SvgWrapper
                                    className={`${styles.footerIcon} ${
                                      contactInfo?.social_links?.[key].title ===
                                        "Vimeo" ||
                                      contactInfo?.social_links?.[key].title ===
                                        "Youtube"
                                        ? styles.vimeo
                                        : ""
                                    }`}
                                    svgSrc={getSocialIcon(
                                      contactInfo?.social_links?.[key].title
                                    )}
                                  />
                                </FDKLink>
                              </li>
                            ) : null
                          )}
                        </ul>
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={styles.footer__bottom}>
          <div className={styles.footerContainer}>
            <div
              className={`${styles.copyright} ${styles.b1} ${styles.fontBody}`}
            >
              {contactInfo?.copyright_text}
            </div>
            <IntersectionObserverComponent>
              {globalConfig?.payments_logo && (
                <div className={styles.paymentLogo}>
                  <img
                    src={globalConfig?.payments_logo}
                    alt="Payment Logo"
                    loading="lazy"
                    fetchpriority="low"
                  />
                </div>
              )}
            </IntersectionObserverComponent>
          </div>
        </div>
      </>
    </footer>
  );
}

export default Footer;
