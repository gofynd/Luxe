import React from "react";
import { useParams } from "react-router-dom";
import ProductListing from "@gofynd/theme-template/pages/product-listing/product-listing";
import "@gofynd/theme-template/pages/product-listing/index.css";
import styles from "./collection-listing-page.less";
import useCollectionListing from "./useCollectionListing";
import { getHelmet } from "../../providers/global-provider";

const CollectionListingPage = ({ fpi }) => {
  const params = useParams();
  const slug = params?.slug;
  const listingProps = useCollectionListing({ fpi, slug });

  const { title, description } = listingProps;
  return (
    <>
      {getHelmet({ seo: { title, description } })}
      <div className="margin0auto basePageContainer">
        <ProductListing {...listingProps} />
      </div>
    </>
  );
};

export default CollectionListingPage;
