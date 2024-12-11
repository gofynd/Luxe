import React from "react";
import FaqPage from "fdk-react-templates/pages/faq";
import useFaq from "../page-layouts/faq/useFaq";
import "fdk-react-templates/pages/faq/faq.css";

function Faqs({ fpi }) {
  const faqProps = useFaq({ fpi });

  return <FaqPage {...faqProps} />;
}

export const sections = JSON.stringify([]);

export default Faqs;
