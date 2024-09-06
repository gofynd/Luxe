import React from "react";
import ProductListing from "fdk-react-templates/pages/product-listing/product-listing";
import "fdk-react-templates/pages/product-listing/index.css";
import styles from "./collection-listing-page.less";
import useCollectionListing from "./useCollectionListing";

const CollectionListingPage = ({ fpi }) => {
  const listingProps = useCollectionListing({ fpi });

  return (
    <div className="margin0auto basePageContainer">
      <ProductListing {...listingProps} />
    </div>
  );
};

export default CollectionListingPage;
