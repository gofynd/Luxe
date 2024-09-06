import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";
import styles from "./styles/navigation.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { isRunningOnClient } from "../../helper/utils";
import IntersectionObserverComponent from "../intersection-observer/intersection-observer";
import MegaMenu from "./mega-menu";

function Navigation({
  reset,
  isSidebarNav,
  maxMenuLength = 0,
  customClass = {},
  navigationList,
  globalConfig,
  appInfo,
  LoggedIn,
  checkLogin,
  contactInfo,
}) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSidebarNav, setShowSidebarNav] = useState(true);
  const [sidebarl2Nav, setSidebarl2Nav] = useState({});
  const [sidebarl3Nav, setSidebarl3Nav] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredL2Index, setHoveredL2Index] = useState(null);
  const [isClient, setIsClient] = useState(false);

  const handleMouseEnter = (index) => {
    setActiveItem(index);
  };

  const handleMouseLeave = () => {
    setActiveItem(null);
    setHoveredL2Index(null);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };

  const closeSidebarNav = () => {
    setShowSidebar(false);
    setShowSidebarNav(true);
    setSidebarl2Nav({ state: false });
    setSidebarl3Nav({ state: false });
  };

  useEffect(() => {
    if (reset) {
      closeSidebarNav();
    }
  }, [reset]);

  useEffect(() => {
    if (isRunningOnClient()) {
      setIsClient(true);
      if (showSidebar) {
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        document.body.style.top = `-${scrollY}px`;
      } else {
        const docScrollY = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        window.scrollTo(0, parseInt(docScrollY, 10 || "0") * -1);
      }
    }

    return () => {
      // Cleanup scroll position on showSidebar change
    };
  }, [showSidebar, scrollY]);
  const isHorizontalNav = navigationList?.length > 0 && !isSidebarNav;
  const isMegaMenu =
    globalConfig?.header_mega_menu && globalConfig?.header_layout === "double";
  const getNavigation = navigationList?.slice(0, maxMenuLength);
  const getMenuOffset = () => {
    const val = globalConfig?.menu_layout_desktop;

    return val === "layout_1" || val === "layout_2"
      ? { paddingTop: "20px" }
      : { paddingTop: "4px" };
  };

  const getShopLogoMobile = () =>
    appInfo?.mobile_logo?.secure_url || appInfo?.logo?.secure_url || "";
  // fallbackLogo;

  const isDoubleRowHeader = globalConfig?.header_layout === "double";
  const isSocialLinks =
    Object.keys(contactInfo?.social_links || {}).filter(
      (item) => contactInfo.social_links?.[item].link
    ).length > 0;

  const openSidebarNav = () => {
    setShowSidebar(true);
  };

  const getAnimate = (index) => {
    let animate = null;
    if (isClient) {
      if (activeItem === index) {
        animate = { opacity: 1, y: 0 };
      } else {
        animate = { opacity: 0, y: -20 };
      }
    }
    return animate;
  };

  const redirectToMenu = (menu, level) => {
    if (!menu.sub_navigation.length) {
      closeSidebarNav();
    } else {
      if (level === "l2") {
        setShowSidebarNav(false);
        setSidebarl3Nav((prev) => ({ ...prev, title: false, state: false }));
        setSidebarl2Nav({
          state: true,
          title: menu.display,
          navigation: menu.sub_navigation,
        });
      }
      if (level === "l3") {
        setSidebarl2Nav((prev) => ({ ...prev, state: false }));
        setSidebarl3Nav({
          state: true,
          title: menu.display,
          navigation: menu.sub_navigation,
        });
      }
    }
  };

  const goBack = (level) => {
    if (level === "l2") {
      setSidebarl2Nav((prev) => ({ ...prev, state: true }));
      setSidebarl3Nav((prev) => ({ ...prev, title: false, state: false }));
    }
    if (level === "l1") {
      setSidebarl2Nav((prev) => ({ ...prev, title: false, state: false }));
      setShowSidebarNav(true);
    }
  };

  return (
    <div className={customClass}>
      {isHorizontalNav && !isMegaMenu && (
        <nav className={`${styles.nav} ${customClass}`}>
          <AnimatePresence>
            <motion.ul
              className={styles.l1NavigationList}
              initial={isClient ? "hidden" : undefined}
              animate={isClient ? "visible" : undefined}
              exit={isClient ? "hidden" : undefined}
              variants={dropdownVariants}
              transition={{ duration: 0.3 }}
            >
              {getNavigation?.map((l1nav, index) => (
                <li
                  key={index}
                  className={`${styles.l1NavigationList__item} ${styles.h5} ${styles.flexAlignCenter} ${styles.fontBody}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <FDKLink to={convertActionToUrl(l1nav?.action)}>
                    <span
                      className={`${styles.menuTitle} ${styles.flexAlignCenter} `}
                    >
                      <span>{l1nav.display}</span>
                      {l1nav.sub_navigation &&
                        l1nav.sub_navigation.length > 0 && (
                          <SvgWrapper
                            className={`${styles.menuIcon} ${styles.dropdownIcon}`}
                            svgSrc="arrow-down"
                          />
                        )}
                    </span>
                  </FDKLink>
                  <AnimatePresence>
                    {l1nav?.sub_navigation?.length > 0 && (
                      <motion.ul
                        className={styles.l2NavigationList}
                        initial={isClient ? { opacity: 0, y: -20 } : null}
                        animate={() => getAnimate(index)}
                        exit={isClient ? { opacity: 0, y: -20 } : null}
                        transition={{ duration: 0.3 }}
                      >
                        {l1nav.sub_navigation.map((l2nav, l2Index) => (
                          <li
                            key={l2nav.display}
                            className={`${styles.l2NavigationList__item} ${styles.b1} ${styles.fontBody}`}
                            onMouseEnter={() => setHoveredL2Index(l2Index)}
                            onMouseLeave={() => setHoveredL2Index(null)}
                          >
                            <FDKLink
                              to={convertActionToUrl(l2nav?.action)}
                              className={
                                styles["l2NavigationList__item--wrapper"]
                              }
                            >
                              <span
                                className={`${styles.flexAlignCenter} ${styles.justifyBetween}`}
                              >
                                <span>{l2nav.display}</span>
                                {l2nav.sub_navigation &&
                                  l2nav.sub_navigation.length > 0 && (
                                    <SvgWrapper
                                      className={`${styles.menuIcon} ${styles.arrowRightIcon}`}
                                      svgSrc="arrow-down"
                                    />
                                  )}
                              </span>
                            </FDKLink>
                            <AnimatePresence>
                              {l2nav.sub_navigation.length > 0 &&
                                hoveredL2Index === l2Index && (
                                  <motion.ul
                                    className={styles.l3NavigationList}
                                    initial={
                                      isClient ? { opacity: 0, x: -20 } : null
                                    }
                                    animate={
                                      isClient ? { opacity: 1, x: 0 } : null
                                    }
                                    exit={
                                      isClient ? { opacity: 0, x: -20 } : null
                                    }
                                    transition={{ duration: 0.3 }}
                                  >
                                    {l2nav.sub_navigation.map((l3nav) => (
                                      <li
                                        key={`${l3nav.display}`}
                                        className={`${styles.l3NavigationList__item} ${styles.b1} ${styles.fontBody}`}
                                      >
                                        <FDKLink
                                          to={convertActionToUrl(l3nav?.action)}
                                          className={`${styles["l3NavigationList__item--wrapper"]}`}
                                        >
                                          <span
                                            className={styles.flexAlignCenter}
                                          >
                                            {l3nav.display}
                                          </span>
                                        </FDKLink>
                                      </li>
                                    ))}
                                  </motion.ul>
                                )}
                            </AnimatePresence>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </nav>
      )}
      <div
        className={`${styles.icon} ${styles.flexCenter}`}
        style={{ display: isSidebarNav ? "flex" : "none" }}
      >
        {showSidebar ? (
          <SvgWrapper
            className={`${styles.closeIcon} ${styles.menuIcon}`}
            svgSrc="close"
            onClick={closeSidebarNav}
          />
        ) : (
          <SvgWrapper
            className={`${styles.hamburgerIcon} ${styles.menuIcon}`}
            svgSrc="hamburger"
            onClick={openSidebarNav}
          />
        )}
      </div>
      {isHorizontalNav && isMegaMenu && (
        <div className={`${styles.headerMegaMenu}`}>
          <MegaMenu headerNavigation={getNavigation}></MegaMenu>
        </div>
      )}
      {/* Sidebar If */}
      <div
        className={` ${
          globalConfig?.header_layout === "double" ? "" : styles.single
        }`}
      >
        <motion.div
          className={`${styles.sidebar}`}
          initial={{ x: "-100%" }} // Start off-screen to the left
          animate={{ x: showSidebar ? 0 : "-100%" }} // Animate to 0 when open, back to -100% when closed
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100%",
          }}
        >
          <div
            className={`${styles.sidebar__header} ${styles.flexAlignCenter} ${styles.justifyBetween}`}
            style={{
              display:
                globalConfig?.header_layout === "double" ? "flex" : "none",
            }}
          >
            <FDKLink link="/">
              <IntersectionObserverComponent>
                <img
                  className={styles.logo}
                  src={getShopLogoMobile()}
                  alt="logo"
                />
              </IntersectionObserverComponent>
            </FDKLink>
            <button
              type="button"
              className={styles.closeIcon}
              onClick={closeSidebarNav}
              aria-label="close"
            >
              <SvgWrapper
                className={`${styles.menuIcon} ${styles.crossIcon} ${styles.sidebarIcon}`}
                svgSrc="close"
              />
            </button>
          </div>
          <nav className={styles.sidebar__navigation}>
            <ul
              key="l1_Nav"
              style={{ display: showSidebarNav ? "block" : "none" }}
            >
              {navigationList.map((nav, index) => (
                <li
                  key={`${nav.display}-${index}`}
                  className={`${styles["sidebar__navigation--item"]} ${styles.flexAlignCenter} ${styles.justifyBetween} ${styles.fontBody} ${styles.h5}`}
                >
                  {convertActionToUrl(nav?.action) ? (
                    <FDKLink
                      className={styles.navLink}
                      to={convertActionToUrl(nav?.action)}
                      onClick={() => {
                        setShowSidebar(false);
                        closeSidebarNav();
                      }}
                    >
                      {nav.display}
                    </FDKLink>
                  ) : (
                    <span
                      onClick={() => {
                        if (nav.sub_navigation.length > 0) {
                          redirectToMenu(nav, "l2");
                        } else {
                          setShowSidebar(false);
                          closeSidebarNav();
                        }
                      }}
                    >
                      {nav.display}
                    </span>
                  )}
                  {nav?.sub_navigation?.length > 0 && (
                    <div onClick={() => redirectToMenu(nav, "l2")}>
                      <SvgWrapper
                        className={`${styles.arrowRightIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                        svgSrc="arrow-down"
                        style={{
                          display:
                            globalConfig?.header_layout === "double"
                              ? "block"
                              : "none",
                        }}
                      />
                      <SvgWrapper
                        className={`${styles.arrowIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                        svgSrc="arrow-left-long"
                        style={{
                          display:
                            globalConfig?.header_layout !== "double"
                              ? "block"
                              : "none",
                        }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {sidebarl2Nav.state && (
              <ul key="l2_Nav">
                <li
                  onClick={() => goBack("l1")}
                  className={`${styles["sidebar__navigation--item"]} ${
                    styles.title
                  } ${styles.flexAlignCenter} ${styles.justifyStart} ${
                    styles.fontBody
                  } ${isDoubleRowHeader ? styles.b1 : styles.h5}`}
                  style={{ display: sidebarl2Nav.title ? "flex" : "none" }}
                >
                  <SvgWrapper
                    className={`${styles.arrowLeftIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                    svgSrc={
                      isDoubleRowHeader ? "arrow-down" : "arrow-left-long"
                    }
                  />
                  <span>{sidebarl2Nav.title}</span>
                </li>
                {sidebarl2Nav.navigation.map((nav, index) => (
                  <li
                    key={index}
                    className={`${styles["sidebar__navigation--item"]} ${
                      styles.flexAlignCenter
                    } ${styles.justifyBetween} ${styles.fontBody} ${
                      isDoubleRowHeader ? styles.h5 : styles.b1
                    }`}
                  >
                    {convertActionToUrl(nav?.action) ? (
                      <FDKLink
                        className={styles["nav-link"]}
                        to={convertActionToUrl(nav?.action)}
                        onClick={() => {
                          goBack("l1");
                          closeSidebarNav();
                        }}
                      >
                        {nav.display}
                      </FDKLink>
                    ) : (
                      <span
                        onClick={() => {
                          if (nav?.sub_navigation?.length) {
                            redirectToMenu(nav, "l3");
                          } else {
                            goBack("l1");
                            closeSidebarNav();
                          }
                        }}
                      >
                        {nav.display}
                      </span>
                    )}
                    {nav?.sub_navigation?.length > 0 && (
                      <div onClick={() => redirectToMenu(nav, "l3")}>
                        <SvgWrapper
                          className={`${styles.arrowRightIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                          svgSrc="arrow-down"
                          style={{
                            display:
                              globalConfig?.header_layout === "double"
                                ? "block"
                                : "none",
                          }}
                        />
                        <SvgWrapper
                          className={`${styles.arrowIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                          svgSrc="arrow-left-long"
                          style={{
                            display:
                              globalConfig?.header_layout !== "double"
                                ? "block"
                                : "none",
                          }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {sidebarl3Nav.state && (
              <ul key="l3_Nav">
                <li
                  onClick={() => goBack("l2")}
                  className={`${styles["sidebar__navigation--item"]} ${
                    styles.title
                  } ${styles.flexAlignCenter} ${styles.justifyStart} ${
                    styles.fontBody
                  } ${isDoubleRowHeader ? styles.b1 : styles.h5}`}
                  style={{ display: sidebarl3Nav.title ? "flex" : "none" }}
                >
                  <SvgWrapper
                    className={`${styles.arrowLeftIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                    svgSrc="arrow-down"
                    style={{
                      display:
                        globalConfig?.header_layout === "double"
                          ? "block"
                          : "none",
                    }}
                  />
                  <SvgWrapper
                    className={`${styles.arrowLeftIcon} ${styles.sidebarIcon} ${styles.menuIcon}`}
                    svgSrc="arrow-left-long"
                    style={{
                      display:
                        globalConfig?.header_layout !== "double"
                          ? "block"
                          : "none",
                    }}
                  />
                  <span>{sidebarl3Nav.title}</span>
                </li>
                {sidebarl3Nav.navigation.map((nav, index) => (
                  <li
                    key={index}
                    className={`${styles["sidebar__navigation--item"]} ${
                      styles.flexAlignCenter
                    } ${styles.justifyBetween} ${styles.fontBody} ${
                      isDoubleRowHeader ? styles.h5 : styles.b1
                    }`}
                  >
                    {convertActionToUrl(nav?.action) ? (
                      <FDKLink
                        to={convertActionToUrl(nav?.action)}
                        className={styles.navLink}
                        onClick={() => {
                          goBack("l2");
                          closeSidebarNav();
                        }}
                      >
                        <p>{nav.display}</p>
                      </FDKLink>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          goBack("l2");
                          closeSidebarNav();
                        }}
                      >
                        {nav.display}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </nav>

          <div className={styles.sidebar__footer}>
            <button
              type="button"
              className={`${styles["sidebar__footer--item"]} ${styles.account} ${styles.flexAlignCenter} ${styles.fontBody} ${styles.h5}`}
              style={{ display: isDoubleRowHeader ? "flex" : "none" }}
              onClick={() => {
                checkLogin("profile_mobile");
                setShowSidebar(false);
              }}
            >
              <SvgWrapper
                className={`${styles.user} ${styles["sidebar-icon"]} ${styles.menuIcon}`}
                svgSrc="user"
              />
              <span>Account</span>
            </button>
            <button
              type="button"
              className={`${styles["sidebar__footer--item"]} ${
                styles.wishlist
              } ${styles.flexAlignCenter} ${styles.fontBody} ${
                isDoubleRowHeader ? styles.h5 : styles.b1
              }`}
              onClick={() => {
                checkLogin("wishlist");
                setShowSidebar(false);
              }}
            >
              <SvgWrapper
                className={`${styles.wishlist} ${styles.menuIcon} ${styles["sidebar-icon"]}`}
                svgSrc="wishlist"
              />
              <span>Wishlist</span>
            </button>
            <button
              type="button"
              className={`${styles["sidebar__footer--item"]} ${
                styles.login
              } ${styles.flexAlignCenter} ${styles.fontBody} ${
                !isDoubleRowHeader ? styles.b1 : ""
              }`}
              style={{ display: !isDoubleRowHeader ? "flex" : "none" }}
              onClick={() => {
                checkLogin(LoggedIn ? "profile_mobile" : "logout");
                setShowSidebar(false);
              }}
            >
              <SvgWrapper
                className={`${styles.user} ${styles.sidebarIcon} ${styles.menuIcon}`}
                svgSrc="user"
              />
              <span>{LoggedIn ? "Account" : "Log in"}</span>
            </button>
            <ul
              className={`${styles.social} ${styles.flexAlignCenter}`}
              style={{
                display:
                  globalConfig?.header_layout === "single" && isSocialLinks
                    ? "flex"
                    : "none",
              }}
            >
              {Object.entries(contactInfo?.social_links || {}).map(
                ([key, item], index) =>
                  item.link && (
                    <li key={index} className={styles.socialIcon} title={key}>
                      <FDKLink
                        to={item.link}
                        target="_blank"
                        title={item.title}
                      >
                        <SvgWrapper
                          className={styles.icon}
                          svgSrc={`nav-${key}`}
                        />
                      </FDKLink>
                    </li>
                  )
              )}
            </ul>
          </div>
        </motion.div>
      </div>
      {/* eslint-disable jsx-a11y/no-static-element-interactions */}
      <div
        className={`${styles.overlay} ${showSidebar ? styles.show : ""} ${
          globalConfig?.header_layout === "double" ? "" : styles.overlaySingle
        }`}
        onClick={closeSidebarNav}
      />
    </div>
  );
}

export default Navigation;
