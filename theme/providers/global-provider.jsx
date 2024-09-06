import React, { useMemo } from "react";
import { useFPI, useGlobalStore } from "fdk-core/utils";
import { Helmet } from "react-helmet-async";

export function ThemeProvider({ children }) {
  const fpi = useFPI();

  const themeConfig = useGlobalStore(fpi.getters.THEME)?.config || {};

  const fontStyles = useMemo(() => {
    const currentConfig = themeConfig.current || "";
    const configList = themeConfig.list || [];
    const currentGlobalConfig =
      configList.find((configData) => configData.name === currentConfig) || {};
    const globalConfigData =
      currentGlobalConfig?.global_config?.custom?.props || {};
    const headerFont = globalConfigData.font_header;
    const bodyFont = globalConfigData.font_body;
    let styles = "";
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
    styles = styles.concat(
      `:root, ::before, ::after { --font-body: ${bodyFontName}; --font-header: ${headerFontName}}`
    );

    return styles;
  }, [themeConfig]);

  return (
    <div className="provider">
      <Helmet>
        <style type="text/css">{fontStyles}</style>
      </Helmet>
      {children}
    </div>
  );
}
