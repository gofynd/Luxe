import { useEffect, useMemo, useRef } from "react";
import { useGlobalStore } from "fdk-core/utils";
import {
  COUNTRIES,
  CURRENCIES,
  DEFAULT_CURRENCY,
  COUNTRY_DETAILS,
  FETCH_LOCALITIES,
} from "../../queries/internationlQuery";
import { useThemeFeature } from "../../helper/hooks";

const useInternational = ({ fpi }) => {
  const { countries, currencies, defaultCurrencyInfo, countryDetails } =
    useGlobalStore(fpi?.getters?.CUSTOM_VALUE) ?? {};
  const { isInternational } = useThemeFeature({ fpi });
  let i18nDetails = useGlobalStore(fpi.getters.i18N_DETAILS);
  const loading = useRef({ country: false, currency: false });

  const currentCountry = useMemo(() => {
    return countries?.list?.find(
      (country) => country?.iso2 === i18nDetails?.countryCode
    );
  }, [countries, i18nDetails?.countryCode]);

  const currentCurrency = useMemo(() => {
    if (!i18nDetails?.currency?.code) {
      return currencies?.list?.find(
        (data) => data?.code === defaultCurrencyInfo?.code
      );
    }
    return currencies?.list?.find(
      (data) => data?.code === i18nDetails?.currency?.code
    );
  }, [currencies, i18nDetails?.currency?.code, defaultCurrencyInfo?.code]);

  const defaultCurrency = useMemo(() => {
    return currencies?.list?.find(
      (data) => data?.code === defaultCurrencyInfo?.code
    );
  }, [currencies, defaultCurrencyInfo]);

  function fetchCurrencies() {
    if (
      loading.current.currency ||
      currencies?.isLoaded ||
      currencies?.list?.length
    )
      return;
    loading.current = { ...loading.current, currency: true };
    try {
      return fpi.executeGQL(CURRENCIES).then((res) => {
        if (res?.data?.currencies) {
          fpi.custom.setValue("currencies", {
            isLoaded: true,
            list: res?.data?.currencies ?? [],
          });
        }
        loading.current = { ...loading.current, currency: false };
        return res;
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function fetchCountries() {
    if (
      loading.current.country ||
      countries?.isLoaded ||
      countries?.list?.length
    )
      return;
    loading.current = { ...loading.current, country: true };
    try {
      return fpi.executeGQL(COUNTRIES).then((res) => {
        if (res?.data?.countries) {
          fpi.custom.setValue("countries", {
            isLoaded: true,
            list: res?.data?.countries?.items ?? [],
          });
        }
        loading.current = { ...loading.current, country: false };
        return res;
      });
    } catch (error) {
      console.log({ error });
    }
  }

  function fetchDefaultCurrencies() {
    return fpi.executeGQL(DEFAULT_CURRENCY).then((res) => {
      if (
        res?.data?.applicationConfiguration?.app_currencies?.default_currency
      ) {
        fpi.custom.setValue(
          "defaultCurrencyInfo",
          res.data.applicationConfiguration.app_currencies.default_currency
        );
      }
      return res;
    });
  }

  function fetchCountrieDetails(payload, options = {}) {
    if (!payload.countryIsoCode) return;
    const { skipStoreUpdate = false } = options;
    return fpi.executeGQL(COUNTRY_DETAILS, payload).then((res) => {
      if (res?.data?.country && !skipStoreUpdate) {
        fpi.custom.setValue("countryDetails", res.data.country);
      }
      return res;
    });
  }

  useEffect(() => {
    try {
      if (isInternational) {
        fetchCountries();
        fetchCurrencies();
        fetchDefaultCurrencies();
      }
    } catch (error) {
      console.log({ error });
    }
  }, []);

  useEffect(() => {
    if (currentCountry?.iso2) {
      fetchCountrieDetails({ countryIsoCode: currentCountry?.iso2 });
    }
  }, [currentCountry]);

  function fetchLocalities(payload) {
    return fpi.executeGQL(FETCH_LOCALITIES, payload).then((res) => {
      if (res?.data?.localities) {
        const data = res?.data?.localities;
        return data.items;
      }
    });
  }

  return {
    countries: countries?.list ?? [],
    currencies: currencies?.list ?? [],
    defaultCurrency,
    countryDetails,
    currentCountry,
    currentCurrency,
    fetchCurrencies,
    fetchCountries,
    fetchCountrieDetails,
    fetchLocalities,
    isInternational,
  };
};

export default useInternational;
