import { useGlobalStore } from "fdk-core/utils";
import { useRef, useState, useEffect } from "react";
import Snackbar from "awesome-snackbar";
import { marked } from "marked";
import DOMPurify from "dompurify";

export function useLoggedInUser(fpi) {
  return {
    userData: useGlobalStore(fpi.getters.USER_DATA),
    loggedIn: useGlobalStore(fpi.getters.LOGGED_IN),
    userFetch: useGlobalStore(fpi.getters.USER_FETCHED),
  };
}

const getBgColor = (type) => {
  if (type === "success") {
    return "var(--successBackground)";
  }
  if (type === "error") {
    return "var(--errorBackground)";
  }
  return "var(--informationBackground)";
};

const getColor = (type) => {
  if (type === "success") {
    return "var(--successText)";
  }
  if (type === "error") {
    return "var(--errorText)";
  }
  return "var(--informationText)";
};

export const useSnackbar = () => {
  const snackbarRef = useRef(null);

  const showSnackbar = (message, type) => {
    // Dismiss the current snackbar if it exists
    if (snackbarRef?.current) {
      snackbarRef.current.hide();
    }

    // Create a new snackbar and store it in the ref
    snackbarRef.current = new Snackbar(`${message}`, {
      position: "top-right",
      timeout: 2000,
      style: {
        container: [["background-color", getBgColor(type)]],
        message: [["color", getColor(type)]],
        bold: [["font-weight", "bold"]],
        actionButton: [["color", "white"]],
      },
    });
  };

  return { showSnackbar };
};

export const useRichText = (htmlContent) => {
  const [clientMarkedContent, setClientMarkedContent] = useState("");

  const preprocessMarkdown = (markdown) => {
    return markdown
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/\+\+(.*?)\+\+/g, "<u>$1</u>")
      .replace(/==(.*?)==/g, "<mark>$1</mark>")
      .replace(/~~(.*?)~~/g, "<del>$1</del>")
      .replace(/\^\^([^^]+)\^\^/g, "<sup>$1</sup>")
      .replace(/,,(.*?),,/g, "<sub>$1</sub>")
      .replace(/{{youtube:(.*?)}}/g, (match, p1) => {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${p1}" frameborder="0" allowfullscreen></iframe>`;
      });
  };

  useEffect(() => {
    if (htmlContent) {
      const processedContent = preprocessMarkdown(htmlContent);
      const markedContent = marked(processedContent);
      const sanitizedHtml = DOMPurify.sanitize(markedContent);
      setClientMarkedContent(sanitizedHtml);
    }
  }, [htmlContent]);

  return clientMarkedContent;
};
