import React from "react";
import { FDKLink } from "fdk-core/components";

import Navigation from "./navigation";
import Search from "./search";
import styles from "./styles/desktop-header.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function HeaderDesktop({
  checkLogin,
  fallbackLogo,
  cartItemCount,
  globalConfig,
  LoggedIn,
  appInfo,
  navigation,
  wishlistCount,
  contactInfo,
  fpi,
}) {
  const isDoubleRowHeader = globalConfig?.header_layout === "double";
  const getMenuMaxLength = () => {
    if (isDoubleRowHeader) {
      return 10;
    }

    const logoMenuAlignment = globalConfig?.logo_menu_alignment;
    return {
      layout_1: 6,
      layout_2: 6,
      layout_3: 6,
      layout_4: 5,
    }[logoMenuAlignment];
  };

  const getShopLogo = () =>
    appInfo?.logo?.secure_url?.replace("original", "resize-h:65") ||
    fallbackLogo;

  return (
    <div
      className={`${styles.headerDesktop}  ${
        styles[globalConfig.header_layout]
      } ${styles[globalConfig.logo_menu_alignment]}`}
    >
      <div className={styles.firstRow}>
        <div className={styles.left}>
          {!isDoubleRowHeader && (
            <Navigation
              customClass={`${styles.firstRowNav} ${
                styles[globalConfig?.header_layout]
              }`}
              maxMenuLength={getMenuMaxLength()}
              fallbackLogo={fallbackLogo}
              navigationList={navigation}
              appInfo={appInfo}
              globalConfig={globalConfig}
              reset
              checkLogin={checkLogin}
              contactInfo={contactInfo}
            />
          )}
        </div>
        <div className={`${styles.middle} ${styles.flexCenter}`}>
          <FDKLink link="/">
            <img className={styles.logo} src={getShopLogo()} alt="Name" />
          </FDKLink>
        </div>
        <div className={`${styles.right} ${styles.right__icons}`}>
          {isDoubleRowHeader && !LoggedIn && (
            <button
              className={`${styles.labelSignin} ${styles.b2} ${styles.fontBody}`}
              onClick={() => checkLogin("profile")}
              type="button"
            >
              <span>Sign in</span>
            </button>
          )}
          <div className={`${styles.icon} ${styles["right__icons--search"]}`}>
            <Search
              customClass={`${styles[globalConfig?.header_layout]}-row-search`}
              screen="desktop"
              globalConfig={globalConfig}
              fpi={fpi}
            />
          </div>
          {isDoubleRowHeader && LoggedIn && (
            <button
              type="button"
              aria-label="Username"
              className={`${styles.icon} ${styles["right__icons--profile"]}`}
              onClick={() => checkLogin("profile")}
            >
              <SvgWrapper
                className={`${styles.user} ${isDoubleRowHeader ? styles.headerIcon : styles.singleRowIcon}`}
                svgSrc="single-row-user"
              />
            </button>
          )}
          <button
            type="button"
            className={`${styles.icon} ${styles["right__icons--wishlist"]}`}
            title="wishlist"
            onClick={() => checkLogin("wishlist")}
          >
            <div>
              <SvgWrapper
                className={`${styles.wishlist} ${isDoubleRowHeader ? styles.headerIcon : styles.singleRowIcon}`}
                svgSrc={isDoubleRowHeader ? "wishlist" : "single-row-wishlist"}
              />
              {wishlistCount > 0 && LoggedIn && (
                <p className={styles.count}>{wishlistCount}</p>
              )}
            </div>
          </button>
          {!isDoubleRowHeader && (
            <button
              type="button"
              className={`${styles.icon} ${styles["right__icons--profile"]}`}
              onClick={() => checkLogin("profile")}
              aria-label="Profile"
            >
              <SvgWrapper
                className={`${styles.user} ${styles.headerIcon} ${styles.singleRowIcon}`}
                svgSrc="single-row-user"
              />
            </button>
          )}
          {!globalConfig?.disable_cart &&
            globalConfig?.button_options !== "none" && (
              <button
                type="button"
                className={`${styles.icon} ${styles["right__icons--bag"]}`}
                onClick={() => checkLogin("cart")}
              >
                <div>
                  <SvgWrapper
                    className={`${styles.cart} ${isDoubleRowHeader ? styles.headerIcon : styles.singleRowIcon}`}
                    svgSrc={isDoubleRowHeader ? "cart" : "single-row-cart"}
                  />
                  <p
                    className={styles.count}
                    style={{
                      display: cartItemCount !== 0 ? "flex" : "none",
                    }}
                  >
                    {cartItemCount}
                  </p>
                </div>
              </button>
            )}
        </div>
      </div>
      {isDoubleRowHeader && (
        <Navigation
          customClass={styles.secondRow}
          maxMenuLength={getMenuMaxLength()}
          fallbackLogo={fallbackLogo}
          navigationList={navigation}
          globalConfig={globalConfig}
          appInfo={appInfo}
          LoggedIn={LoggedIn}
          checkLogin={checkLogin}
          contactInfo={contactInfo}
        />
      )}
    </div>
  );
}

export default HeaderDesktop;
