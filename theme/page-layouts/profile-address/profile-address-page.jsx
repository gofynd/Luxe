import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import Loader from "@gofynd/theme-template/components/loader/loader";
import AddressForm from "@gofynd/theme-template/components/address-form/address-form";
import AddressItem from "@gofynd/theme-template/components/address-item/address-item";
import { LOCALITY } from "../../queries/logisticsQuery";
import useAddress from "../address/useAddress";
import EmptyState from "../../components/empty-state/empty-state";
import "@gofynd/theme-template/components/loader/loader.css";
import { useSnackbar } from "../../helper/hooks";
import { capitalize } from "../../helper/utils";
import styles from "./profile-address-page.less";
import "@gofynd/theme-template/components/address-form/address-form.css";
import "@gofynd/theme-template/components/address-item/address-item.css";
import useInternational from "../../components/header/useInternational";

const DefaultAddress = () => {
  return <span className={styles.defaultAdd}>Default</span>;
};

const ProfileAddressPage = ({ fpi }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location?.search);
  const allAddresses = useGlobalStore(fpi.getters.ADDRESS)?.address || [];
  const {
    countries,
    fetchCountrieDetails,
    countryDetails,
    currentCountry,
    fetchLocalities,
    isInternationalShippingEnabled,
    renderTemplate,
    updateEnumForField,
  } = useInternational({
    fpi,
  });

  const {
    mapApiKey,
    fetchAddresses,
    addAddress,
    updateAddress,
    removeAddress,
  } = useAddress(fpi, "cart");

  const { showSnackbar } = useSnackbar();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoader, setAddressLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countrySearchText, setCountrySearchText] = useState("");
  const [defaultFormSchema, setDefaultFormSchema] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);
  const queryAddressId = searchParams.get("address_id");
  const memoizedSelectedAdd = useMemo(() => {
    const selectedAdd = allAddresses?.find((add) => add.id === queryAddressId);
    if (selectedAdd) {
      return {
        ...selectedAdd,
        phone: {
          mobile: selectedAdd?.phone,
          countryCode: selectedAdd?.country_code?.replace("+", ""),
          isValidNumber: true,
        },
      };
    }
    return selectedAdd;
  }, [allAddresses, queryAddressId]);

  useEffect(() => {
    if (currentCountry) {
      setSelectedCountry(currentCountry);
    }
  }, [currentCountry]);

  useEffect(() => {
    if (memoizedSelectedAdd?.country_iso_code) {
      fetchCountrieDetails({
        countryIsoCode: memoizedSelectedAdd?.country_iso_code,
      });
    } else {
      fetchCountrieDetails({
        countryIsoCode: selectedCountry?.iso2 ?? countries?.[0]?.iso2,
      });
    }
  }, [selectedCountry, memoizedSelectedAdd]);

  useEffect(() => {
    const formSchema = renderTemplate(
      countryDetails?.fields?.address_template?.checkout_form,
      countryDetails?.fields?.address
    );
    formSchema.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.key === "phone") {
          // Add the country_code key to the field object
          field.countryCode = memoizedSelectedAdd
            ? memoizedSelectedAdd?.country_phone_code.replace("+", "")
            : selectedCountry?.phone_code.replace("+", "");
        }
      });
    });
    getOptionsDetails(formSchema);
  }, [countryDetails]);

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

  const getLocalityValues = async (slug) => {
    const payload = {
      pageNo: 1,
      pageSize: 1000,
      country: memoizedSelectedAdd?.country_iso_code ?? selectedCountry?.iso2,
      locality: slug,
      city: "",
    };
    const localityDetails = await fetchLocalities(payload);
    return localityDetails || [];
  };

  const getOptionsDetails = async (formSchema) => {
    if (!countryDetails?.fields?.serviceability_fields?.length) {
      setDefaultFormSchema([...formSchema]);
      return;
    }
    for (const item of countryDetails?.fields?.serviceability_fields) {
      const serviceabilityDetails = countryDetails?.fields?.address.find(
        (entity) => entity.slug === item
      );
      let localityDetails = [];
      if (serviceabilityDetails.input === "list") {
        // eslint-disable-next-line no-await-in-loop
        localityDetails = await getLocalityValues(item, formSchema);
      }
      const dropDownFieldArray = [];
      for (const locality of localityDetails) {
        dropDownFieldArray.push(convertDropDownField(locality));
      }
      const formData = updateEnumForField(formSchema, item, dropDownFieldArray);
      setDefaultFormSchema([...formData]);
    }
  };

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
    const countryIsoCode = allAddresses?.find(
      (address) => address?.id === addressId
    )?.country_iso_code;

    fpi.setI18nDetails({ countryCode: countryIsoCode });
    navigate({
      pathname: location.pathname,
      search: `edit=true&address_id=${addressId}`,
    });
  };
  const onCancelClick = () => {
    resetPage();
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
  const addAddressHandler = (obj) => {
    if (
      obj?.geo_location?.latitude === "" &&
      obj?.geo_location?.longitude === ""
    ) {
      delete obj.geo_location;
    }
    for (const key in obj) {
      if (obj[key] === undefined) {
        delete obj[key]; // Removes undefined values directly from the original object
      }
    }
    obj.country_phone_code = `+${obj.phone.countryCode}`;
    obj.phone = obj.phone.mobile;
    setAddressLoader(true);
    fpi.setI18nDetails({ countryCode: countryDetails?.iso2 });
    addAddress(obj).then((res) => {
      setAddressLoader(false);
      if (res?.data?.addAddress?.success) {
        showSnackbar("Address added successfully", "success");
        setI18NDetails();
        fetchAddresses();
        resetPage();
      } else {
        showSnackbar("Failed to create new address", "error");
      }
      window.scrollTo({
        top: 0,
      });
    });
  };

  const updateAddressHandler = (obj) => {
    obj.country_phone_code = `+${obj.phone.countryCode}`;
    obj.phone = obj.phone.mobile;
    setAddressLoader(true);
    updateAddress(obj, memoizedSelectedAdd?.id).then((res) => {
      setAddressLoader(false);
      if (res?.data?.updateAddress?.success) {
        showSnackbar("Address updated successfully", "success");
        setI18NDetails();
        fetchAddresses();
        resetPage();
      } else {
        showSnackbar("Failed to update an address", "error");
      }
      window.scrollTo({
        top: 0,
      });
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
      window.scrollTo({
        top: 0,
      });
    });
  };

  const getLocality = (posttype, postcode) => {
    return fpi
      .executeGQL(LOCALITY, {
        locality: posttype,
        localityValue: `${postcode}`,
        country: memoizedSelectedAdd?.country_iso_code ?? selectedCountry?.iso2,
      })
      .then((res) => {
        const data = { showError: false, errorMsg: "" };
        const localityObj = res?.data?.locality || false;
        if (localityObj) {
          if (posttype === "pincode") {
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
          }

          return data;
        }
        showSnackbar(
          res?.errors?.[0]?.message || "Pincode verification failed"
        );
        data.showError = true;
        data.errorMsg =
          res?.errors?.[0]?.message || "Pincode verification failed";
        return data;
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
          onClick={() => removeAddressHandler(memoizedSelectedAdd?.id)}
        >
          REMOVE
        </button>
      )}
    </div>
  );
  if (isLoading) {
    return (
      <div className={styles.loader}>
        <Loader
          containerClassName={styles.loaderContainer}
          loaderClassName={styles.customLoader}
        />
      </div>
    );
  }

  const setI18nDetails = (e) => {
    const selectedCountry = countries.find(
      (country) => country.display_name === e
    );
    setSelectedCountry(selectedCountry);
    fetchCountrieDetails({ countryIsoCode: selectedCountry?.iso2 });
  };

  const handleCountrySearch = (event) => {
    setCountrySearchText(event);
  };
  function convertDropDownField(inputField) {
    return {
      key: inputField.display_name,
      display: inputField.display_name,
    };
  }
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
  return (
    <div className={styles.main}>
      {!isEditMode && !isCreateMode ? (
        <div>
          <div className={styles.addressContainer}>
            <div className={styles.addressHeader}>
              <div className={`${styles.title} ${styles["bold-md"]}`}>
                MY ADDRESSES
                <span
                  className={`${styles.savedAddress} ${styles["bold-xxs"]}`}
                >
                  {allAddresses?.length ? `${allAddresses?.length} saved` : ""}{" "}
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
            <div className={styles.emptyState}>
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
          {isEditMode && !memoizedSelectedAdd ? (
            <EmptyState
              title="Address not found!"
              btnTitle="RETURN TO MY ADDRESS"
              btnLink={location.pathname}
            />
          ) : (
            <div className={styles.addressFormWrapper}>
              <AddressForm
                internationalShipping={isInternationalShippingEnabled}
                formSchema={defaultFormSchema}
                addressItem={memoizedSelectedAdd}
                showGoogleMap={!!mapApiKey?.length}
                mapApiKey={mapApiKey}
                isNewAddress={isCreateMode}
                onAddAddress={addAddressHandler}
                onUpdateAddress={updateAddressHandler}
                onGetLocality={getLocality}
                customFooter={customFooter}
                fpi={fpi}
                setI18nDetails={setI18nDetails}
                handleCountrySearch={handleCountrySearch}
                getFilteredCountries={getFilteredCountries}
                selectedCountry={
                  memoizedSelectedAdd?.country
                    ? memoizedSelectedAdd?.country
                    : (selectedCountry?.display_name ??
                      countries?.[0]?.display_name)
                }
                countryDetails={countryDetails}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileAddressPage;
