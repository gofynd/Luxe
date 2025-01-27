import React from "react";
import { useGlobalStore } from "fdk-core/utils";
import { SectionRenderer } from "fdk-core/components";
import { GET_PRODUCT_DETAILS } from "../queries/pdpQuery";
import { getHelmet } from "../providers/global-provider";

function ProductDescription({ fpi }) {
  const page = useGlobalStore(fpi.getters.PAGE) || {};
  const THEME = useGlobalStore(fpi.getters.THEME);
  const mode = THEME?.config?.list.find(
    (f) => f.name === THEME?.config?.current
  );
  const globalConfig = mode?.global_config?.custom?.props;
  const { sections = [], error, isLoading } = page || {};
  const PRODUCT = useGlobalStore(fpi.getters.PRODUCT);

  const {
    product_details: { seo = {} },
  } = PRODUCT;

  return (
    <>
      {getHelmet({ seo })}
      <div className="basePageContainer margin0auto">
        {page?.value === "product-description" && (
          <SectionRenderer
            sections={sections}
            fpi={fpi}
            globalConfig={globalConfig}
          />
        )}
      </div>
      {/* Note: Do not remove the below empty div, it is required to insert sticky add to cart at the bottom of the sections */}
      <div
        style={{ position: "sticky", bottom: "0" }}
        id="sticky-add-to-cart"
      ></div>
    </>
  );
}

export const sections = JSON.stringify([
  {
    attributes: {
      page: "product-description",
    },
  },
]);

export default ProductDescription;
