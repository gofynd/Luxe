import { useEffect, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import {
  CHECKOUT_LANDING,
  FETCH_SHIPMENTS,
  SELECT_ADDRESS,
} from "../../../queries/checkoutQuery";
import { useSnackbar } from "../../../helper/hooks";
import { LOCALITY } from "../../../queries/logisticsQuery";
import { capitalize } from "../../../helper/utils";

const useAddress = (setShowShipment, setShowPayment, fpi) => {
  const allAddresses = useGlobalStore(fpi.getters.ADDRESS)?.address || [];
  const isAddressLoading =
    useGlobalStore(fpi.getters.ADDRESS)?.loading || false;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const cart_id = searchParams.get("id");
  const address_id = searchParams.get("address_id");
  const [selectedAddressId, setSelectedAddressId] = useState(address_id || "");
  const [invalidAddressError, setInvalidAddressError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [isNewAddress, setIssNewAddress] = useState(true);
  const [addressItem, setAddressItem] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [addressLoader, setAddressLoader] = useState(false);

  const getDefaultAddress =
    allAddresses?.filter((item) => item?.is_default_address) || [];
  const getOtherAddress =
    allAddresses?.filter((item) => !item?.is_default_address) || [];

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (address_id) {
      // setSelectedAddressId(id);
      return;
    }
    if (getDefaultAddress.length && !selectedAddressId) {
      setSelectedAddressId(getDefaultAddress?.[0].id);
    } else if (getOtherAddress.length && !selectedAddressId) {
      setSelectedAddressId(getOtherAddress?.[0]?.id);
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [allAddresses, address_id]);

  useEffect(() => {
    const { autoNaviagtedFromCart, addrId } = location?.state ?? {};
    if (autoNaviagtedFromCart && addrId) {
      fpi
        .executeGQL(FETCH_SHIPMENTS, {
          addressId: `${addrId.length ? addrId : selectedAddressId}`,
          id: `${cart_id}`,
        })
        .then(() => {
          setShowShipment(true);
          navigate(location.pathname, { replace: true, state: null });
        });
    }
  }, [location.state, navigate]);

  const resetAddressState = () => {
    setOpenModal(false);
    setIssNewAddress(true);
    setAddressItem(false);
    setModalTitle("");
  };

  const editAddress = (item) => {
    setModalTitle("Edit Address");
    setAddressItem(item);
    setIssNewAddress(false);
    setOpenModal(true);
  };

  const addAddress = (obj) => {
    setAddressLoader(true);
    const payload = {
      address2Input: {
        ...obj,
      },
    };
    fpi
      .executeGQL(
        `mutation AddAddress($address2Input: Address2Input) {
          addAddress(address2Input: $address2Input) {
          id
          is_default_address
          success
        }
    }`,
        payload
      )
      .then((res) => {
        setAddressLoader(false);
        if (res?.data?.addAddress?.success) {
          showSnackbar("Address added successfully", "success");
          resetAddressState();
          fpi
            .executeGQL(CHECKOUT_LANDING, { includeBreakup: true })
            .then(() => {
              selectAddress(res?.data?.addAddress?.id);
            });
          setAddressLoader(false);
        } else {
          fpi.executeGQL(CHECKOUT_LANDING, { includeBreakup: true });
          showSnackbar("Failed to create new address", "error");
          resetAddressState();
          setAddressLoader(false);
        }
      });
  };

  const updateAddress = (obj) => {
    const add = obj;
    delete add?.custom_json;
    delete add?.otherAddressType;
    /* eslint-disable no-underscore-dangle */
    delete add?.__typename;

    const payload = {
      id: selectedAddressId,
      address2Input: {
        ...add,
      },
    };

    fpi
      .executeGQL(
        `mutation UpdateAddress($address2Input: Address2Input, $id: String) {
        updateAddress(address2Input: $address2Input, id: $id) {
        id
        is_default_address
        success
        is_updated
        }
    }`,
        payload
      )
      .then((res) => {
        if (res?.data?.updateAddress?.success) {
          fpi
            .executeGQL(CHECKOUT_LANDING, { includeBreakup: true })
            .then(() => selectAddress());
          showSnackbar("Address updated successfully", "success");
          resetAddressState();
        } else {
          fpi.executeGQL(CHECKOUT_LANDING, { includeBreakup: true });
          showSnackbar("Failed to update an address", "error");
          resetAddressState();
        }
      });
  };

  const removeAddress = () => {
    fpi
      .executeGQL(
        `
    mutation RemoveAddress($id: String) {
        removeAddress(id: $id){
            id
            is_deleted
        }
    }`,
        { id: selectedAddressId }
      )
      .then((res) => {
        if (res?.data?.removeAddress?.is_deleted) {
          fpi.executeGQL(CHECKOUT_LANDING, { includeBreakup: true });
          showSnackbar("Address deleted successfully", "success");
        } else {
          fpi.executeGQL(CHECKOUT_LANDING, { includeBreakup: true });
          showSnackbar("Failed to delete an address", "error");
          resetAddressState();
        }
      });
  };

  const updateQuery = (key, value) => {
    const queryParamKey = key; // Replace with your desired query parameter key
    const queryParamValue = value; // Replace with your desired query parameter value

    const searchParameter = new URLSearchParams(location.search);
    const existingValue = searchParameter.get(queryParamKey);

    if (existingValue !== null) {
      // Key already exists, update the value
      searchParameter.set(queryParamKey, queryParamValue);
    } else {
      // Key doesn't exist, add the new query parameter
      searchParameter.append(queryParamKey, queryParamValue);
    }

    const updatedSearch = searchParameter.toString();
    navigate({ search: updatedSearch });
  };

  const selectAddress = (id = "") => {
    const findAddress = allAddresses.find(
      (item) => item?.id === selectedAddressId
    );
    const payload = {
      cartId: cart_id,
      selectCartAddressRequestInput: {
        cart_id,
        id: id.length ? id : findAddress?.id,
        billing_address_id: id.length ? id : findAddress?.id,
      },
    };

    fpi.executeGQL(SELECT_ADDRESS, payload).then((res) => {
      if (res?.data?.selectAddress?.is_valid) {
        updateQuery("address_id", id.length ? id : selectedAddressId);
        fpi.executeGQL(FETCH_SHIPMENTS, {
          addressId: `${id.length ? id : selectedAddressId}`,
          id: `${cart_id}`,
        });
        setShowShipment(true);
        setAddressLoader(false);
        setInvalidAddressError(null);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        setInvalidAddressError({
          id: id.length ? id : findAddress?.id,
          message: res?.data?.selectAddress?.message,
        });
        showSnackbar("Failed to select an address", "error");
      }
    });
  };

  const removeQuery = (key) => {
    const queryParamKeyToRemove = key; // Replace with the query parameter key to remove

    const searchParam = new URLSearchParams(location.search);
    searchParam.delete(queryParamKeyToRemove);

    const updatedSearch = searchParam.toString();

    navigate({ search: updatedSearch });
  };

  function backToEdit() {
    removeQuery("address_id");
    setShowShipment(false);
    setShowPayment(false);
  }

  function showAddNewAddressModal() {
    setModalTitle("Add New Address");
    setOpenModal(true);
  }

  function getLocality(postcode) {
    return fpi
      .executeGQL(LOCALITY, {
        locality: `pincode`,
        localityValue: `${postcode}`,
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
  }

  return {
    allAddresses,
    addressItem,
    selectedAddressId,
    invalidAddressError,
    getDefaultAddress,
    getOtherAddress,
    isAddressLoading,
    addressLoader,
    modalTitle,
    openModal,
    isNewAddress,
    setOpenModal,
    setModalTitle,
    setAddressItem,
    setIssNewAddress,
    resetAddressState,
    editAddress,
    addAddress,
    removeAddress,
    updateAddress,
    selectAddress,
    backToEdit,
    showAddNewAddressModal,
    setSelectedAddressId,
    getLocality,
  };
};

export default useAddress;
