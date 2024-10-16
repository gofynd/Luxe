import { useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { useEffect, useState } from "react";
import { isRunningOnClient } from "../../helper/utils";

const useHeader = (fpi) => {
  const FOLLOWED_IDS = useGlobalStore(fpi.getters.FOLLOWED_LIST);
  const wishlistIds = FOLLOWED_IDS?.items?.map((m) => m?.uid);
  const wishlistCount = FOLLOWED_IDS?.page?.item_total;

  const NAVIGATION = useGlobalStore(fpi.getters.NAVIGATION);
  const THEME = useGlobalStore(fpi.getters.THEME);
  const CART_ITEMS = useGlobalStore(fpi.getters.CART);
  const CONTACT_INFO = useGlobalStore(fpi.getters.CONTACT_INFO);
  const SUPPORT_INFO = useGlobalStore(fpi.getters.SUPPORT_INFORMATION);
  const [cartItemCount, setCartItemCount] = useState(0);
  const CONFIGURATION = useGlobalStore(fpi.getters.CONFIGURATION);
  const loggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const BUY_NOW = useGlobalStore(fpi.getters.BUY_NOW_CART_ITEMS);
  const HeaderNavigation =
    NAVIGATION?.items?.find((item) =>
      item.orientation.landscape.includes("top")
    )?.navigation || [];
  const FooterNavigation =
    NAVIGATION?.items?.find((item) =>
      item.orientation.landscape.includes("bottom")
    )?.navigation || [];

  const [buyNowParam, setBuyNowParam] = useState(null);
  const location = useLocation();
  useEffect(() => {
    if (isRunningOnClient()) {
      const queryParams = new URLSearchParams(location.search);
      setBuyNowParam((prev) => {
        if (prev === queryParams.get("buy_now")) return prev;
        return queryParams.get("buy_now");
      });
    }
  }, []);

  useEffect(() => {
    const bNowCount = BUY_NOW?.cart?.user_cart_items_count;
    if (bNowCount && buyNowParam) {
      setCartItemCount(bNowCount);
    } else if (CART_ITEMS?.cart_items?.items?.length >= 0) {
      const totalQuantity = CART_ITEMS?.cart_items?.items?.reduce(
        (acc, item) => {
          return acc + (item.quantity || 0);
        },
        0
      );
      setCartItemCount(totalQuantity);
    }
  }, [CART_ITEMS, buyNowParam]);

  return {
    HeaderNavigation: HeaderNavigation?.filter((f) => f?.active) || [],
    // HeaderNavigation: navigation_data?.navigation,
    FooterNavigation: FooterNavigation?.filter((f) => f?.active) || [],
    cartItemCount,
    globalConfig: THEME?.config?.list[0]?.global_config?.custom?.props,
    appInfo: CONFIGURATION.application,
    contactInfo: CONTACT_INFO,
    supportInfo: SUPPORT_INFO,
    wishlistIds,
    wishlistCount,
    loggedIn,
  };
};

export default useHeader;
