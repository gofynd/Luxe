import { useState } from "react";
import { useGlobalStore } from "fdk-core/utils";
import { CATEGORIES_LISTING } from "../../queries/categoryQuery";

const useCategories = (fpi) => {
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const pageConfig =
    mode?.page?.find((f) => f.page === "categories")?.settings?.props || {};

  const [departmentCategories, setDepartmentCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsloading] = useState(false);

  function fetchAllCategories() {
    setIsloading(true);
    try {
      fpi.executeGQL(CATEGORIES_LISTING).then((res) => {
        if (res?.data?.categories?.data?.length > 0) {
          const data = res?.data?.categories?.data;
          const categoriesList = data
            .flatMap((item) => item?.items?.map((m) => m.childs))
            .flat()
            .flatMap((i) => i?.childs);
          setCategories(categoriesList);
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }

  const getCategoriesByDepartment = async (department) => {
    setIsloading(true);
    try {
      const res = await fpi.executeGQL(CATEGORIES_LISTING, { department });

      if (res?.data?.categories?.data?.length > 0) {
        const data = res?.data?.categories?.data;
        const categoriesList = data
          .flatMap((item) => item?.items?.map((m) => m.childs))
          .flat()
          .flatMap((i) => i?.childs);

        return categoriesList;
      }
      return [];
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  return {
    categories,
    pageConfig,
    globalConfig,
    departmentCategories,
    setDepartmentCategories,
    fetchAllCategories,
    getCategoriesByDepartment,
    isLoading,
  };
};

export default useCategories;
