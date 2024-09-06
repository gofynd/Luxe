import React, { useState, useEffect } from "react";
import FyAccordion from "../../../../components/core/fy-accordion/fy-accordion";
import FyHTMLRenderer from "../../../../components/core/fy-html-renderer/fy-html-renderer";
import styles from "./prod-desc.less";

function ProdDesc({ product, pageConfig, customClass }) {
  const [activeTab, setActiveTab] = useState(
    (product?.highlights || []).length ? 0 : 1
  );
  const [productDescription, setProductDescription] = useState({
    details: product?.description || "",
    title: "Product Description",
  });
  const [productHighlight, setProductHighlight] = useState({
    details: product?.highlights || [],
    title: "Product Highlights",
  });

  useEffect(() => {
    setActiveTab((product?.highlights || []).length ? 0 : 1);
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

  const isDescriptionTabs = () => pageConfig?.variant_position === "tabs";

  const isProductHighlightAvailable = () =>
    productHighlight?.details?.length > 0;
  const isProductDescAvailable = () => productDescription?.details?.length > 0;

  const isDisplayDataAvailable = () =>
    isProductHighlightAvailable() ||
    isProductDescAvailable() ||
    getGroupedAttributes().some((attr) => isGroupedAttrAvailable(attr));

  return (
    <div className={customClass}>
      {isDisplayDataAvailable() && (
        <div
          className={`${styles.descContainerMobile} ${
            isDescriptionTabs() && styles.isDesktopHidden
          }`}
        >
          <FyAccordion isOpen={true}>
            {[
              <div className={styles.h5}>{productDescription?.title}</div>,
              <>
                {productDescription.details && (
                  <div
                    className={`${styles.b2} ${styles.pdpDetail}`}
                    dangerouslySetInnerHTML={{
                      __html: productDescription.details,
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
                <div className={styles.h5}>{attribute.title}</div>,
                <div className={styles.pdpDetail}>
                  {attribute?.details?.length > 0 ? (
                    <ul
                      className={`${styles.b2}  ${
                        pageConfig?.product_details_bullets &&
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
          <div className={`${styles.b2} ${styles.details}`}>
            {activeTab === 0 && isProductHighlightAvailable() && (
              <ul className={styles.items}>
                {productHighlight.details.length > 0 ? (
                  productHighlight.details.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                ) : (
                  <div className={styles.noDataPlaceholder}>No Data Found</div>
                )}
              </ul>
            )}

            {activeTab === 1 && isProductDescAvailable() && (
              <div className={styles.productLongDescription}>
                {productDescription.details ? (
                  <FyHTMLRenderer
                    customClass={styles.pdpDetail}
                    htmlContent={productDescription.details}
                  />
                ) : (
                  <div className={styles.noDataPlaceholder}>No Data Found</div>
                )}
              </div>
            )}

            {activeTab > 1 && (
              <ul
                className={pageConfig?.product_details_bullets && styles.items}
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
                  <div className={styles.noDataPlaceholder}>No Data Found</div>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProdDesc;
