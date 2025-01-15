import { useGlobalStore } from "fdk-core/utils";

export const useThemeConfig = ({ fpi, page = "" }) => {
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const { general_setting, advance_setting } =
    mode.global_config.static.props.palette;

  if (page) {
    const pageConfig =
      mode?.page?.find((f) => f.page === page)?.settings?.props || {};
    return {
      globalConfig,
      pageConfig,
      pallete: { ...(general_setting || {}), ...(advance_setting || {}) },
    };
  }

  return {
    globalConfig,
    pallete: { ...(general_setting || {}), ...(advance_setting || {}) },
  };
};
