import React, { useEffect } from "react";
import { useGlobalStore } from "fdk-core/utils";
import FyHTMLRenderer from "../components/core/fy-html-renderer/fy-html-renderer";
import { LEGAL_DATA } from "../queries/legalDocuments";
import { useRichText } from "../helper/hooks/hooks";

function Tnc({ fpi }) {
  const htmlContent = useGlobalStore(fpi?.getters?.LEGAL_DATA);
  const clientMarkedContent = useRichText(htmlContent?.tnc);

  return (
    <div
      className="basePageContainer margin0auto"
      style={{ padding: "20px", background: "#fff", whiteSpace: "pre-wrap" }}
    >
      {clientMarkedContent && (
        <FyHTMLRenderer htmlContent={clientMarkedContent} />
      )}
    </div>
  );
}

Tnc.serverFetch = async ({ fpi }) => {
  try {
    return fpi.executeGQL(LEGAL_DATA);
  } catch (error) {
    console.log({ error });
  }
};

export default Tnc;
