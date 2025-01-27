import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import {
  ADD_TO_CART,
  CHECK_PINCODE,
  GET_PRODUCT_DETAILS,
  OFFERS,
  PRODUCT_SIZE_PRICE,
} from "../../../queries/pdpQuery";
import useHeader from "../../../components/header/useHeader";
import {
  ADD_WISHLIST,
  CART_ITEMS_COUNT,
  FOLLOWED_PRODUCTS_IDS,
  REMOVE_WISHLIST,
} from "../../../queries/wishlistQuery";
import { useSnackbar, useThemeConfig } from "../../../helper/hooks";
import { LOCALITY } from "../../../queries/logisticsQuery";
import { isEmptyOrNull } from "../../../helper/utils";
import { fetchCartDetails } from "../../cart/useCart";

const useProductDescription = (fpi, slug, props, blockProps) => {
  const { mandatory_pincode } = props;
  const isIntlShippingEnabled =
    useGlobalStore(fpi.getters.CONFIGURATION)?.app_features?.common
      ?.international_shipping?.enabled ?? false;
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);
  const PRODUCT = useGlobalStore(fpi.getters.PRODUCT);
  const LoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const COUPONS = useGlobalStore(fpi.getters.COUPONS);
  const PROMOTION_OFFERS = useGlobalStore(fpi.getters.PROMOTION_OFFERS); // Currently not storing offers on PDP, using custom store for now
  const { isPdpSsrFetched, isI18ModalOpen, productPromotions } = useGlobalStore(
    fpi?.getters?.CUSTOM_VALUE
  );
  const { globalConfig } = useThemeConfig({ fpi });

  let sellerDetails = useGlobalStore(fpi.getters.i18N_DETAILS);
  if (typeof sellerDetails === "string" && sellerDetails !== "") {
    sellerDetails = JSON.parse(sellerDetails);
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPincode, setCurrentPincode] = useState(
    locationDetails?.pincode || ""
  );
  const [currentSize, setCurrentSize] = useState(null);
  const [followed, setFollowed] = useState(false);
  const [selectPincodeError, setSelectPincodeError] = useState(false);
  const [pincodeErrorMessage, setPincodeErrorMessage] = useState("");
  const { product_details, product_meta, product_price_by_slug } = PRODUCT;
  const { sizes, loading: productMetaLoading } = product_meta || {};
  const { loading: productDetailsLoading } = product_details || {};
  const [isPageLoading, setIsPageLoading] = useState(!isPdpSsrFetched);

  const { wishlistIds } = useHeader(fpi);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPriceBySize, setIsLoadingPriceBySize] = useState(false);
  const locationPincode = locationDetails?.pincode || "";
  // const isLoading =
  //   productMetaLoading ||
  //   productDetailsLoading ||
  //   productPriceBySlugLoading ||
  //   false;

  useEffect(() => {
    if (!isPdpSsrFetched || slug !== PRODUCT?.product_details?.slug) {
      setIsLoading(true);
      const values = {
        slug,
      };
      fpi
        .executeGQL(GET_PRODUCT_DETAILS, values)
        .then((res) => {
          if (res) {
            fpi.custom.setValue(
              "productPromotions",
              res?.data?.promotions || {}
            );
          }
        })
        .finally(() => {
          setIsLoading(false);
          setIsPageLoading(false);
        });
    }
  }, [slug]);

  useEffect(() => {
    fpi.custom.setValue("isPdpSsrFetched", false);
  }, []);

  useEffect(() => {
    setFollowed(wishlistIds?.includes(product_details?.uid));
  }, [LoggedIn, wishlistIds, product_details]);

  const updateIntlLocation = () => {
    // console.log("update country");
  };

  const fetchProductPrice = () => {
    if (currentSize !== null && locationPincode.length < 6) {
      const values = {
        slug,
        size: currentSize?.value.toString(),
        pincode: "",
      };
      setIsLoadingPriceBySize(true);
      fpi.executeGQL(PRODUCT_SIZE_PRICE, values).then((res) => {
        setIsLoadingPriceBySize(false);
        return res;
      });
    } else if (
      currentSize !== null &&
      mandatory_pincode?.value &&
      locationPincode.length === 6
    ) {
      setIsLoadingPriceBySize(true);
      const values = {
        slug,
        size: currentSize?.value.toString(),
        pincode: locationPincode.toString() || "",
      };
      setTimeout(() => {
        fpi.executeGQL(PRODUCT_SIZE_PRICE, values).then((res) => {
          setIsLoadingPriceBySize(false);
          if (isEmptyOrNull(res.data.productPrice)) {
            setPincodeErrorMessage(
              "Product is not serviceable at given locality"
            );
          } else {
            setSelectPincodeError(false);
            setPincodeErrorMessage("");
          }
        });
      }, 700);
    }
  };

  useEffect(() => {
    if (locationPincode && currentPincode !== locationPincode) {
      setCurrentPincode(locationPincode);
    }
    if (
      Object.keys?.(PRODUCT?.product_details)?.length &&
      slug === PRODUCT?.product_details?.slug
    ) {
      fetchProductPrice();
    }
  }, [currentSize, locationDetails]);

  function addToWishList(event) {
    if (event) {
      event.stopPropagation();
    }
    if (!LoggedIn) {
      showSnackbar("Please Login first.");
      navigate("/auth/login");
      return;
    }
    const values = {
      collectionType: "products",
      collectionId: product_details?.uid?.toString(),
    };
    fpi.executeGQL(ADD_WISHLIST, values).then((OutRes) => {
      if (OutRes?.data?.followById?.message) {
        fpi.executeGQL(FOLLOWED_PRODUCTS_IDS, null).then((res) => {
          showSnackbar(
            OutRes?.data?.followById?.message || "Added to Wishlist",
            "success"
          );
        });
      }
    });
  }

  function removeFromWishlist(event) {
    if (event) {
      event.stopPropagation();
    }
    const values = {
      collectionType: "products",
      collectionId: product_details?.uid?.toString(),
    };
    fpi.executeGQL(REMOVE_WISHLIST, values).then((OutRes) => {
      if (OutRes?.data?.unfollowById?.message) {
        fpi.executeGQL(FOLLOWED_PRODUCTS_IDS, null).then((res) => {
          showSnackbar(
            OutRes?.data?.followById?.message || "Removed from Wishlist",
            "success"
          );
        });
      }
    });
  }

  const checkPincode = (postCode) => {
    fpi
      .executeGQL(LOCALITY, {
        locality: `pincode`,
        localityValue: `${postCode}`,
      })
      .then((res) => {
        if (res?.data?.locality) {
          fetchProductPrice();
        } else {
          setPincodeErrorMessage(
            res?.errors?.[0]?.message || "Pincode verification failed"
          );
        }
      });
  };

  function getQty() {
    const moq = product_details?.moq || false;

    const availableQty = currentSize?.quantity;
    if (moq) {
      return availableQty > moq?.increment_unit
        ? moq?.increment_unit
        : (moq?.minimum ?? 1);
    }
  }

  function addProductForCheckout(event, size, buyNow = false) {
    if (event) {
      event.stopPropagation();
    }
    if (
      !isIntlShippingEnabled &&
      mandatory_pincode?.value &&
      (locationPincode.length !== 6 || pincodeErrorMessage.length)
    ) {
      setSelectPincodeError(true);
      setPincodeErrorMessage("");
      showSnackbar(
        "Please enter valid Pincode before Add to cart/ Buy now",
        "error"
      );
      return;
    }
    if (
      !isIntlShippingEnabled &&
      !mandatory_pincode?.value &&
      ((locationPincode.length > 0 && locationPincode.length < 6) ||
        pincodeErrorMessage.length)
    ) {
      setSelectPincodeError(true);
      setPincodeErrorMessage("");
      showSnackbar(
        "Please enter valid Pincode before Add to cart/ Buy now",
        "error"
      );
      return;
    }
    if (
      !isIntlShippingEnabled &&
      !mandatory_pincode?.value &&
      (!locationPincode.length || !locationPincode.length === 6) &&
      !pincodeErrorMessage.length
    ) {
      setSelectPincodeError(false);
      setPincodeErrorMessage("");
    }

    if (!size) {
      showSnackbar("Please select the size first.", "error");
      return;
    }
    if (product_price_by_slug !== null) {
      const payload = {
        buyNow,
        areaCode: locationPincode.toString(),
        addCartRequestInput: {
          items: [
            {
              article_assignment: {
                level: `${product_price_by_slug?.article_assignment?.level}`,
                strategy: `${product_price_by_slug?.article_assignment?.strategy}`,
              },
              article_id: product_price_by_slug?.article_id?.toString(),
              item_id: product_details?.uid,
              item_size: size?.toString(),
              quantity: getQty(),
              seller_id: product_price_by_slug?.seller?.uid,
              store_id: product_price_by_slug?.store?.uid,
            },
          ],
        },
      };
      return fpi.executeGQL(ADD_TO_CART, payload).then((outRes) => {
        if (outRes?.data?.addItemsToCart?.success) {
          // fpi.executeGQL(CART_ITEMS_COUNT, null).then((res) => {
          if (!buyNow) {
            fetchCartDetails(fpi);
          }
          showSnackbar(
            outRes?.data?.addItemsToCart?.message || "Added to Cart",
            "success"
          );
          if (buyNow) {
            navigate(
              `/cart/checkout/?buy_now=true&id=${outRes?.data?.addItemsToCart?.cart?.id}`
            );
          }
          // });
        } else {
          showSnackbar(
            outRes?.data?.addItemsToCart?.message || "Failed to add to cart",
            "error"
          );
        }
        return outRes;
      });
    }
  }

  const moq = product_details?.moq;
  const incrementDecrementUnit = moq?.increment_unit ?? 1;
  const maxCartQuantity = Math.min(
    moq?.maximum || Number.POSITIVE_INFINITY,
    currentSize?.quantity || 0
  );
  const minCartQuantity = moq?.minimum || 1;

  return {
    productDetails: product_details || {},
    productMeta: product_meta?.sizes || {},
    productPriceBySlug: product_price_by_slug || null,
    currentImageIndex,
    currentSize,
    currentPincode,
    coupons: COUPONS?.available_coupon_list || [],
    promotions: productPromotions?.available_promotions || [],
    isLoading,
    isPageLoading,
    isLoadingPriceBySize,
    globalConfig,
    followed,
    selectPincodeError,
    pincodeErrorMessage,
    isIntlShippingEnabled,
    sellerDetails,
    updateIntlLocation,
    setCurrentSize,
    setCurrentImageIndex,
    setCurrentPincode,
    addToWishList,
    removeFromWishlist,
    addProductForCheckout,
    checkPincode,
    setPincodeErrorMessage,
    isI18ModalOpen,
    pincodeDetails,
    locationDetails,
    incrementDecrementUnit,
    maxCartQuantity,
    minCartQuantity,
  };
};

export default useProductDescription;
