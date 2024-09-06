import { useEffect, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import {
  ADDRESS_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  REMOVE_ADDRESS,
} from "../../queries/addressQuery";

const useAddress = (fpi, pageName) => {
  const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  const APP_FEATURES = useGlobalStore(fpi.getters.APP_FEATURES);
  const [mapApiKey, setMapApiKey] = useState("");

  const getFormattedAddress = (addr) => {
    return `${addr.address}, ${addr.area}${addr.landmark.length > 0 ? `, ${addr.landmark}` : ""}${addr.sector ? `, ${addr.sector}` : ""}${addr.city ? `, ${addr.city}` : ""}${addr.area_code ? `, - ${addr.area_code}` : ""}`;
  };

  const fetchAddresses = () => {
    return fpi.executeGQL(ADDRESS_LIST);
  };

  const addAddress = (obj) => {
    const payload = {
      address2Input: {
        ...obj,
      },
    };
    return fpi.executeGQL(ADD_ADDRESS, payload);
  };

  const updateAddress = (data, addressId) => {
    const add = data;
    delete add?.custom_json;
    delete add?.otherAddressType;
    /* eslint-disable no-underscore-dangle */
    delete add?.__typename;
    const payload = {
      id: addressId,
      address2Input: {
        ...add,
      },
    };

    return fpi.executeGQL(UPDATE_ADDRESS, payload);
  };

  const removeAddress = (addressId) => {
    return fpi.executeGQL(REMOVE_ADDRESS, { id: addressId });
  };

  useEffect(() => {
    if (
      INTEGRATION_TOKENS &&
      APP_FEATURES?.[pageName]?.google_map &&
      INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key
    ) {
      setMapApiKey(
        Buffer?.from(
          INTEGRATION_TOKENS?.tokens?.google_map?.credentials?.api_key,
          "base64"
        )?.toString()
      );
    }
  }, [INTEGRATION_TOKENS, APP_FEATURES]);

  return {
    mapApiKey,
    fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    getFormattedAddress,
  };
};

export default useAddress;
