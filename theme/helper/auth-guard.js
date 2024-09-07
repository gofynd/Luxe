import { isRunningOnClient } from "./utils";
import { USER_DATA_QUERY } from "../queries/libQuery";

// return true if user is logged in
// return false if user is not logged in redirect to login page.
export async function isLoggedIn({ fpi, store }) {
  try {
    const userFetched = store?.auth?.user_fetched ?? false;
    if (userFetched) {
      const loggedIn = store?.auth?.logged_in;
      return !!loggedIn;
    }

    const userData = await fpi.executeGQL(USER_DATA_QUERY);

    return !!(userData?.data?.user?.loggedInUser ?? false);
  } catch (error) {
    return false;
  }
}

// Guards against logged-in users accessing certain pages (like login pages)
export async function loginGuard({ fpi, store }) {
  try {
    const loggedIn = await isLoggedIn({ fpi, store });
    if (loggedIn && isRunningOnClient()) {
      window.location.href = "/";
      return false;
    }
    return true;
  } catch (error) {
    return true;
  }
}
