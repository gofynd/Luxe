import React, { useMemo, useEffect } from "react";
import Values from "values.js";
import { useFPI, useGlobalStore } from "fdk-core/utils";
// eslint-disable-next-line import/no-unresolved
import { Helmet } from "react-helmet-async";
import { getProductImgAspectRatio } from "../helper/utils";
import { useThemeConfig } from "../helper/hooks";

export function ThemeProvider({ children }) {
  const fpi = useFPI();
  const locationDetails = useGlobalStore(fpi.getters.LOCATION_DETAILS);
  const sellerDetails = JSON.parse(
    useGlobalStore(fpi.getters.SELLER_DETAILS) || "{}"
  );
  const { globalConfig, pallete } = useThemeConfig({ fpi });

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

  useEffect(() => {
    if (!locationDetails?.country_iso_code) {
      fpi.setI18nDetails({
        countryCode: sellerDetails.country_code,
      });
    }
  }, []);

  return (
    <>
      <Helmet>
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
    </Helmet>
  );
};
