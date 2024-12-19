import React from "react";
import FaqPage from "@gofynd/theme-template/pages/faq";
import useFaq from "../page-layouts/faq/useFaq";
import "@gofynd/theme-template/pages/faq/faq.css";

function Faqs({ fpi }) {
  const faqProps = useFaq({ fpi });

  return <FaqPage {...faqProps} />;
}

export const sections = JSON.stringify([]);

export default Faqs;
