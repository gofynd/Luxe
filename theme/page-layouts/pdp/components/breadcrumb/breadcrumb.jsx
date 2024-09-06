import React from "react";
import { FDKLink } from "fdk-core/components";
import { convertActionToUrl } from "@gofynd/fdk-client-javascript/sdk/common/Utility";
import styles from "./breadcrumb.less";

function BreadCrumb({ productData, pageConfig, customClass }) {
  console.log(productData);
  const getBrand = () => productData?.brand || {};

  const getCategory = () => {
    const category = productData?.categories?.[0] || {};
    const updatedCategory = {};
    const categorySlug = category?.action?.page?.query?.category?.[0] || "";
    updatedCategory.name = category.name || "";
    updatedCategory.url = categorySlug && `/products/?category=${categorySlug}`;

    return updatedCategory;
  };

  return (
    <div
      className={`${styles.breadcrumbs} ${styles.captionNormal} ${customClass}`}
    >
      <span>
        <FDKLink to="/">Home</FDKLink>&nbsp;/&nbsp;
      </span>
      {pageConfig?.show_products_breadcrumb && (
        <span>
          <FDKLink to="/products">Products</FDKLink>&nbsp;/&nbsp;
        </span>
      )}
      {pageConfig?.show_category_breadcrumb && getCategory().name && (
        <span>
          <FDKLink to={getCategory().url}>{getCategory().name}</FDKLink>
          &nbsp;/&nbsp;
        </span>
      )}
      {pageConfig?.show_brand_breadcrumb && getBrand().name && (
        <span>
          <FDKLink to={convertActionToUrl(getBrand().action)}>
            {getBrand().name}
          </FDKLink>
          &nbsp;/&nbsp;
        </span>
      )}
      {productData?.name && (
        <span className={styles.active}>{productData?.name}</span>
      )}
    </div>
  );
}

export default BreadCrumb;
