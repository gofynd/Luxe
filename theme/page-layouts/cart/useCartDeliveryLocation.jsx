import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { CART_DETAILS } from "../../queries/cartQuery";
import { LOCALITY } from "../../queries/localityQuery";
import { SELECT_ADDRESS } from "../../queries/checkoutQuery";
import { useAddress, useSnackbar } from "../../helper/hooks/index";

const useCartDeliveryLocation = ({ fpi }) => {
  const navigate = useNavigate();
  const isLoggedIn = useGlobalStore(fpi.getters.LOGGED_IN);
  const CART = useGlobalStore(fpi.getters.CART);
  const { cart_items } = CART || {};
  const [pincode, setPincode] = useState(
    localStorage?.getItem("pincode") || ""
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
    getLocality,
  } = useAddress({ fpi, pageName: "cart" });
  const { showSnackbar } = useSnackbar();

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

  const handlePincodeSubmit = ({ pincode }) => {
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
        localStorage?.setItem("pincode", pincode);
        setPincode(pincode);
        const payload = {
          buyNow: false,
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
      selectCartAddressRequestInput: {
        cart_id,
        id: addrId,
        billing_address_id: addrId,
      },
    };

    fpi.executeGQL(SELECT_ADDRESS, payload).then((res) => {
      if (res?.data?.selectAddress?.is_valid) {
        const selectedAddPincode = findAddress?.area_code;
        localStorage?.setItem("pincode", selectedAddPincode);
        setPincode(selectedAddPincode);
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
  function addAddressCaller(data) {
    addAddress?.(data)?.then((res) => {
      if (res?.data?.addAddress?.success) {
        fetchAddresses().then(() => {
          localStorage?.setItem("pincode", data?.area_code);
          setPincode(data?.area_code);
          closeModal();
          gotoCheckout(res?.data?.addAddress?.id);
        });
      } else {
        showSnackbar("Failed to add an address", "error");
      }
    });
  }
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
  };
};

export default useCartDeliveryLocation;
