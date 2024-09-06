import React from "react";
import { FDKLink } from "fdk-core/components";
import useCompare from "./useCompare";
import styles from "./compare.less";
import Loader from "../../components/loader/loader";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import FyImage from "../../components/core/fy-image/fy-image";
import ProductCard from "fdk-react-templates/components/product-card/product-card";
import "fdk-react-templates/components/product-card/product-card.css";

function CompareProducts({ fpi }) {
  const {
    isLoading,
    products,
    attributes,
    category,
    handleAdd,
    handleRemove,
    showSearch,
    setShowSearch,
    searchText,
    handleInputChange,
    filteredSuggestions,
  } = useCompare(fpi);

  const isDifferent = (attr) => {
    const attributes = products.map((p) => p.attributes[attr.key]);
    const allEqual = attributes.every((a) => a === attributes[0]);
    return !allEqual;
  };

  const getAttribute = (cProduct, attribute) => {
    let value = cProduct.attributes[attribute.key];
    if (!value) {
      return "---";
    } else if (Array.isArray(value)) {
      value = value.join(", ");
    }
    return value;
  };

  const checkHtml = (string) => {
    return /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
      string
    );
  };

  return (
    <div
      className={`${styles.compare} ${styles.basePageContainer} ${styles.margin0auto} fontBody`}
    >
      <div className={`${styles.compare__breadcrumbs} ${styles.captionNormal}`}>
        <span>
          <FDKLink to="/">Home</FDKLink>&nbsp; / &nbsp;
        </span>
        <span>
          <FDKLink to="/products">Products</FDKLink>&nbsp; / &nbsp;
        </span>
        {category?.name && category?.url && (
          <span>
            <FDKLink to={category?.url}>{category?.name}</FDKLink>
            &nbsp; / &nbsp;
          </span>
        )}
        <span className={styles.active}>Compare Products</span>
      </div>
      <h1 className={`${styles.compare__title} fontHeader`}>
        Compare Products
      </h1>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          {!showSearch ? (
            <div className={styles.compareContainer}>
              <div className={styles.productList}>
                <div className={styles.emptyStateCont}>
                  {(products?.length < 4 || products?.length === 0) && (
                    <div
                      className={styles.emptyBox}
                      onClick={() => {
                        setShowSearch(true);
                      }}
                    >
                      <SvgWrapper svgSrc="compare-arrow" />
                      <div>Add Products To Compare</div>
                    </div>
                  )}
                </div>
                {products?.length > 0 &&
                  products.map((item, index) => (
                    <div key={index} className={styles.product}>
                      <div
                        className={styles.crossBtn}
                        onClick={() => handleRemove(item.slug)}
                      >
                        <SvgWrapper svgSrc="close" />
                      </div>

                      <FDKLink to={`/product/${item.slug}`}>
                        <ProductCard
                          product={item}
                          isSaleBadgeDisplayed={false}
                          isWishlistDisplayed={false}
                          isWishlistIcon={false}
                        />
                      </FDKLink>
                    </div>
                  ))}
              </div>

              <div className={styles.attributeList}>
                {products.length > 0 && (
                  <div className={styles.attribute}>
                    {attributes?.map((attributesMetadata, id) => (
                      <div key={id}>
                        {attributesMetadata.details.map((attribute, aid) => (
                          <div
                            key={`cl${id}${aid}`}
                            className={styles.attrListWrap}
                          >
                            <div
                              className={`${styles.attrName} ${styles.alignAttribute} ${
                                isDifferent(attribute) ? styles.differ : ""
                              }`}
                            >
                              {attribute.display}
                            </div>
                            {products.map((cProduct, idx) => (
                              <div
                                key={`cp${idx}`}
                                className={`${styles.attrDescName} ${styles.alignAttribute}`}
                              >
                                {checkHtml(
                                  getAttribute(cProduct, attribute)
                                ) ? (
                                  <span
                                    className={styles.attr}
                                    style={{ textAlign: "left" }}
                                    dangerouslySetInnerHTML={{
                                      __html: getAttribute(cProduct, attribute),
                                    }}
                                  />
                                ) : (
                                  <span className={styles.attr}>
                                    {getAttribute(cProduct, attribute)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {products?.length >= 4 && (
                <div className={`${styles.errorMessage} ${styles.attr}`}>
                  *You can only add four products at a time
                </div>
              )}
            </div>
          ) : (
            <div className={styles.addSearchContainer}>
              <div className={styles.searchBox}>
                <div className={styles.searchBlock}>
                  <div className={styles.searchHeader}>
                    <div className={styles.addSearchTitle}>Search Here</div>
                    {products?.length > 0 && (
                      <div
                        className={styles.crossBtn}
                        onClick={() => setShowSearch(false)}
                      >
                        <SvgWrapper svgSrc="close" />
                      </div>
                    )}
                  </div>
                  <div className={styles.searchContainer}>
                    <input
                      className={styles.inputBox}
                      type="text"
                      defaultValue={searchText}
                      onChange={(e) => handleInputChange(e?.target?.value)}
                      placeholder="Search Product here"
                    />
                    <SvgWrapper
                      svg_src="search-black"
                      className={styles.searchIcon}
                    />
                  </div>
                </div>
                <div className={styles.popularhdng}>Add to compare</div>

                {filteredSuggestions?.length > 0 ? (
                  <div
                    className={`${styles.landingBestsellerHandest} ${styles.searchResults}`}
                  >
                    {filteredSuggestions.map((data, index) => (
                      <div key={index} className={styles.whiteSmallRBox}>
                        <div
                          className={styles.media}
                          onClick={() => {
                            handleAdd(data.slug);
                            setShowSearch(false);
                          }}
                        >
                          <div className={styles.mediaLeft}>
                            <FyImage
                              className={styles.fill}
                              src={data?.media?.[0]?.url}
                              alt={data?.media?.[0]?.alt}
                              sources={[{ width: 55 }]}
                            />
                          </div>
                          <div className={styles.mediaLeftName}>
                            {data.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.notFoundBlock}>
                    <div className={styles.notFound}>No Product Found</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CompareProducts;
