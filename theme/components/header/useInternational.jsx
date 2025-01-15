import { useEffect, useState, useMemo } from "react";
import { useGlobalStore } from "fdk-core/utils";
import {
  FETCH_ALL_COUNTRIES,
  FETCH_ALL_CURRENCIES,
  FETCH_DEFAULT_CURRENCIES,
  FETCH_COUNTRY_DETAILS,
  FETCH_COUNTRIES,
  FETCH_LOCALITIES,
} from "../../queries/internationlQuery";

const useInternational = ({ fpi }) => {
  const [countries, setCountries] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [defaultCurrencies, setDefaultCurrencies] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({});
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [countryDetails, setCountryDetails] = useState(null);
  const isInternationalShippingEnabled =
    useGlobalStore(fpi.getters.CONFIGURATION)?.app_features?.common
      ?.international_shipping?.enabled ?? false;
  let sellerDetails = useGlobalStore(fpi.getters.i18N_DETAILS);
  if (typeof sellerDetails === "string" && sellerDetails !== "") {
    sellerDetails = JSON.parse(sellerDetails);
  }
  // const customValues = useGlobalStore(fpi?.getters?.CUSTOM_VALUE);
  // const sellerDetails = customValues?.sellerDetails;
  const currentCountry = useMemo(() => {
    return countries?.find(
      (country) => country?.iso2 === sellerDetails?.country?.iso_code
    );
  }, [countries, sellerDetails]);

  useEffect(() => {
    if (Object.keys(currentCountry || {}).length) {
      setSelectedCountry({
        ...currentCountry,
        key: currentCountry.id,
        display: currentCountry.display_name,
      });
    }
  }, [currentCountry]);

  const currentCurrency = useMemo(
    () =>
      currencies?.find((data) => data?.code === sellerDetails?.currency?.code),
    [currencies, sellerDetails]
  );

  useEffect(() => {
    if (Object.keys(currentCurrency || {}).length) {
      setSelectedCurrency({
        ...currentCurrency,
        key: currentCurrency.id,
        display: currentCurrency.display,
      });
    }
  }, [currentCurrency]);

  useEffect(() => {
    try {
      if (isInternationalShippingEnabled) {
        fetchCountries();
        fetchCurrencies();
        fetchDefaultCurrencies();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    if (selectedCountry?.iso2) {
      fetchCountrieDetails({ countryIsoCode: selectedCountry?.iso2 });
    } else {
      fetchCountrieDetails({ countryIsoCode: "IN" });
    }
  }, [selectedCountry]);

  function fetchAllCountries() {
    return fpi.executeGQL(FETCH_ALL_COUNTRIES).then((res) => {
      if (res?.data?.allCountries) {
        const data = res?.data?.allCountries?.results;
        setCountries(data);
        return data;
      }
    });
  }

  function fetchDefaultCurrencies() {
    return fpi.executeGQL(FETCH_DEFAULT_CURRENCIES).then((res) => {
      if (res?.data?.applicationConfiguration?.app_currencies) {
        const data = res?.data?.applicationConfiguration?.app_currencies;
        setDefaultCurrencies(data);
        return data;
      }
    });
  }

  function fetchCurrencies() {
    try {
      return fpi.executeGQL(FETCH_ALL_CURRENCIES).then((res) => {
        if (res?.data?.currencies) {
          const data = res?.data?.currencies;
          setCurrencies(data);
        }
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function fetchCountrieDetails(payload) {
    return fpi.executeGQL(FETCH_COUNTRY_DETAILS, payload).then((res) => {
      if (res?.data?.country) {
        const data = res?.data?.country;

        setCountryDetails(data);
        return data;
      }
    });
  }

  function fetchCountries() {
    return fpi.executeGQL(FETCH_COUNTRIES).then((res) => {
      if (res?.data?.countries) {
        const data = res?.data?.countries?.items || [];
        setCountries(data);

        return data;
      }
    });
  }

  function fetchLocalities(payload) {
    return fpi.executeGQL(FETCH_LOCALITIES, payload).then((res) => {
      if (res?.data?.localities) {
        const data = res?.data?.localities;
        return data.items;
      }
    });
  }

  function createValidation(validation, required, error_text, slug) {
    const result = {};
    if (required) {
      result.required = error_text;
    }
    if (validation?.type === "regex") {
      if (slug === "phone") {
        result.validate = (value) => {
          if (value?.mobile && !value.isValidNumber) {
            return error_text;
          }
          return true;
        };
      }
      result.pattern = {
        value: new RegExp(validation?.regex.value),
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

  function updateEnumForField(formSchema, fieldKey, newEnumValues) {
    const key = fieldKey === "pincode" ? "area_code" : fieldKey;
    for (const group of formSchema) {
      if (group?.fields) {
        for (const field of group.fields) {
          if (field?.key === key) {
            field.enum = newEnumValues;
          }
        }
      }
    }
    return formSchema;
  }

  function convertField(inputField) {
    let type = inputField.input;
    if (type === "textbox") {
      if (inputField?.slug === "phone") {
        type = "mobile";
      } else {
        type = "text";
      }
    }
    return {
      key: inputField?.slug === "pincode" ? "area_code" : inputField?.slug,
      display: `${inputField.display_name}${inputField.required ? "" : ""}`,
      type,
      required: inputField.required,
      fullWidth: false,
      validation: createValidation(
        inputField.validation,
        inputField.required,
        inputField.error_text,
        inputField?.slug
      ),
      enum: [],
      // countryCode: memoizedSelectedAdd
      //   ? memoizedSelectedAdd?.country_phone_code.replace("+", "")
      //   : selectedCountry?.phone_code.replace("+", ""),
    };
  }

  const renderTemplate = (template, data) => {
    const output = [
      {
        group: 0,
        groupLabel: "",
        fields: [],
      },
    ];
    let currentIndex = 0;
    for (let i = 0; i < template?.length; i++) {
      const char = template[i];
      if (char === "{") {
        let braceCounter = 1;
        let closingIndex;
        for (let j = i + 1; j < template.length; j++) {
          if (template[j] === "{") braceCounter++;
          else if (template[j] === "}") braceCounter--;
          if (braceCounter === 0) {
            closingIndex = j;
            break;
          }
        }
        const key = template.slice(i + 1, closingIndex);
        const obj = data.find((d) => d?.slug === key);

        output[currentIndex]?.fields.push(convertField(obj));
        i = closingIndex;
      } else if (char === "_") {
        currentIndex++;
        output[currentIndex] = {
          group: `addressInfo${currentIndex}`,
          groupLabel: `addressInfo${currentIndex}`,
          fields: [],
        };
      }
    }
    return output;
  };

  return {
    countries,
    currencies,
    defaultCurrencies,
    countryDetails,
    sellerDetails,
    currentCountry,
    currentCurrency,
    fetchAllCountries,
    fetchCurrencies,
    fetchCountrieDetails,
    fetchCountries,
    fetchLocalities,
    selectedCountry,
    setSelectedCountry,
    selectedCurrency,
    setSelectedCurrency,
    isInternationalShippingEnabled,
    renderTemplate,
    updateEnumForField,
  };
};

export default useInternational;
