import { getPageSlug } from "fdk-core/utils";
import { GLOBAL_DATA, THEME_DATA, USER_DATA_QUERY } from "../queries/libQuery";

export async function globalDataResolver({ fpi }) {
  // TODO
  return fpi.executeGQL(GLOBAL_DATA);
}

export async function pageDataResolver({ fpi, router, themeId }) {
  // Get the current state from the FPI store
  const state = fpi.store.getState();
  const pageValue = getPageSlug(router);

  // Execute a GraphQL query to fetch user data
  fpi.executeGQL(USER_DATA_QUERY);

  // Initialize an array to store API call promises
  const APIs = [];

  // Get the current page value from the store or set it to null if not found
  const currentPageInStore = fpi.getters.PAGE(state)?.value ?? null;

  const query = router?.filterQuery;
  const filters = !query.isEdit || query.isEdit.toString() !== "true";
  const sectionPreviewHash = router.filterQuery?.sectionPreviewHash || "";
  const company = fpi.getters.THEME(state)?.company_id;

  // Check if the page value is valid and different from the current page in the store
  if (pageValue && pageValue !== currentPageInStore) {
    // Prepare the values object to be used in the API call
    const values = {
      themeId,
      pageValue,
      filters,
      sectionPreviewHash,
      company,
    };

    // Add the API call promise to the APIs array
    APIs.push(fpi.executeGQL(THEME_DATA, values));
  }

  // Wait for all API calls to complete and return their results
  return Promise.all(APIs);
}
