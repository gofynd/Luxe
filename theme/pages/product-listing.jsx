import React from "react";
import { useGlobalStore } from "fdk-core/utils";
import ProductListingPage from "../page-layouts/plp/product-listing-page";
import { PRODUCTS } from "../queries/plpQuery";

const ProductListing = ({ fpi }) => {
  return <ProductListingPage fpi={fpi} />;
};

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "product_number",
      label: "Show product numbers",
      default: true,
    },
    {
      id: "loading_options",
      type: "select",
      options: [
        {
          value: "view_more",
          text: "View More",
        },
        {
          value: "infinite",
          text: "Infinite Loading",
        },
        {
          value: "pagination",
          text: "Pagination",
        },
      ],
      default: "infinite",
      label: "Loading Options",
    },
    {
      type: "checkbox",
      id: "back_top",
      label: "Show back to top button",
      default: true,
    },
    {
      type: "checkbox",
      id: "in_new_tab",
      label: "Open product in new tab",
      default: true,
      info: "Open product in new tab for desktop",
    },
    {
      type: "checkbox",
      id: "hide_brand",
      label: "Hide Brand Name",
      default: false,
      info: "Check to hide Brand name",
    },
    {
      id: "grid_desktop",
      type: "select",
      options: [
        {
          value: "4",
          text: "4 Cards",
        },
        {
          value: "2",
          text: "2 Cards",
        },
      ],
      default: "4",
      label: "Default grid layout desktop",
    },
    {
      id: "grid_tablet",
      type: "select",
      options: [
        {
          value: "3",
          text: "3 Cards",
        },
        {
          value: "2",
          text: "2 Cards",
        },
      ],
      default: "3",
      label: "Default grid layout tablet",
    },
    {
      id: "grid_mob",
      type: "select",
      options: [
        {
          value: "2",
          text: "2 Cards",
        },
        {
          value: "1",
          text: "1 Card",
        },
      ],
      default: "1",
      label: "Default grid layout mobile",
    },
    {
      id: "description",
      type: "textarea",
      default: "",
      label: "Description",
    },
  ],
});

ProductListing.serverFetch = async ({ fpi, router }) => {
  let filterQuery = "";
  let sortQuery = "";
  let pageNo = null;
  Object.keys(router.filterQuery)?.forEach((key) => {
    if (key === "page_no") {
      pageNo = parseInt(router.filterQuery[key], 10);
    } else if (key === "sort_on") {
      sortQuery = router.filterQuery[key];
    } else if (typeof router.filterQuery[key] === "string") {
      if (filterQuery.includes(":")) {
        filterQuery = `${filterQuery}:::${key}:${router.filterQuery[key]}`;
      } else {
        filterQuery = `${key}:${router.filterQuery[key]}`;
      }
    } else {
      router.filterQuery[key]?.forEach((item) => {
        if (filterQuery.includes(":")) {
          filterQuery = `${filterQuery}:::${key}:${item}`;
        } else {
          filterQuery = `${key}:${item}`;
        }
      });
    }
  });

  const payload = {
    filterQuery,
    sortOn: sortQuery,
    enableFilter: true,
    first: 12,
    pageType: "number",
  };
  if (pageNo) payload.pageNo = pageNo;
  return fpi.executeGQL(PRODUCTS, payload);
};

export default ProductListing;
