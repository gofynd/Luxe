import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import {
  useThemeConfig,
  useToggleState,
  useSnackbar,
  useHyperlocalTat,
} from "../../helper/hooks";
import { isRunningOnClient } from "../../helper/utils";
import { LOCALITY, DELIVERY_PROMISE } from "../../queries/logisticsQuery";

const useHyperlocal = (fpi) => {
  const location = useLocation();
  const { showSnackbar } = useSnackbar();
  const { globalConfig } = useThemeConfig({ fpi });
  const { convertUTCToHyperlocalTat } = useHyperlocalTat({ fpi });
  const [deliveryPromise, setDeliveryPromise] = useState(null);
  const [servicibilityError, setServicibilityError] = useState(null);
  const [isPromiseLoading, setIsPromiseLoading] = useState(true);
  const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  const isInternationalShippingEnabled =
    useGlobalStore(fpi.getters.CONFIGURATION)?.app_features?.common
      ?.international_shipping?.enabled ?? false;
  const pincodeDetails = useGlobalStore(fpi.getters.PINCODE_DETAILS);
  const locationDetails = useGlobalStore(fpi.getters.LOCATION_DETAILS);
  const sellerDetails = JSON.parse(
    useGlobalStore(fpi.getters.SELLER_DETAILS) || "{}"
  );
  const pincode = useMemo(() => {
    if (!isRunningOnClient()) {
      return "";
    }
    return pincodeDetails?.localityValue || locationDetails?.pincode || "";
  }, [pincodeDetails, locationDetails]);

  const {
    is_hyperlocal: isHyperlocal,
    is_mandatory_pincode: isMandatoryPincode,
  } = globalConfig;

  const {
    isOpen: isLocationModalOpen,
    open: handleLocationModalOpen,
    close: locationModalClose,
  } = useToggleState(isMandatoryPincode && !pincode);

  const handleLocationModalClose = () => {
    if (isMandatoryPincode && !pincode) {
      return;
    }
    locationModalClose();
  };

  const deliveryMessage = useMemo(() => {
    if (servicibilityError) {
      return "Product not serviceable";
    }
    if (!deliveryPromise?.min) {
      return "";
    }
    return convertUTCToHyperlocalTat(deliveryPromise?.min);
  }, [deliveryPromise, servicibilityError, convertUTCToHyperlocalTat]);

  const fetchDeliveryPromise = () => {
    setServicibilityError(null);
    return fpi.executeGQL(DELIVERY_PROMISE, null).then((response) => {
      if (response?.errors) {
        throw response?.errors?.[0];
      }
      setDeliveryPromise(response.data.deliveryPromise.promise);
      return response;
    });
  };

  const fetchLocality = (pincode) => {
    const payload = {
      locality: "pincode",
      localityValue: pincode,
      country: "IN",
    };

    return fpi.executeGQL(LOCALITY, payload).then((response) => {
      if (response?.errors) {
        throw response?.errors?.[0];
      }
      return response;
    });
  };

  const handleCurrentLocClick = () => {
    if (!navigator || !("geolocation" in navigator)) {
      showSnackbar("Geolocation is not available.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const API_KEY = Buffer?.from(
          INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key,
          "base64"
        )?.toString();

        if (!API_KEY) {
          showSnackbar("API key not available.", "error");
          return;
        }

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${API_KEY}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            let postalCode = null;
            for (const address of data.results) {
              const postalCodeComponent = address.address_components.find(
                (component) => component.types.includes("postal_code")
              );
              if (postalCodeComponent) {
                postalCode = postalCodeComponent;
                break;
              }
            }
            if (postalCode) {
              handlePincodeSubmit({ pincode: postalCode.long_name });
            }
          }
        } catch (error) {
          showSnackbar(error.message, "error");
        }
      },
      (err) => {
        showSnackbar(err.message, "error");
      }
    );
  };

  const handlePincodeSubmit = async ({ pincode: newPincode }) => {
    try {
      await fetchLocality(newPincode);
      if (newPincode === pincode) {
        fetchDeliveryPromise()
          .then(() => {
            handleLocationModalClose();
          })
          .catch((error) => {
            setServicibilityError({
              message: error?.message || "Something went wrong",
            });
          });
      }
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  };

  useEffect(() => {
    if (isHyperlocal && pincode) {
      fetchDeliveryPromise()
        .then(() => {
          handleLocationModalClose();
        })
        .catch((error) => {
          setServicibilityError({
            message: error?.message || "Something went wrong",
          });
        })
        .finally(() => {
          setIsPromiseLoading(false);
        });
    } else {
      setIsPromiseLoading(false);
    }
  }, [isHyperlocal, pincode]);

  return {
    isHyperlocal: useMemo(() => {
      const regexPattern =
        /^(\/cart\/checkout|\/profile\/orders(\/shipment\/\w+)?)$/;
      if (regexPattern.test(location.pathname)) {
        return false;
      }
      return isHyperlocal;
    }, [location.pathname, isHyperlocal]),
    isLoading: isPromiseLoading,
    pincode,
    deliveryMessage,
    servicibilityError,
    isLocationModalOpen,
    handleLocationModalOpen,
    handleLocationModalClose,
    handleCurrentLocClick,
    handlePincodeSubmit,
  };
};

export default useHyperlocal;
