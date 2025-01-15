import { useEffect, useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import {
  ADDRESS_LIST,
  ADD_ADDRESS,
  UPDATE_ADDRESS,
  REMOVE_ADDRESS,
} from "../../queries/addressQuery";
import useInternational from "../../components/header/useInternational";

const useAddress = (fpi, pageName) => {
  const INTEGRATION_TOKENS = useGlobalStore(fpi.getters.INTEGRATION_TOKENS);
  const APP_FEATURES = useGlobalStore(fpi.getters.APP_FEATURES);
  const [mapApiKey, setMapApiKey] = useState("");

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
  const [defaultFormSchema, setDefaultFormSchema] = useState([]);
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

  useEffect(() => {
    const formSchema = renderTemplate(
      countryDetails?.fields?.address_template?.checkout_form,
      countryDetails?.fields?.address
    );
    formSchema.forEach((group) => {
      group.fields.forEach((field) => {
        if (field.key === "phone") {
          // Add the country_code key to the field object
          field.countryCode = selectedCountry?.phone_code.replace("+", "");
        }
      });
    });
    getOptionsDetails(formSchema);
  }, [countryDetails]);

  const getLocalityValues = async (slug) => {
    const payload = {
      pageNo: 1,
      pageSize: 1000,
      country: selectedCountry?.iso2,
      locality: slug,
      city: "",
    };
    const localityDetails = await fetchLocalities(payload);
    return localityDetails || [];
  };

  function convertDropDownField(inputField) {
    return {
      key: inputField.display_name,
      display: inputField.display_name,
    };
  }

  const getOptionsDetails = async (formSchema) => {
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
    isInternationalShippingEnabled,
    defaultFormSchema,
    setI18nDetails,
    handleCountrySearch,
    getFilteredCountries,
    selectedCountry,
    countryDetails,
  };
};

export default useAddress;
