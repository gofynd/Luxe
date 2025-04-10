import React, { useMemo, useEffect, useState } from "react";
import Values from "values.js";
import { useLocation } from "react-router-dom";
import { useFPI, useGlobalStore } from "fdk-core/utils";
import { Helmet } from "react-helmet-async";
import { getProductImgAspectRatio, getValidLocales, isRunningOnClient } from "../helper/utils";
import { useParams } from "react-router-dom";
import { useThemeConfig } from "../helper/hooks";
import useInternational from "../components/header/useInternational";

export function ThemeProvider({ children }) {
  const fpi = useFPI();
  const location = useLocation();
  const locationDetails = useGlobalStore(fpi.getters.LOCATION_DETAILS);
  const { defaultCurrency } = useGlobalStore(fpi.getters.CUSTOM_VALUE);
  const sellerDetails = JSON.parse(
    useGlobalStore(fpi.getters.SELLER_DETAILS) || "{}"
  );
  const { globalConfig, pallete } = useThemeConfig({ fpi });
  const { i18nDetails, countryDetails, fetchCountrieDetails } =
    useInternational({ fpi });

  const fontStyles = useMemo(() => {
    let styles = "";
    const headerFont = globalConfig.font_header;
    const bodyFont = globalConfig.font_body;

    const headerFontName = headerFont?.family;
    const headerFontVariants = headerFont?.variants;

    const bodyFontName = bodyFont?.family;
    const bodyFontVariants = bodyFont?.variants;

    if (headerFontName) {
      Object.keys(headerFontVariants).forEach((variant) => {
        const fontStyles = `
          @font-face {
            font-family: ${headerFontName};
            src: local(${headerFontName}),
              url(${headerFontVariants[variant].file});
            font-weight: ${headerFontVariants[variant].name};
            font-display: swap;
          }
        `;

        styles = styles.concat(fontStyles);
      });

      const customFontClasses = `
        .fontHeader {
          font-family: ${headerFontName} !important;
        }
      `;

      styles = styles.concat(customFontClasses);
    }

    if (bodyFontName) {
      Object.keys(bodyFontVariants).forEach((variant) => {
        const fontStyles = `
          @font-face {
            font-family: ${bodyFontName};
            src: local(${bodyFontName}),
              url(${bodyFontVariants[variant].file});
            font-weight: ${bodyFontVariants[variant].name};
            font-display: swap;
          }
        `;

        styles = styles.concat(fontStyles);
      });

      const customFontClasses = `
        .fontBody {
          font-family: ${bodyFontName} !important;
        }
      `;

      styles = styles.concat(customFontClasses);
    }

    const buttonPrimaryShade = new Values(pallete.button.button_primary);
    const buttonLinkShade = new Values(pallete.button.button_link);
    const accentDarkShades = new Values(pallete.theme.theme_accent).shades(20);
    const accentLightShades = new Values(pallete.theme.theme_accent).tints(20);

    styles = styles.concat(
      `:root, ::before, ::after {
        --font-body: ${bodyFontName};
        --font-header: ${headerFontName};
        --imageRadius: ${globalConfig?.image_border_radius}px;
        --buttonRadius: ${globalConfig?.button_border_radius}px;
        --productImgAspectRatio: ${getProductImgAspectRatio(globalConfig)};
        --buttonPrimaryL1: #${buttonPrimaryShade.tint(20).hex};
        --buttonPrimaryL3: #${buttonPrimaryShade.tint(60).hex};
        --buttonLinkL1: #${buttonLinkShade.tint(20).hex};
        --buttonLinkL2: #${buttonLinkShade.tint(40).hex};
        ${accentDarkShades?.reduce((acc, color, index) => acc.concat(`--themeAccentD${index + 1}: #${color.hex};`), "")}
        ${accentLightShades?.reduce((acc, color, index) => acc.concat(`--themeAccentL${index + 1}: #${color.hex};`), "")}
      }`
    );
    return styles.replace(/\s+/g, "");
  }, [globalConfig]);

  // to scroll top whenever path changes
  useEffect(() => {
    if (isRunningOnClient()) {
      window?.scrollTo?.(0, 0);
    }
  }, [location?.pathname]);


  useEffect(() => {
    if (
      !locationDetails?.country_iso_code ||
      !i18nDetails?.currency?.code ||
      !i18nDetails?.countryCode
    ) {
      fpi.setI18nDetails({
        currency: { code: i18nDetails?.currency?.code || defaultCurrency },
        countryCode: sellerDetails.country_code,
      });
    }
  }, []);

  useEffect(() => {
    if (
      i18nDetails?.countryCode &&
      i18nDetails?.countryCode !== countryDetails?.iso2
    ) {
      fetchCountrieDetails({ countryIsoCode: i18nDetails?.countryCode });
    }
  }, [i18nDetails?.countryCode]);

  return (
    <>
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1"
        />
        <style type="text/css">{fontStyles}</style>
      </Helmet>
      {children}
    </>
  );
}

export const getHelmet = ({ seo }) => {
  return (
    <Helmet>
      <title>{seo?.title}</title>
      <meta name="description" content={seo?.description} />
      {seo?.canonical_url && <link rel="canonical" href={seo?.canonical_url} />}
    </Helmet>
  );
};
