import { getPageSlug } from "fdk-core/utils";
import { GLOBAL_DATA, THEME_DATA, USER_DATA_QUERY } from "../queries/libQuery";

export async function globalDataResolver({ fpi, applicationID }) {
  // TODO
  return fpi.executeGQL(GLOBAL_DATA);
}

export async function pageDataResolver({ fpi, router, themeId }) {
  const state = fpi.store.getState();
  const pageValue = getPageSlug(router);
  fpi.executeGQL(USER_DATA_QUERY);
  const APIs = [];
  const currentPageInStore = fpi.getters.PAGE(state)?.value ?? null;
  const query = router?.filterQuery;
  const filters = !query.isEdit || query.isEdit.toString() !== "true";
  const sectionPreviewHash = router.filterQuery?.sectionPreviewHash || "";
  const company = fpi.getters.THEME(state)?.company_id;
  if (pageValue && pageValue !== currentPageInStore) {
    const values = {
      themeId,
      pageValue,
      filters,
      sectionPreviewHash,
      company,
    };

    APIs.push(fpi.executeGQL(THEME_DATA, values));
  }
  return Promise.all(APIs);
}
