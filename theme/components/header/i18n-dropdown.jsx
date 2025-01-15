import React, { useState, useEffect, Fragment, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import Modal from "@gofynd/theme-template/components/core/modal/modal";
import "@gofynd/theme-template/components/core/modal/modal.css";
import FyInput from "@gofynd/theme-template/components/core/fy-input/fy-input";
import "@gofynd/theme-template/components/core/fy-input/fy-input.css";
import styles from "./styles/i18n-dropdown.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { HTMLContent } from "../core/html-content/html-content";
import FyDropdownLib from "../core/fy-dropdown/fy-dropdown-lib";
import useInternational from "./useInternational";
import { LOCALITY } from "../../queries/logisticsQuery";

function I18Dropdown({ fpi }) {
  const {
    countries,
    currencies,
    defaultCurrencies,
    sellerDetails,
    countryDetails,

    selectedCountry,
    setSelectedCountry,

    selectedCurrency,
    setSelectedCurrency,

    currentCountry,
    currentCurrency,
    fetchLocalities,
    isInternationalShippingEnabled,
  } = useInternational({
    fpi,
  });

  const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  const showI18DropdownFlag = customValues?.isI18ModalOpen;
  const [showInternationalDropdown, setShowInternationalDropdown] = useState(
    showI18DropdownFlag || false
  );
  const locationDetails = useGlobalStore(fpi?.getters?.LOCATION_DETAILS);
  const pincodeDetails = useGlobalStore(fpi?.getters?.PINCODE_DETAILS);

  const [formSchema, setFormSchema] = useState([]);
  const location = useLocation();

  const { control, handleSubmit, setValue, getValues } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      country: selectedCountry,
      currency: selectedCurrency,
    },
  });

  useEffect(() => {
    setShowInternationalDropdown(showI18DropdownFlag);
  }, [showI18DropdownFlag]);

  useEffect(() => {
    if (!selectedCountry || Object.keys(selectedCountry).length === 0) {
      setSelectedCountry(countries[0]);
    }
    if (selectedCountry && Object.keys(selectedCountry).length > 0) {
      const sellerCurrency = currencies?.find(
        (data) => data?.code === selectedCountry?.currency?.code
      );
      setSelectedCurrency(sellerCurrency);
      setValue("country", selectedCountry);
    }
  }, [selectedCountry, setValue]);

  useEffect(() => {
    if (selectedCurrency && Object.keys(selectedCurrency).length > 0) {
      setValue("currency", selectedCurrency);
    }
  }, [selectedCurrency, setValue]);

  useEffect(() => {
    if (formSchema?.some((item) => item.slug === "pincode")) {
      let pincode = "";
      if (pincodeDetails?.type === "pincode") {
        if (pincodeDetails?.country === selectedCountry?.iso2) {
          pincode = pincodeDetails?.localityValue;
        }
      } else if (locationDetails?.country_iso_code === selectedCountry?.iso2) {
        pincode = locationDetails?.pincode;
      }
      setValue("pincode", pincode);
    } else {
      setValue("pincode", "");
    }
    if (formSchema?.some((item) => item.slug === "sector")) {
      const formSchemaValue = formSchema?.find(
        (item) => item.slug === "sector"
      );
      if (Object.keys(formSchemaValue?.value ?? {})?.length === 0) {
        setValue(
          "sector",
          pincodeDetails?.type === "sector"
            ? pincodeDetails
            : {
                display_name:
                  !pincodeDetails || Object.keys(pincodeDetails).length === 0
                    ? locationDetails?.sector
                    : "",
              }
        );
      }
    } else {
      setValue("sector", "");
    }
    if (formSchema?.some((item) => item.slug === "city")) {
      const formSchemaValue = formSchema?.find((item) => item.slug === "city");
      if (Object.keys(formSchemaValue?.value ?? {})?.length === 0) {
        setValue(
          "city",
          // eslint-disable-next-line no-nested-ternary
          pincodeDetails?.type === "sector"
            ? pincodeDetails?.country === selectedCountry?.iso2
              ? pincodeDetails?.localities?.find((item) => item.type === "city")
              : ""
            : {
                display_name:
                  !pincodeDetails ||
                  (Object.keys(pincodeDetails).length === 0 &&
                    locationDetails?.country_iso_code === selectedCountry?.iso2)
                    ? locationDetails?.city
                    : "",
              }
        );
      }
    } else {
      setValue("city", "");
    }
  }, [pincodeDetails, locationDetails, formSchema]);

  const getLocalityValues = async (slug, restFields = {}) => {
    const payload = {
      pageNo: 1,
      pageSize: 1000,
      country: selectedCountry?.iso2,
      locality: slug,
      city: "",
      ...restFields,
    };

    return fetchLocalities(payload);
  };

  useEffect(() => {
    if (countryDetails) {
      const dynamicFields = countryDetails?.fields?.serviceability_fields?.map(
        (localityField) => {
          const addressField = countryDetails?.fields?.address?.find(
            (addressField) => addressField.slug === localityField
          );

          const fieldValidation = createValidation(
            addressField.validation,
            addressField.required,
            addressField.error_text,
            addressField.input
          );

          setValue(addressField.slug, addressField.input === "list" ? {} : "");

          if (addressField.input === "list") {
            return {
              ...addressField,
              options: [],
              value: {},
              validation: fieldValidation,
            };
          }

          return { ...addressField, value: "", validation: fieldValidation };
        }
      );

      setFormSchema(dynamicFields);

      const populateFormFields = async () => {
        try {
          const formFields = await Promise.all(
            countryDetails?.fields?.serviceability_fields?.map(
              async (localityField, index) => {
                const localityDetails = { ...dynamicFields[index] };

                if (localityDetails.input === "list") {
                  const localityValues = await getLocalityValues(localityField);

                  // Optimize this
                  localityDetails.options = localityValues;

                  // .map((locality) => ({
                  //   ...locality,
                  //   key: locality.id,
                  //   display: locality.display_name,
                  //   name: locality.name,
                  // }));
                }

                return localityDetails;
              }
            )
          );

          setFormSchema(formFields);
        } catch (error) {
          // eslint-disable-next-line
          console.error("Error populating form fields:");
        }
      };

      populateFormFields();
    }
  }, [countryDetails]);

  const showI18Dropdown = () => {
    const whiteListedRoutes = [
      "/product",
      "/products",
      "/collections",
      "/collection",
      "/categories",
      "/brands",
      "/profile/address",
    ];

    const currentPath = location.pathname;

    if (currentPath === "/") {
      return true;
    }

    return whiteListedRoutes.some((route) => currentPath.indexOf(route) === 0);
  };

  const getCurrencyByCode = (code) => {
    return currencies?.find((currency) => currency?.code === code);
  };

  const getDefaultCurrency = () => {
    return getCurrencyByCode(defaultCurrencies?.default_currency?.code);
  };

  const getCurrentCountry = () => {
    if (sellerDetails?.country?.iso_code) {
      return getCountryByIso(sellerDetails?.country?.iso_code);
    }
    return getCountryByIso(countries[0]?.iso2);
  };

  const currentSelectedCurrency = () => {
    if (getDefaultCurrency()?.code) {
      const selectedCountry =
        currentCountry?.display_name ?? getCurrentCountry()?.display_name;
      const selectedCurrency =
        currentCurrency?.code ?? getDefaultCurrency()?.code;
      return `<span>
        ${selectedCountry} - ${selectedCurrency}
        </span>`;
    }
  };

  const getCountryByIso = (code) => {
    if (!code) return;
    return countries?.find((country) => country?.iso2 === code);
  };

  const checkLocality = (localityValue, localityType, selectedValues) => {
    fpi
      .executeGQL(LOCALITY, {
        locality: localityType,
        localityValue,
        city: selectedValues?.city?.name,
        country: selectedValues?.country?.iso2,
        state: "",
      })
      .then((res) => {
        if (res?.data?.locality) {
          console.log(res?.data?.locality);
        } else {
          console.log(
            res?.errors?.[0]?.message || "Pincode verification failed"
          );
        }
      });
  };
  const handleSetI18n = () => {
    const selectedValues = getValues();
    const cookiesData = JSON.stringify({
      currency: { code: selectedValues?.currency?.code },
      country: {
        iso_code: selectedValues?.country?.iso2,
        isd_code: selectedValues?.country?.phone_code,
      },
      display_name: selectedValues?.country?.display_name,
      countryCode: selectedValues?.country?.iso2,
    });
    fpi.setI18nDetails(cookiesData);
    if (selectedValues?.pincode) {
      checkLocality(selectedValues?.pincode, "pincode", selectedValues);
    } else {
      checkLocality(selectedValues?.sector?.name, "sector", selectedValues);
    }

    fpi.custom.setValue("isI18ModalOpen", false);
  };

  const onDynamicFieldChange = async (selectedField, selectedValue) => {
    const serviceabilitySlugs =
      countryDetails?.fields?.serviceability_fields || [];
    const currentIndex = serviceabilitySlugs?.findIndex(
      (slug) => slug === selectedField.slug
    );

    const updatedFormSchema = [...formSchema];
    updatedFormSchema[currentIndex] = {
      ...updatedFormSchema[currentIndex],
      value: selectedValue,
    };

    const nextIndex =
      currentIndex + 1 < serviceabilitySlugs.length ? currentIndex + 1 : -1;

    if (nextIndex !== -1) {
      const nextSlug = serviceabilitySlugs[nextIndex];
      const currentFields = {};

      updatedFormSchema.slice(0, currentIndex + 1).forEach((field) => {
        currentFields[field.slug] = field.value?.name || "";
      });

      updatedFormSchema.slice(nextIndex).forEach((field) => {
        // const isAssociatedField = field?.value?.localities?.some(
        //   ({ name, type }) =>
        //     type === selectedField.input && name === selectedValue.name
        // );

        setValue(field.slug, field.input === "list" ? {} : "");
      });

      const LocalityValues = await getLocalityValues(nextSlug, currentFields);

      updatedFormSchema[nextIndex] = {
        ...updatedFormSchema[nextIndex],
        // Optimize this
        options: LocalityValues,
        // .map((locality) => ({
        //   ...locality,
        //   key: locality.id,
        //   display: locality.display_name,
        //   name: locality.name,
        // })),
      };
    }

    setFormSchema(updatedFormSchema);
  };

  const onModalClose = () => {
    fpi.custom.setValue("isI18ModalOpen", false);
  };

  // const isFormValid = useMemo(() => {
  //   const isCountryValid =
  //     selectedCountry && Object.keys(selectedCountry).length > 0;
  //   const isCurrencyValid =
  //     selectedCurrency && Object.keys(selectedCurrency).length > 0;

  //   const isFormSchemaValid = formSchema.every(
  //     (item) =>
  //       item.value &&
  //       typeof item.value === "object" &&
  //       Object.keys(item.value).length > 0
  //   );

  //   return isCountryValid && isCurrencyValid && isFormSchemaValid;
  // }, [selectedCountry, selectedCurrency, formSchema]);

  function createValidation(validation, required, error_text, type) {
    const result = {};

    if (type === "list") {
      result.validate = (value) =>
        Object.keys(value || {}).length > 0 || error_text;

      return result;
    }

    if (required) {
      result.required = error_text;
    }

    if (validation?.type === "regex") {
      result.pattern = {
        value: new RegExp(validation?.regex?.value),
        message: error_text,
      };

      if (validation?.regex?.length?.max) {
        result.maxLength = {
          value: validation?.regex?.length?.max,
          message: error_text,
        };
      }

      if (validation?.regex?.length?.min) {
        result.minLength = {
          value: validation?.regex?.length?.min,
          message: error_text,
        };
      }
    }

    return result;
  }

  return (
    <>
      {isInternationalShippingEnabled && (
        <div>
          {showI18Dropdown() && (
            <div className={`${styles.internationalization}`}>
              <button
                className={`${styles.internationalization__selected}`}
                onClick={() =>
                  setShowInternationalDropdown(
                    fpi.custom.setValue("isI18ModalOpen", true)
                  )
                }
              >
                <SvgWrapper
                  svgSrc="international"
                  className={styles.dropdownIcon}
                />
                <div>
                  <HTMLContent key="html" content={currentSelectedCurrency()} />
                </div>
                {/* 
                  <SvgWrapper
                    svgSrc="arrow-down"
                    className={`${styles.dropdownIcon} ${styles.selectedDropdown} ${showInternationalDropdown ? `${styles.rotate}` : ""}`}
                  /> 
                */}
              </button>
              {showInternationalDropdown && (
                <Modal
                  hideHeader={true}
                  isOpen={showInternationalDropdown}
                  closeDialog={onModalClose}
                  bodyClassName={styles.i18ModalBody}
                  containerClassName={styles.i18ModalContainer}
                  ignoreClickOutsideForClass="fydrop"
                >
                  <h4 className={styles.title}>
                    Choose your location{" "}
                    <span onClick={onModalClose}>
                      <SvgWrapper svgSrc="cross-black" />
                    </span>
                  </h4>
                  <p className={styles.description}>
                    Choose your address location to see product availability and
                    delivery options
                  </p>

                  <div className={`${styles.internationalization__dropdown}`}>
                    <div className={`${styles.section}`}>
                      <FormField
                        formData={{
                          key: "country",
                          type: "list",
                          label: "Select country",
                          placeholder: "Select country",
                          options: countries,
                          onChange: (value) => {
                            setSelectedCountry(value);
                          },
                          validation: {
                            validate: (value) =>
                              Object.keys(value || {}).length > 0 ||
                              `Invalid country`,
                          },
                          getOptionLabel: (option) => option.display_name || "",
                        }}
                        control={control}
                      />
                    </div>

                    {formSchema.map((field) => (
                      <Fragment key={field.slug}>
                        {field?.input ? (
                          <div className={`${styles.section}`}>
                            <FormField
                              formData={{
                                key: field.slug,
                                type: field?.input,
                                label: field?.display_name,
                                placeholder: field?.display_name,
                                options: field.options,
                                onChange: (value) => {
                                  onDynamicFieldChange(field, value);
                                },
                                validation: field.validation,
                                getOptionLabel: (option) =>
                                  option.display_name || "",
                              }}
                              control={control}
                            />
                          </div>
                        ) : null}
                      </Fragment>
                    ))}

                    <div className={`${styles.section}`}>
                      <FormField
                        formData={{
                          key: "currency",
                          type: "list",
                          label: "Select currency",
                          placeholder: "Select currency",
                          options: currencies,
                          onChange: (value) => {
                            setSelectedCurrency(value);
                          },
                          validation: {
                            validate: (value) =>
                              Object.keys(value || {}).length > 0 ||
                              `Invalid currency`,
                          },
                          getOptionLabel: (option) =>
                            option?.code
                              ? `${option?.code} - ${option?.name}`
                              : "",
                        }}
                        control={control}
                      />
                    </div>
                    <button
                      className={`${styles.save_btn}`}
                      onClick={handleSubmit(handleSetI18n)}
                    >
                      Apply
                    </button>
                  </div>
                </Modal>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

const FormField = ({ formData, control }) => {
  const {
    label = "",
    placeholder = "",
    options = [],
    key = "",
    type = "",
    onChange = (value) => {},
    validation = {},
    getOptionLabel,
  } = formData;

  const InputComponent = ({ field, error }) => {
    if (type === "list") {
      return (
        <FyDropdownLib
          label={label}
          placeholder={placeholder}
          value={field.value}
          options={options}
          labelClassName={styles.autoCompleteLabel}
          onChange={(value) => {
            field.onChange(value);
            onChange(value);
          }}
          error={error}
          dataKey="id"
          getOptionLabel={getOptionLabel}
        />
      );
    }

    return (
      <FyInput
        name={field?.name}
        label={label}
        labelVariant="floating"
        inputVariant="outlined"
        value={field.value}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
        error={!!error?.message}
        errorMessage={error?.message}
      />
    );
  };

  return (
    <Controller
      name={key}
      control={control}
      rules={validation}
      render={({ field, fieldState: { error } }) =>
        InputComponent({ field, error })
      }
    />
  );
};

export default I18Dropdown;
