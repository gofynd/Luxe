import React from "react";
import ProductListing from "@gofynd/theme-template/pages/product-listing/product-listing";
import "@gofynd/theme-template/pages/product-listing/index.css";
import useProductListing from "./useProductListing";

const ProductListingPage = ({ fpi }) => {
  const listingProps = useProductListing({ fpi });

  return (
    <div className="margin0auto basePageContainer">
      <ProductListing {...listingProps} />
    </div>
  );
};

export default ProductListingPage;
