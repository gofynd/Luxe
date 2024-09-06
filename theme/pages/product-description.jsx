import React from "react";
import { useParams } from "react-router-dom";
import ProductDescriptionPdp from "../page-layouts/pdp/product-description/product-description";
import styles from "../styles/main.less";
import { GET_PRODUCT_DETAILS } from "../queries/pdpQuery";

function ProductDescription({ fpi }) {
  const { slug } = useParams();
  return (
    <div className={`${styles.basePageContainer} ${styles.margin0auto}`}>
      <ProductDescriptionPdp fpi={fpi} slug={slug} />
    </div>
  );
}

export const settings = JSON.stringify({
  props: [
    {
      type: "checkbox",
      id: "seller_store_selection",
      label: "Seller Store Selection",
      default: true,
    },
    {
      type: "checkbox",
      id: "add_to_compare",
      label: "Add to Compare",
      default: true,
      info: "Allow comparison of products",
    },
    {
      type: "checkbox",
      id: "show_seller",
      label: "Show Seller",
      default: true,
    },
    {
      type: "checkbox",
      id: "return",
      label: "Return",
      default: true,
    },
    {
      type: "checkbox",
      id: "item_code",
      label: "Show Item code",
      default: true,
    },
    {
      type: "checkbox",
      id: "product_details_bullets",
      label: "Show Bullets in Product Details",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_size_guide",
      label: "Show Size Guide",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_offers",
      label: "Show Offers",
      default: false,
    },
    {
      type: "color",
      id: "icon_color",
      label: "Play video icon color",
      default: "#D6D6D6",
    },
    {
      type: "checkbox",
      id: "mrp_label",
      label: "Display MRP label text",
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
    {
      type: "radio",
      id: "variant_position",
      label: "Product Detail Postion",
      default: "accordion",
      options: [
        {
          value: "accordion",
          text: "Accordion style",
        },
        {
          value: "tabs",
          text: "Tab style",
        },
      ],
    },
    {
      type: "checkbox",
      id: "show_products_breadcrumb",
      label: "Show Products breadcrumb",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_category_breadcrumb",
      label: "Show Category breadcrumb",
      default: true,
    },
    {
      type: "checkbox",
      id: "show_brand_breadcrumb",
      label: "Show Brand breadcrumb",
      default: true,
    },
    {
      type: "extension",
      id: "extension",
      label: "Extension Positions",
      info: "Handle extension in these positions",
      positions: [
        {
          value: "below_price_component",
          text: "Below Price Component",
        },
        {
          value: "below_product_info",
          text: "Below Delivery location",
        },
        {
          value: "product_description_bottom",
          text: "Below Product Description",
        },
      ],
      default: {},
    },
    {
      type: "image_picker",
      id: "badge_logo_1",
      label: "Badge logo 1",
      default: "",
      options: {
        aspect_ratio: "1:1",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "text",
      id: "badge_label_1",
      label: "Badge label 1",
      default: "",
    },
    {
      type: "url",
      id: "badge_url_1",
      label: "Badge URL 1",
      default: "",
    },
    {
      type: "image_picker",
      id: "badge_logo_2",
      label: "Badge logo 2",
      default: "",
      options: {
        aspect_ratio: "1:1",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "text",
      id: "badge_label_2",
      label: "Badge label 2",
      default: "",
    },
    {
      type: "url",
      id: "badge_url_2",
      label: "Badge URL 2",
      default: "",
    },
    {
      type: "image_picker",
      id: "badge_logo_3",
      label: "Badge logo 3",
      default: "",
      options: {
        aspect_ratio: "1:1",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "text",
      id: "badge_label_3",
      label: "Badge label 3",
      default: "",
    },
    {
      type: "url",
      id: "badge_url_3",
      label: "Badge URL 3",
      default: "",
    },
    {
      type: "image_picker",
      id: "badge_logo_4",
      label: "Badge logo 4",
      default: "",
      options: {
        aspect_ratio: "1:1",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "text",
      id: "badge_label_4",
      label: "Badge label 4",
      default: "",
    },
    {
      type: "url",
      id: "badge_url_4",
      label: "Badge URL 4",
      default: "",
    },
    {
      type: "image_picker",
      id: "badge_logo_5",
      label: "Badge logo 5",
      default: "",
      options: {
        aspect_ratio: "1:1",
        aspect_ratio_strict_check: true,
      },
    },
    {
      type: "text",
      id: "badge_label_5",
      label: "Badge label 5",
      default: "",
    },
    {
      type: "url",
      id: "badge_url_5",
      label: "Badge URL 5",
      default: "",
    },
  ],
  blocks: [],
});

export const sections = JSON.stringify([]);

ProductDescription.serverFetch = async ({ fpi, router }) => {
  const slug = router?.params?.slug;
  const values = {
    slug,
  };
  return fpi.executeGQL(GET_PRODUCT_DETAILS, values);
};

export default ProductDescription;
