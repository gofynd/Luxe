import React, { useState, useEffect } from "react";
import FyHTMLRenderer from "../components/core/fy-html-renderer/fy-html-renderer";
import { useGlobalStore } from "fdk-core/utils";
import { LEGAL_DATA } from "../queries/legalDocuments";
import { useRichText } from "../helper/hooks/hooks";

function Policy({ fpi }) {
  const htmlContent = useGlobalStore(fpi?.getters?.LEGAL_DATA);

  // Preprocess the Markdown content to handle custom syntax
  const clientMarkedContent = useRichText(htmlContent?.policy);

  return (
    <div
      className="basePageContainer margin0auto"
      style={{
        padding: "20px",
        background: "#fff",
        whiteSpace: "pre-wrap",
      }}
    >
      {clientMarkedContent && (
        <FyHTMLRenderer htmlContent={clientMarkedContent} />
      )}
    </div>
  );
}

Policy.serverFetch = async ({ fpi }) => {
  try {
    return await fpi.executeGQL(LEGAL_DATA);
  } catch (error) {
    console.log({ error });
  }
};

export const sections = JSON.stringify([]);

export default Policy;
