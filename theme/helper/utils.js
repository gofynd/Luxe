export const debounce = (func, wait) => {
  let timeout;
  const debouncedFunction = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(function applyFunc() {
      func.apply(this, args);
    }, wait);
  };
  return debouncedFunction;
};

export const getGlobalConfigValue = (globalConfig, id) =>
  globalConfig?.props?.[id] ?? "";

export const getSocialIcon = (title) =>
  title && typeof title === "string" ? `footer-${title.toLowerCase()}` : "";

export function replaceQueryPlaceholders(queryFormat, value1, value2) {
  return queryFormat.replace("{}", value1).replace("{}", value2);
}

export const singleValuesFilters = {
  sortOn: true,
};

export function capitalize(str) {
  if (!str) return str; // Return the string as-is if it's empty or undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const numberWithCommas = (number) => {
  let num = number;
  if (number?.toString()[0] === "-") {
    num = number.toString().substring(1);
  }

  if (num) {
    let no =
      num.toString().split(".")[0].length > 3
        ? `${num
            .toString()
            .substring(0, num.toString().split(".")[0].length - 3)
            .replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${num
            .toString()
            .substring(num.toString().split(".")[0].length - 3)}`
        : num.toString();

    if (number.toString()[0] === "-") {
      no = `-${no}`;
    }
    return no;
  }
  return 0;
};
export function isRunningOnClient() {
  if (typeof window !== "undefined") {
    return globalThis === window;
  }

  return false;
}

export const copyToClipboard = (str) => {
  const el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  const selected =
    document.getSelection().rangeCount > 0
      ? document.getSelection().getRangeAt(0)
      : false;
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  if (selected) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
};

export function convertDate(dateString) {
  const date = new Date(dateString);

  const options = {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "UTC",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = formatter.format(date);

  return formattedDate;
}

export const convertUTCDateToLocalDate = (date, format) => {
  let frm = format;
  if (!frm) {
    frm = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  }
  const utcDate = new Date(date);
  // Convert the UTC date to the local date using toLocaleString() with specific time zone
  const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options = {
    ...frm,
    timeZone: browserTimezone,
  };
  // Convert the UTC date and time to the desired format
  const formattedDate = utcDate
    .toLocaleString("en-US", options)
    .replace(" at ", ", ");
  return formattedDate;
};

export function validateName(name) {
  const regexp = /^[a-zA-Z0-9-_'. ]+$/;
  return regexp.test(String(name).toLowerCase().trim());
}

export function validateEmailField(value) {
  const emailPattern =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailPattern.test(value);
}

export function validatePhone(phoneNo) {
  const re = /^[0-9]{10}$/;
  return phoneNo && phoneNo.length && re.test(phoneNo.trim());
}

export function validatePasswordField(value) {
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±])[A-Za-z\d`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\|;:\'",<.>\/\?€£¥₹§±]{8,}$/;
  return passwordPattern.test(value);
}

export function checkIfNumber(value) {
  const numberPattern = /^[0-9]+$/;
  return numberPattern.test(value);
}

// transformImage simply modifies image URLs by resizing the image and adjusting the image resolution based on the device's pixel density (device pixel ratio)
export const transformImage = (url, key, width) => {
  const dpr = Math.min(
    Math.max(
      Math.round(isRunningOnClient() ? window.devicePixelRatio || 1 : 1),
      1
    ),
    5
  );
  let updatedUrl = url;

  // If both a key and width are provided, update the URL by replacing the part of the path that matches `key` with a resize instruction including the specified width.
  if (key && width) {
    const str = `/${key}/`;
    updatedUrl = url.replace(new RegExp(str), `/resize-w:${width}/`);
  }
  try {
    const parsedUrl = new URL(updatedUrl);
    parsedUrl.searchParams.append("dpr", 1);
    return parsedUrl.toString();
  } catch (error) {
    return updatedUrl;
  }
};

export function updateGraphQueryWithValue(mainString, replacements) {
  if (!mainString || !replacements || !Array.isArray(replacements)) {
    return mainString;
  }
  let mStr = mainString;
  // Iterate over the replacements and replace each occurrence in the main string
  replacements.forEach((replacement) => {
    const [search, replaceWith] = replacement;
    if (search && replaceWith) {
      mStr = mainString.split(search).join(replaceWith);
    }
  });
  return mStr;
}

// Throttle function limits the rate at which a function can be executed.
export function throttle(func, wait) {
  // Flag to indicate if the function is currently waiting to be executed
  let waiting = false;

  // Handler function that will be called to handle throttled execution
  function throttleHandler(...args) {
    // If the function is already waiting, do nothing
    if (waiting) {
      return;
    }

    // Set the waiting flag to true to prevent further calls
    waiting = true;

    // Set a timeout to execute the function after the specified wait time
    setTimeout(function executeFunction() {
      // Call the original function with the provided arguments
      func.apply(this, args);
      // Reset the waiting flag to allow future calls
      waiting = false;
    }, wait);
  }

  // Return the throttled function handler
  return throttleHandler;
}

export const detectMobileWidth = () => {
  if (isRunningOnClient()) {
    if (window && window.screen?.width <= 768) {
      return true;
    }
    return false;
  }
};

export const getProductImgAspectRatio = (
  global_config,
  defaultAspectRatio = 0.8
) => {
  const productImgWidth = global_config?.product_img_width;
  const productImgHeight = global_config?.product_img_height;
  if (productImgWidth && productImgHeight) {
    const aspectRatio = Number(productImgWidth / productImgHeight).toFixed(2);
    return aspectRatio >= 0.6 && aspectRatio <= 1
      ? aspectRatio
      : defaultAspectRatio;
  }

  return defaultAspectRatio;
};

export const currencyFormat = (value, currencySymbol) => {
  // Check if value is defined (including 0) and currencySymbol is provided
  if (value != null) {
    const formattedValue = value.toLocaleString("en-IN");

    // If currencySymbol is a valid uppercase currency code
    if (currencySymbol && /^[A-Z]+$/.test(currencySymbol)) {
      return `${currencySymbol} ${formattedValue}`;
    }

    // If currencySymbol is provided, attach it without space
    if (currencySymbol) {
      return `${currencySymbol}${formattedValue}`;
    }

    // Return formatted value without currencySymbol
    return formattedValue;
  }

  // Handle cases where value is null or undefined
  return "";
};

// Function to process and compute review rating data from custom metadata
export const getReviewRatingData = (customMeta) => {
  // Initialize an empty object to hold review rating data
  const data = {};

  // Check if customMeta is provided and is an array with elements
  if (customMeta && customMeta.length) {
    customMeta.forEach((item) => {
      if (item.key) {
        // Convert the item's value to a number and store it in the data object with the item's key
        data[item.key] = Number(item?.value || "");
      }
    });

    const avgRating = data.rating_sum / data.rating_count;

    // Store the average rating in the data object, rounded to one decimal place
    data.avg_ratings = Number(Number(avgRating).toFixed(1)) || 0;
  }

  // Return the data object containing review rating information
  return data;
};

export function removeCookie(name) {
  if (isRunningOnClient()) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}

export function getCookie(key) {
  if (isRunningOnClient()) {
    // Construct the cookie name string to search for
    const name = `${key}=`;
    // Decode the document.cookie string
    const decoded = decodeURIComponent(document.cookie);
    // Split the cookie string into an array of individual cookies
    const cArr = decoded.split("; ");
    let res;

    // Iterate through the cookie array to find the cookie with the specified key
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    });
    // If no cookie was found, return an empty string
    if (!res) {
      return "";
    }

    try {
      // Attempt to parse the cookie value as JSON
      return JSON.parse(res);
    } catch (e) {
      return res || null;
    }
  } else {
    // If not running on the client side, return null
    return null;
  }
}
