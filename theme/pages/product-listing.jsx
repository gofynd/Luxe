import React from "react";
import ProductListingPage from "../page-layouts/plp/product-listing-page";
import { PLP_PRODUCTS, BRAND_META, CATEGORY_META } from "../queries/plpQuery";

const ProductListing = ({ fpi }) => {
  return <ProductListingPage fpi={fpi} />;
};

export const settings = JSON.stringify({
  props: [
    {
      type: "image_picker",
      id: "desktop_banner",
      label: "Desktop Banner Image",
      default: "",
    },
    {
      type: "image_picker",
      id: "mobile_banner",
      label: "Mobile Banner Image",
      default: "",
    },
    {
      type: "url",
      id: "banner_link",
      default: "",
      label: "Redirect",
    },
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
      default: "pagination",
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
    {
      type: "checkbox",
      id: "show_add_to_cart",
      label: "Show Add to Cart",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_size_guide",
      label: "Show Size Guide",
      default: true,
    },
    {
      type: "text",
      id: "tax_label",
      label: "Price tax label text",
      default: "Price inclusive of all tax",
    },
    {
      type: "checkbox",
      id: "mandatory_pincode",
      label: "Mandatory Delivery check",
      default: true,
    },
    {
      type: "checkbox",
      id: "hide_single_size",
      label: "Hide single size",
      default: false,
    },
    {
      type: "checkbox",
      id: "preselect_size",
      label: "Preselect size",
      info: "Applicable only for multiple-size products",
      default: true,
    },
    {
      type: "radio",
      id: "size_selection_style",
      label: "Size selection style",
      default: "dropdown",
      options: [
        {
          value: "dropdown",
          text: "Dropdown style",
        },
        {
          value: "block",
          text: "Block style",
        },
      ],
    },
  ],
});

export const sections = JSON.stringify([]);

ProductListing.serverFetch = async ({ fpi, router }) => {
  let filterQuery = "";
  let sortQuery = "";
  let search = "";
  let pageNo = null;
  Object.keys(router.filterQuery)?.forEach((key) => {
    if (key === "page_no") {
      pageNo = parseInt(router.filterQuery[key], 10);
    } else if (key === "sort_on") {
      sortQuery = router.filterQuery[key];
    } else if (key === "q") {
      search = router.filterQuery[key];
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

    if (key === "category") {
      const slug = Array.isArray(router.filterQuery[key])
        ? router.filterQuery[key][0]
        : router.filterQuery[key];
      fpi.executeGQL(CATEGORY_META, { slug });
    }
    if (key === "brand") {
      const slug = Array.isArray(router.filterQuery[key])
        ? router.filterQuery[key][0]
        : router.filterQuery[key];
      fpi.executeGQL(BRAND_META, { slug });
    }
  });

  const payload = {
    filterQuery,
    sortOn: sortQuery,
    search,
    enableFilter: true,
    first: 12,
    pageType: "number",
  };
  if (pageNo) payload.pageNo = pageNo;

  fpi.custom.setValue("isPlpSsrFetched", true);

  return fpi.executeGQL(PLP_PRODUCTS, payload);
};

export default ProductListing;
