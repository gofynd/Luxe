import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { CART_DETAILS } from "../../queries/cartQuery";
import { LOCALITY } from "../../queries/localityQuery";
import { SELECT_ADDRESS } from "../../queries/checkoutQuery";
import {
  useAddress,
  useSnackbar,
  useAddressFormSchema,
} from "../../helper/hooks";
import useInternational from "../../components/header/useInternational";
import { capitalize } from "../../helper/utils";

const useCartDeliveryLocation = ({ fpi }) => {
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);
  const isLoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const CART = useGlobalStore(fpi.getters.CART);
  const { cart_items } = CART || {};
  const [pincode, setPincode] = useState(
    (pincodeDetails?.localityValue ?? locationDetails?.pincode) || ""
  );
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [addrError, setAddrError] = useState(null);
  const {
    fetchAddresses,
    allAddress = [],
    defaultAddress,
    otherAddresses = [],
    addAddress,
    mapApiKey,
    showGoogleMap,
  } = useAddress({ fpi, pageName: "cart" });
  const { showSnackbar } = useSnackbar();

  const buyNow = JSON.parse(searchParams?.get("buy_now") || "false");

  useEffect(() => {
    if (!allAddress?.length) {
      fetchAddresses();
    }
  }, []);

  useEffect(() => {
    if (defaultAddress?.id && !selectedAddressId) {
      setSelectedAddressId(defaultAddress.id);
    } else if (otherAddresses?.length && !selectedAddressId) {
      setSelectedAddressId(otherAddresses?.[0]?.id);
    }
  }, [allAddress]);

  const {
    countries,
    fetchCountrieDetails,
    countryDetails,
    currentCountry,
    isInternational,
  } = useInternational({
    fpi,
  });
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const [countrySearchText, setCountrySearchText] = useState("");

  useEffect(() => {
    if (currentCountry) {
      setSelectedCountry(currentCountry);
    }
  }, [currentCountry]);

  useEffect(() => {
    fetchCountrieDetails({
      countryIsoCode: selectedCountry?.iso2 ?? countries?.[0]?.iso2,
    });
  }, [selectedCountry]);

  const { formSchema, defaultAddressItem } = useAddressFormSchema({
    fpi,
    countryCode: selectedCountry?.phone_code,
    countryIso: selectedCountry?.iso2,
    addressTemplate: countryDetails?.fields?.address_template?.checkout_form,
    addressFields: countryDetails?.fields?.address,
  });

  function convertDropDownField(inputField) {
    return {
      key: inputField.display_name,
      display: inputField.display_name,
    };
  }

  const setI18nDetails = (e) => {
    const selectedCountry = countries.find(
      (country) => country.display_name === e
    );
    setSelectedCountry(selectedCountry);
  };

  const handleCountrySearch = (event) => {
    setCountrySearchText(event);
  };

  const getFilteredCountries = (selectedCountry) => {
    if (!countrySearchText) {
      return countries.map((country) => convertDropDownField(country)) || [];
    }
    return countries?.filter(
      (country) =>
        country?.display_name
          ?.toLowerCase()
          ?.indexOf(countrySearchText?.toLowerCase()) !== -1 &&
        country?.id !== selectedCountry?.id
    );
  };

  const getLocality = (posttype, postcode) => {
    return fpi
      .executeGQL(LOCALITY, {
        locality: posttype,
        localityValue: `${postcode}`,
        country: selectedCountry?.iso2,
      })
      .then((res) => {
        const data = { showError: false, errorMsg: "" };
        const localityObj = res?.data?.locality || false;
        if (localityObj) {
          localityObj?.localities.forEach((locality) => {
            switch (locality.type) {
              case "city":
                data.city = capitalize(locality.display_name);
                break;
              case "state":
                data.state = capitalize(locality.display_name);
                break;
              case "country":
                data.country = capitalize(locality.display_name);
                break;
              default:
                break;
            }
          });

          return data;
        } else {
          showSnackbar(
            res?.errors?.[0]?.message || "Pincode verification failed"
          );
          data.showError = true;
          data.errorMsg =
            res?.errors?.[0]?.message || "Pincode verification failed";
          return data;
        }
      });
  };

  function handleButtonClick() {
    if (isLoggedIn) {
      setIsAddressModalOpen(true);
    } else {
      setIsPincodeModalOpen(true);
    }
  }
  function handleAddButtonClick() {
    setIsAddressModalOpen(false);
    setIsAddAddressModalOpen(true);
  }

  function closeModal() {
    setIsAddressModalOpen(false);
    setIsPincodeModalOpen(false);
    setIsAddAddressModalOpen(false);
    setError(null);
  }
  function gotoCheckout(id) {
    if (cart_items?.id && id) {
      navigate({
        pathname: "/cart/checkout",
        search: `id=${cart_items?.id}&address_id=${id}`,
        state: {
          autoNaviagtedFromCart: true,
          addrId: id,
        },
      });
    } else {
      navigate({
        pathname: "/cart/bag",
      });
    }
  }

  const handlePincodeSubmit = ({ posttype, pincode }) => {
    const deliveryPayload = {
      locality: "pincode",
      localityValue: pincode?.toString(),
    };
    fpi
      .executeGQL(LOCALITY, deliveryPayload)
      .then((res) => {
        if (res.errors) {
          throw res?.errors?.[0];
        }
        const payload = {
          buyNow,
          includeAllItems: true,
          includeCodCharges: true,
          includeBreakup: true,
          areaCode: pincode.toString(),
        };
        fpi.executeGQL(CART_DETAILS, payload);
        closeModal();
        return res?.data?.locality;
      })
      .catch((err) => {
        setError({ message: err.message });
      });
  };

  function getFormattedAddress(addrs) {
    const addressParts = [
      addrs.address,
      addrs.area,
      addrs.landmark,
      addrs.sector,
      addrs.city,
      addrs.area_code ? `- ${addrs.area_code}` : "",
    ];

    return addressParts.filter(Boolean).join(", ");
  }

  const selectedAddressString = useMemo(() => {
    if (selectedAddress) {
      return getFormattedAddress(selectedAddress);
    }
    if (defaultAddress?.id) {
      return getFormattedAddress(defaultAddress);
    }
    return "";
  }, [selectedAddress, defaultAddress]);

  const personName = useMemo(() => {
    if (selectedAddress) {
      return selectedAddress.name;
    }
    if (defaultAddress?.id) {
      return defaultAddress.name;
    }
    return "";
  }, [selectedAddress, defaultAddress]);

  const selectAddress = (id = "") => {
    const findAddress = allAddress.find(
      (item) => item?.id === selectedAddressId
    );
    if (!cart_items?.id) {
      showSnackbar("Failed to select an address", "error");
      return;
    }
    const cart_id = cart_items?.id;
    const addrId = id.length ? id : findAddress?.id;
    const payload = {
      cartId: cart_id,
      buyNow,
      selectCartAddressRequestInput: {
        cart_id,
        id: addrId,
        billing_address_id: addrId,
      },
    };

    fpi.executeGQL(SELECT_ADDRESS, payload).then((res) => {
      if (res?.data?.selectAddress?.is_valid) {
        const selectedAddPincode = findAddress?.area_code;
        // setPincode(selectedAddPincode);
        closeModal();
        gotoCheckout(addrId);
        setAddrError(null);
      } else {
        const errMsg =
          res?.data?.selectAddress?.message || "Failed to select an address";
        setAddrError({ id: addrId, message: errMsg });
        showSnackbar(errMsg, "error");
      }
    });
  };
  const setI18NDetails = () => {
    const cookiesData = JSON.stringify({
      currency: { code: selectedCountry?.currency?.code },
      country: {
        iso_code: selectedCountry?.iso2,
        isd_code: selectedCountry?.phone_code,
      },
      display_name: selectedCountry?.display_name,
      countryCode: selectedCountry?.country?.iso2,
    });
    fpi.setI18nDetails(cookiesData);
  };
  function addAddressCaller(data) {
    if (
      data?.geo_location?.latitude === "" &&
      data?.geo_location?.longitude === ""
    ) {
      delete data.geo_location;
    }
    for (const key in data) {
      if (data[key] === undefined) {
        delete data[key]; // Removes undefined values directly from the original object
      }
    }
    data.country_phone_code = `+${data.phone.countryCode}`;
    data.phone = data.phone.mobile;
    fpi.setI18nDetails({ countryCode: countryDetails?.iso2 });
    addAddress?.(data)?.then((res) => {
      if (res?.data?.addAddress?.success) {
        setI18NDetails();
        fetchAddresses().then(() => {
          // setPincode(data?.area_code);
          closeModal();
          gotoCheckout(res?.data?.addAddress?.id);
        });
      } else {
        showSnackbar(
          res?.errors?.[0]?.message ?? "Failed to add an address",
          "error"
        );
      }
    });
  }

  useEffect(() => {
    setPincode(
      (pincodeDetails?.localityValue ?? locationDetails?.pincode) || ""
    );
  }, [pincodeDetails, locationDetails]);

  return {
    pincode,
    error,
    isPincodeModalOpen,
    isAddressModalOpen,
    onAddButtonClick: handleAddButtonClick,
    onChangeButtonClick: handleButtonClick,
    onPincodeSubmit: handlePincodeSubmit,
    onCloseModalClick: closeModal,
    defaultAddress: defaultAddress ? [defaultAddress] : [],
    otherAddresses,
    selectedAddressId,
    setSelectedAddressId,
    addAddress: addAddressCaller,
    mapApiKey,
    showGoogleMap,
    getLocality,
    isAddAddressModalOpen,
    selectAddress,
    addrError,
    isInternationalShippingEnabled: isInternational,
    addressFormSchema: formSchema,
    addressItem: defaultAddressItem,
    setI18nDetails,
    handleCountrySearch,
    getFilteredCountries,
    selectedCountry,
    countryDetails,
  };
};

export default useCartDeliveryLocation;
