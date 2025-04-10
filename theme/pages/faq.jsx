import React from "react";
import useFaq from "../page-layouts/faq/useFaq";
import FaqPage from "fdk-react-templates/pages/faq";
import "fdk-react-templates/pages/faq/faq.css";
import EmptyState from "../components/empty-state/empty-state";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import { useGlobalTranslation } from "fdk-core/utils";

function Faqs({ fpi }) {
  const { t } = useGlobalTranslation("translation");
  const faqProps = useFaq({ fpi });

  return (
    <FaqPage
      {...faqProps}
      EmptyStateComponent={() => (
        <EmptyState
          title={t("resource.faq.no_frequently_asked_questions_found")}
          Icon={<SvgWrapper svgSrc="no-faq" />}
          showButton={false}
        />
      )}
    />
  );
}

export const sections = JSON.stringify([]);

export default Faqs;
