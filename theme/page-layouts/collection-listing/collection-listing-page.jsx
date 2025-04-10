import React from "react";
import { useParams } from "react-router-dom";
import ProductListing from "fdk-react-templates/pages/product-listing/product-listing";
import "fdk-react-templates/pages/product-listing/index.css";
import styles from "./collection-listing-page.less";
import useCollectionListing from "./useCollectionListing";
import { getHelmet } from "../../providers/global-provider";

const CollectionListingPage = ({ fpi }) => {
  const params = useParams();
  const slug = params?.slug;
  const listingProps = useCollectionListing({ fpi, slug });

  const { seo } = listingProps;

  return (
    <>
      {getHelmet({ seo })}
      <div className="margin0auto basePageContainer">
        <ProductListing {...listingProps} />
      </div>
    </>
  );
};

export default CollectionListingPage;
