import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { LOCALITY } from "../../queries/logisticsQuery";
import useAddress from "../address/useAddress";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import EmptyState from "../../components/empty-state/empty-state";
import Loader from "../../components/loader/loader";
import { useSnackbar } from "../../helper/hooks";
import { capitalize } from "../../helper/utils";
import styles from "./profile-address-page.less";
import AddressForm from "fdk-react-templates/components/address-form/address-form";
import AddressItem from "fdk-react-templates/components/address-item/address-item";
import "fdk-react-templates/components/address-form/address-form.css";
import "fdk-react-templates/components/address-item/address-item.css";

const DefaultAddress = () => {
  return <span className={styles.defaultAdd}>Default</span>;
};

const ProfileAddressPage = ({ fpi }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location?.search);
  const allAddresses = useGlobalStore(fpi.getters.ADDRESS)?.address || [];
  const {
    mapApiKey,
    fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress,
    getFormattedAddress,
  } = useAddress(fpi, "cart");

  const { showSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoader, setAddressLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchAddresses().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setSelectedAddress(null);
    const queryEdit = searchParams.get("edit");
    const queryAddressId = searchParams.get("address_id");
    if (queryEdit) {
      if (queryAddressId) {
        setSelectedAddress(
          allAddresses?.find((add) => add.id === queryAddressId)
        );
        setIsCreateMode(false);
        setIsEditMode(true);
      } else {
        setIsCreateMode(true);
        setIsEditMode(false);
      }
    } else {
      setIsEditMode(false);
      setIsCreateMode(false);
    }
  }, [searchParams, allAddresses]);

  const navigateToLocation = (replace = true) => {
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace,
    });
  };
  const resetPage = () => {
    searchParams.delete("edit");
    searchParams.delete("address_id");
    navigateToLocation();
  };
  const onCreateClick = () => {
    searchParams.set("edit", true);
    navigateToLocation(false);
  };
  const onEditClick = (addressId) => {
    searchParams.set("edit", true);
    searchParams.set("address_id", addressId);
    navigateToLocation(false);
  };
  const onCancelClick = () => {
    resetPage();
  };
  const addAddressHandler = (obj) => {
    setAddressLoader(true);
    addAddress(obj).then((res) => {
      setAddressLoader(false);
      if (res?.data?.addAddress?.success) {
        showSnackbar("Address added successfully", "success");
        fetchAddresses();
        resetPage();
      } else {
        showSnackbar("Failed to create new address", "error");
      }
    });
  };

  const updateAddressHandler = (obj) => {
    setAddressLoader(true);
    updateAddress(obj, selectedAddress?.id).then((res) => {
      setAddressLoader(false);
      if (res?.data?.updateAddress?.success) {
        showSnackbar("Address updated successfully", "success");
        fetchAddresses();
        resetPage();
      } else {
        showSnackbar("Failed to update an address", "error");
      }
    });
  };

  const removeAddressHandler = (id) => {
    setAddressLoader(true);
    removeAddress(id).then((res) => {
      setAddressLoader(false);
      if (res?.data?.removeAddress?.is_deleted) {
        showSnackbar("Address deleted successfully", "success");
        fetchAddresses();
        resetPage();
      } else {
        showSnackbar("Failed to delete an address", "error");
      }
    });
  };

  const getLocality = (postcode) => {
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
                data.city = capitalize(locality.name);
                break;
              case "state":
                data.state = capitalize(locality.name);
                break;
              case "country":
                data.country = capitalize(locality.name);
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

  const customFooter = (
    <div className={styles.actionBtns}>
      {!isEditMode ? (
        <button
          disabled={addressLoader}
          className={`${styles.commonBtn} ${styles.btn}`}
          type="submit"
        >
          SAVE
        </button>
      ) : (
        <button
          disabled={addressLoader}
          className={`${styles.commonBtn} ${styles.btn}`}
          type="submit"
        >
          UPDATE ADDRESS
        </button>
      )}
      {!isEditMode ? (
        <button
          type="button"
          className={`${styles.commonBtn} ${styles.btn} ${styles.cancelBtn}`}
          onClick={onCancelClick}
        >
          CANCEL
        </button>
      ) : (
        <button
          disabled={addressLoader}
          type="button"
          className={`${styles.commonBtn} ${styles.btn} ${styles.cancelBtn}`}
          onClick={() => removeAddressHandler(selectedAddress?.id)}
        >
          REMOVE
        </button>
      )}
    </div>
  );

  return (
    <div className={styles.main}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {!isEditMode && !isCreateMode ? (
            <div>
              <div className={styles.addressContainer}>
                <div className={styles.addressHeader}>
                  <div className={`${styles.title} ${styles["bold-md"]}`}>
                    MY ADDRESSES
                    <span
                      className={`${styles.savedAddress} ${styles["bold-xxs"]}`}
                    >
                      {allAddresses?.length ?? 0} Saved
                    </span>
                  </div>
                  <div
                    className={`${styles.addAddr} ${styles["bold-md"]}`}
                    onClick={onCreateClick}
                  >
                    ADD NEW ADDRESS
                  </div>
                </div>
              </div>
              {allAddresses.length > 0 && (
                <div className={styles.addressItemContainer}>
                  {allAddresses.map((item, index) => (
                    <AddressItem
                      key={index}
                      onAddressSelect={onEditClick}
                      addressItem={item}
                      headerRightSlot={
                        item?.is_default_address && <DefaultAddress />
                      }
                      containerClassName={styles.addressItem}
                      style={{ border: "none" }}
                    />
                  ))}
                </div>
              )}

              {allAddresses && allAddresses.length === 0 && (
                <div>
                  <EmptyState title="No address available" />
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className={styles.addressContainer}>
                <div className={styles.addressHeader}>
                  {!isEditMode ? (
                    <div className={`${styles.title} ${styles["bold-md"]}`}>
                      Add New Address
                    </div>
                  ) : (
                    <div className={`${styles.title} ${styles["bold-md"]}`}>
                      Update Address
                    </div>
                  )}
                </div>
              </div>
              {isEditMode && !selectedAddress ? (
                <EmptyState
                  title="Address not found!"
                  btnTitle="RETURN TO MY ADDRESS"
                  btnLink={location.pathname}
                />
              ) : (
                <div className={styles.addressFormWrapper}>
                  <AddressForm
                    addressItem={selectedAddress}
                    showGoogleMap={!!mapApiKey?.length}
                    mapApiKey={mapApiKey}
                    isNewAddress={isCreateMode}
                    onAddAddress={addAddressHandler}
                    onUpdateAddress={updateAddressHandler}
                    onGetLocality={getLocality}
                    customFooter={customFooter}
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileAddressPage;
