import React from "react";
import useFaq from "../page-layouts/faq/useFaq";
import FaqPage from "fdk-react-templates/pages/faq";
import "fdk-react-templates/pages/faq/faq.css";

function Faqs({ fpi }) {
  const faqProps = useFaq({ fpi });

  return <FaqPage {...faqProps} />;
}

export const sections = JSON.stringify([]);

export default Faqs;
