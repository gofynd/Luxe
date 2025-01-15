import React, { useState, useEffect } from "react";
import FyAccordion from "../../../../components/core/fy-accordion/fy-accordion";
import styles from "./prod-desc.less";
import { useRichText } from "../../../../helper/hooks";

function ProdDesc({ product, config, customClass }) {
  const getInitialActiveTab = (product) => {
    if ((product?.highlights || []).length) {
      return 0; // If highlights exist, set to tab 0
    }
    if ((product?.description || "").length) {
      return 1; // If description exists, set to tab 1
    }
    return 2; // Default to tab 2
  };

  const [activeTab, setActiveTab] = useState(getInitialActiveTab(product));
  const [productDescription, setProductDescription] = useState({
    details: product?.description || "",
    title: "Product Description",
  });
  const [productHighlight, setProductHighlight] = useState({
    details: product?.highlights || [],
    title: "Product Highlights",
  });

  useEffect(() => {
    setActiveTab(getInitialActiveTab(product));
    setProductDescription({
      ...productDescription,
      details: product?.description || "",
    });
    setProductHighlight({
      ...productHighlight,
      details: product?.highlights || [],
    });
  }, [product]);

  const isGroupedAttrAvailable = (attribute) => attribute?.details?.length;

  const getGroupedAttributes = () => {
    let counter = 1;
    return (
      product?.grouped_attributes?.map((item) => {
        counter += 1;
        return {
          ...item,
          tabId: counter,
        };
      }) || []
    );
  };

  const getActiveGroupedAttribute = () =>
    getGroupedAttributes().find((item) => item.tabId === activeTab);

  const isDescriptionTabs = () => config?.variant_position?.value === "tabs";

  const isProductHighlightAvailable = () =>
    productHighlight?.details?.length > 0;
  const isProductDescAvailable = () =>
    productDescription?.details?.length > 0 &&
    !productDescription?.details.startsWith("<style");

  const isDisplayDataAvailable = () =>
    isProductHighlightAvailable() ||
    isProductDescAvailable() ||
    getGroupedAttributes().some((attr) => isGroupedAttrAvailable(attr));

  const clientMarkedContent = useRichText(productDescription.details);

  return (
    <div className={customClass}>
      {isDisplayDataAvailable() && (
        <div
          className={`${styles.descContainerMobile} ${
            isDescriptionTabs() && styles.isDesktopHidden
          }`}
        >
          <FyAccordion isOpen={config?.first_accordian_open?.value}>
            {[
              <div className="h5">{productDescription?.title}</div>,
              <>
                {productDescription.details && (
                  <div
                    className={`b2 ${styles.pdpDetail}`}
                    dangerouslySetInnerHTML={{
                      __html: clientMarkedContent,
                    }}
                  >
                    {/* <FyHTMLRenderer
                    customClass={styles.productLongDescription}
                    htmlContent={productDescription.details}
                  ></FyHTMLRenderer> */}
                  </div>
                )}
                {productDescription?.details?.length === 0 && (
                  <div className={styles.noDataPlaceholder}>No Data Found</div>
                )}
              </>,
            ]}
          </FyAccordion>
          {getGroupedAttributes().map((attribute, index) => (
            <FyAccordion
              key={index}
              isOpen={false}
              className={styles.accordion}
            >
              {[
                <div className="h5">{attribute.title}</div>,
                <div className={styles.pdpDetail}>
                  {attribute?.details?.length > 0 ? (
                    <ul
                      className={`b2  ${
                        config?.product_details_bullets?.value &&
                        styles.bulletSpacing
                      }`}
                    >
                      {attribute.details.map((property, val) => (
                        <li key={`${val}${index}`}>
                          <span className={styles.prop}>
                            {`${property.key} :`}{" "}
                          </span>
                          <span
                            className={styles.val}
                            // eslint-disable-next-line react/no-danger
                            dangerouslySetInnerHTML={{ __html: property.value }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className={styles.noDataPlaceholder}>
                      No Data Found
                    </div>
                  )}
                </div>,
              ]}
            </FyAccordion>
          ))}
        </div>
      )}

      {isDescriptionTabs() && (
        <div className={styles.descContainerDesktop}>
          <div className={styles.tabsContainer}>
            {isProductHighlightAvailable() && (
              <button
                type="button"
                className={`${styles.tabs} ${activeTab === 0 && styles.active}`}
                onClick={() => setActiveTab(0)}
              >
                {productHighlight.title}
              </button>
            )}
            {isProductDescAvailable() && (
              <button
                type="button"
                className={`${styles.tabs} ${activeTab === 1 && styles.active}`}
                onClick={() => setActiveTab(1)}
              >
                {productDescription.title}
              </button>
            )}
            {getGroupedAttributes().map((attribute) => (
              <button
                type="button"
                key={attribute.tabId}
                className={`${styles.tabs} ${
                  activeTab === attribute.tabId && styles.active
                }`}
                onClick={() => setActiveTab(attribute.tabId)}
              >
                {attribute.title}
              </button>
            ))}
          </div>
          {isDisplayDataAvailable() && (
            <div className={`b2 ${styles.details}`}>
              {activeTab === 0 && isProductHighlightAvailable() && (
                <ul className={styles.items}>
                  {productHighlight.details.length > 0 ? (
                    productHighlight.details.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))
                  ) : (
                    <div className={styles.noDataPlaceholder}>
                      No Data Found
                    </div>
                  )}
                </ul>
              )}

              {activeTab === 1 && isProductDescAvailable() && (
                <div className={styles.productLongDescription}>
                  {productDescription.details ? (
                    <div
                      className={styles.pdpDetail}
                      dangerouslySetInnerHTML={{
                        __html: productDescription.details,
                      }}
                    />
                  ) : (
                    <div className={styles.noDataPlaceholder}>
                      No Data Found
                    </div>
                  )}
                </div>
              )}

              {activeTab > 1 && (
                <ul
                  className={
                    config?.product_details_bullets?.value && styles.items
                  }
                >
                  {getActiveGroupedAttribute()?.details?.length > 0 ? (
                    getActiveGroupedAttribute().details.map((property, val) => (
                      <li key={`${val}`}>
                        <span className={styles.prop}>
                          {`${property.key} :`}{" "}
                        </span>
                        <span className={styles.val}>{property.value}</span>
                      </li>
                    ))
                  ) : (
                    <div className={styles.noDataPlaceholder}>
                      No Data Found
                    </div>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProdDesc;
