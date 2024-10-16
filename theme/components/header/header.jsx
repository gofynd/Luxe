import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FDKLink } from "fdk-core/components";
import Values from "values.js";
import { useGlobalStore } from "fdk-core/utils";
import { fetchCartDetails } from "../../page-layouts/cart/useCart";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
  throttle,
  isEmptyOrNull,
} from "../../helper/utils";
import Search from "./search";
import HeaderDesktop from "./desktop-header";
import Navigation from "./navigation";
import useHeader from "./useHeader";
import styles from "./styles/header.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import fallbackLogo from "../../assets/images/logo.png";
import { useAccounts } from "../../helper/hooks";

function Header({ fpi }) {
  const CART_ITEMS = useGlobalStore(fpi.getters.CART);
  const [resetNav, setResetNav] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const {
    globalConfig,
    cartItemCount,
    appInfo,
    HeaderNavigation = [],
    contactInfo,
    wishlistCount,
    loggedIn,
  } = useHeader(fpi);

  const { openLogin } = useAccounts({ fpi });

  const checkHeaderHeight = throttle(() => {
    if (isRunningOnClient()) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, 1400);

  useEffect(() => {
    if (isEmptyOrNull(CART_ITEMS?.cart_items)) {
      fetchCartDetails(fpi);
    }
    if (isRunningOnClient()) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
      window.addEventListener("resize", checkHeaderHeight);
    }
    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", checkHeaderHeight);
      }
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  useEffect(() => {
    if (isRunningOnClient()) {
      setTimeout(() => {}, 1000);
      const cssVariables = {
        "--imageRadius": `${globalConfig?.image_border_radius}px`,
        "--buttonRadius": `${globalConfig?.button_border_radius}px`,
        "--productImgAspectRatio": `${getProductImgAspectRatio(globalConfig)}`,
        "--headerHeight": `${headerHeight}px`,
      };

      const html = document.querySelector("html");
      const ascentColor = html.style.getPropertyValue("--themeAccent");
      const buttonPrimaryColor = html.style.getPropertyValue("--buttonPrimary");
      const buttonLinkColor = html.style.getPropertyValue("--buttonLink");
      if (buttonPrimaryColor) {
        const buttonShade = new Values(buttonPrimaryColor);
        cssVariables["--buttonPrimaryL1"] = `#${buttonShade.tint(20).hex}`;
        cssVariables["--buttonPrimaryL3"] = `#${buttonShade.tint(60).hex}`;
      }

      if (buttonLinkColor) {
        const buttonLinkShade = new Values(buttonLinkColor);

        cssVariables["--buttonLinkL1"] = `#${buttonLinkShade.tint(20).hex}`;
        cssVariables["--buttonLinkL2"] = `#${buttonLinkShade.tint(40).hex}`;
      }

      if (ascentColor) {
        const darkShadesColor = new Values(ascentColor).shades(20);
        const lightShadesColor = new Values(ascentColor).tints(20);

        for (let i = 1; i < darkShadesColor.length; i += 1) {
          cssVariables[`--themeAccentD${parseInt(i, 10) + 1}`] =
            `#${darkShadesColor[i].hex}`;
        }

        for (let i = 1; i < lightShadesColor?.length; i += 1) {
          cssVariables[`--themeAccentL${parseInt(i, 10) + 1}`] =
            `#${lightShadesColor[i].hex}`;
        }
      }

      const styleElement = document.createElement("style");
      const variables = JSON.stringify(cssVariables)
        .replaceAll(",", ";")
        .replace(/"/g, "");
      const str = `:root, ::before, ::after${variables}`;
      styleElement.innerHTML = str;

      // Append the <style> element to the document's head
      document.head.appendChild(styleElement);

      // Clean up the <style> element on component unmount
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [globalConfig, headerHeight]);

  const getShopLogoMobile = () =>
    appInfo?.mobile_logo?.secure_url?.replace("original", "resize-h:165") ||
    appInfo?.logo?.secure_url?.replace("original", "resize-h:165") ||
    fallbackLogo;

  const checkLogin = (type) => {
    if (type === "cart") {
      navigate("/cart/bag/");
      return;
    }

    if (!loggedIn) {
      openLogin();
      return;
    }

    const routes = {
      profile: "/profile/details",
      profile_mobile: "/profile/profile-tabs",
      wishlist: "/wishlist",
    };

    if (routes[type]) {
      navigate(routes[type]);
    }
  };

  const resetSidebarNav = () => {
    setResetNav(true);

    setTimeout(() => {
      setResetNav(false);
    }, 500);
  };

  // to scroll top whenever path changes
  const location = useLocation();
  useLayoutEffect(() => {
    window?.scrollTo?.(0, 0);
  }, [location.pathname]);

  return (
    <div className={`${styles.ctHeaderWrapper} fontBody`}>
      <header className={styles.header} ref={headerRef}>
        <div
          className={`${styles.headerContainer} basePageContainer margin0auto `}
        >
          <div className={styles.desktop}>
            <HeaderDesktop
              checkLogin={checkLogin}
              fallbackLogo={fallbackLogo}
              cartItemCount={cartItemCount}
              globalConfig={globalConfig}
              LoggedIn={loggedIn}
              appInfo={appInfo}
              navigation={HeaderNavigation}
              wishlistCount={wishlistCount}
              contactInfo={contactInfo}
              fpi={fpi}
            />
          </div>
          <div
            className={`${styles.mobile} ${
              styles[globalConfig.header_layout]
            } ${styles[globalConfig.logo_menu_alignment]}`}
          >
            <Navigation
              customClass={`${styles.left} ${styles.flexAlignCenter} ${
                styles[globalConfig.header_layout]
              }`}
              fallbackLogo={fallbackLogo}
              maxMenuLenght={12}
              reset
              isSidebarNav
              LoggedIn={loggedIn}
              navigationList={HeaderNavigation}
              appInfo={appInfo}
              globalConfig={globalConfig}
              checkLogin={checkLogin}
              contactInfo={contactInfo}
            />
            <FDKLink
              to="/"
              className={`${styles.middle} ${styles.flexAlignCenter}`}
            >
              <img
                className={styles.logo}
                src={getShopLogoMobile()}
                alt="name"
              />
            </FDKLink>
            <div className={styles.right}>
              <div
                className={`${styles.icon} ${styles["right__icons--search"]}`}
              >
                <Search
                  onSearchOpened={resetSidebarNav}
                  globalConfig={globalConfig}
                  fpi={fpi}
                />
              </div>
              <div>
                <button
                  type="button"
                  className={`${styles.icon} ${styles["right__icons--bag"]}`}
                  onClick={() => checkLogin("cart")}
                  aria-label="cart"
                >
                  <SvgWrapper
                    className={`${styles.cart} ${styles.mobileIcon} ${styles.headerIcon}`}
                    svgSrc={
                      globalConfig?.header_layout === "double"
                        ? "cart"
                        : "single-row-cart"
                    }
                  />
                  <span
                    className={styles.cartCount}
                    style={{
                      display: cartItemCount !== 0 ? "initial" : "none",
                    }}
                  >
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
