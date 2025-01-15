import React from "react";
import { FDKLink } from "fdk-core/components";
import { useGlobalStore } from "fdk-core/utils";
import Navigation from "./navigation";
import I18Dropdown from "./i18n-dropdown";
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
  isHyperlocal = false,
  isPromiseLoading = false,
  pincode = "",
  deliveryMessage = "",
  onDeliveryClick = () => {},
}) {
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const international_shipping =
    CONFIGURATION?.app_features?.common?.international_shipping?.enabled ??
    false;

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
    appInfo?.logo?.secure_url?.replace("original", "resize-h:165") ||
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
          {isDoubleRowHeader && globalConfig?.always_on_search && (
            <div className={styles.alwaysOnSearch}>
              <Search
                customSearchClass={styles.customSearchClass}
                customSearchWrapperClass={styles.customSearchWrapperClass}
                showCloseButton={false}
                alwaysOnSearch={true}
                screen="desktop"
                globalConfig={globalConfig}
                fpi={fpi}
              />
            </div>
          )}
        </div>
        <div className={`${styles.middle} ${styles.flexCenter}`}>
          <FDKLink link="/">
            <img className={styles.logo} src={getShopLogo()} alt="Name" />
          </FDKLink>
          {isHyperlocal &&
            globalConfig?.always_on_search &&
            ["layout_1", "layout_2", "layout_3"].includes(
              globalConfig?.logo_menu_alignment
            ) && (
              <button
                className={`${styles.hyperlocalActionBtn} ${styles.hyperlocalSearchOn}`}
                onClick={onDeliveryClick}
              >
                {isPromiseLoading ? (
                  "Fetching..."
                ) : (
                  <>
                    <div className={styles.label}>
                      {pincode ? deliveryMessage : "Enter a pincode"}
                    </div>
                    {pincode && (
                      <div className={styles.pincode}>
                        <span>{pincode}</span>
                        <SvgWrapper
                          className={styles.headerAngleDownIcon}
                          svgSrc="header-angle-down"
                        />
                      </div>
                    )}
                  </>
                )}
              </button>
            )}
        </div>
        <div className={`${styles.right} ${styles.right__icons}`}>
          {international_shipping && <I18Dropdown fpi={fpi}></I18Dropdown>}
          {isHyperlocal &&
            (!globalConfig?.always_on_search ||
              globalConfig?.logo_menu_alignment === "layout_4") && (
              <button
                className={styles.hyperlocalActionBtn}
                onClick={onDeliveryClick}
              >
                {isPromiseLoading ? (
                  "Fetching..."
                ) : (
                  <>
                    <div className={styles.label}>
                      {pincode ? deliveryMessage : "Enter a pincode"}
                    </div>
                    {pincode && (
                      <div className={styles.pincode}>
                        <span>{pincode}</span>
                        <SvgWrapper
                          className={styles.headerAngleDownIcon}
                          svgSrc="header-angle-down"
                        />
                      </div>
                    )}
                  </>
                )}
              </button>
            )}
          {isDoubleRowHeader && !LoggedIn && (
            <button
              className={`${styles.labelSignin} b2 ${styles.fontBody}`}
              onClick={() => checkLogin("profile")}
              type="button"
            >
              <span>Sign in</span>
            </button>
          )}
          {(!isDoubleRowHeader || !globalConfig?.always_on_search) && (
            <div className={`${styles.icon} ${styles["right__icons--search"]}`}>
              <Search
                customClass={`${styles[globalConfig?.header_layout]}-row-search`}
                screen="desktop"
                globalConfig={globalConfig}
                fpi={fpi}
              />
            </div>
          )}

          <button
            type="button"
            className={` ${styles["right__icons--wishlist"]}`}
            title="wishlist"
            onClick={() => checkLogin("wishlist")}
          >
            <div className={styles.icon}>
              <SvgWrapper
                className={`${styles.wishlist} ${styles.singleRowIcon}`}
                svgSrc="single-row-wishlist"
              />
              {wishlistCount > 0 && LoggedIn && (
                <p className={styles.count}>{wishlistCount}</p>
              )}
            </div>
          </button>
          {(!isDoubleRowHeader || (isDoubleRowHeader && LoggedIn)) && (
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
                    className={`${styles.cart} ${styles.singleRowIcon}`}
                    svgSrc="single-row-cart"
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
