import React, { useState, useEffect, useMemo } from "react";
import { FDKLink } from "fdk-core/components";
import PropTypes from "prop-types";
import Modal from "@gofynd/theme-template/components/core/modal/modal";
import styles from "./size-guide.less";
import SvgWrapper from "../../../components/core/svgWrapper/SvgWrapper";
import FyImage from "../../../components/core/fy-image/fy-image";
import FyHTMLRenderer from "../../../components/core/fy-html-renderer/fy-html-renderer";
import "@gofynd/theme-template/components/core/modal/modal.css";

function SizeGuide({ isOpen, productMeta, onCloseDialog }) {
  const [previewSelectedMetric, setPreviewSelectedMetric] = useState("cm");
  const [selectedMetric, setSelectedMetric] = useState("cm");
  const [activeTab, setActiveTab] = useState("size_guide");
  const [touched, setTouched] = useState(false);

  const values = {
    in: "inch",
    cm: "cm",
  };

  const headers = Object.entries(productMeta?.size_chart?.headers ?? {}).filter(
    ([key, val]) => !key?.includes("__") && val !== null
  );

  useEffect(() => {
    if (productMeta?.size_chart?.unit) {
      setPreviewSelectedMetric(productMeta?.size_chart.unit);
      setSelectedMetric(productMeta?.size_chart.unit);
    }
  }, [productMeta]);

  const changeSelectedMetric = (val) => {
    setPreviewSelectedMetric(val);

    if (selectedMetric === val) {
      setTouched(false);
    } else {
      setTouched(true);
    }
  };

  const isSizeChartAvailable = () => {
    const sizeChartHeader = productMeta?.size_chart?.headers || {};
    return Object.keys(sizeChartHeader).length > 0;
  };

  const convertMetrics = (val) => {
    if (previewSelectedMetric === "cm" && touched) {
      let finalVal = "";
      val = val.split("-");
      for (let i = 0; i < val.length; i += 1) {
        if (i !== 0 && i < val.length) {
          finalVal += "-";
        }
        if (!Number.isNaN(Number(val[i]))) {
          finalVal += (Number(val[i]) * 2.54).toFixed(1); // inches to cm
        } else {
          finalVal += val[i];
        }
      }
      return finalVal;
    }

    if (previewSelectedMetric === "in" && touched) {
      let finalVal = "";
      val = val.split("-");
      for (let i = 0; i < val.length; i += 1) {
        if (i !== 0 && i < val.length) {
          finalVal += "-";
        }
        if (!Number.isNaN(Number(val[i]))) {
          finalVal += (Number(val[i]) / 2.54).toFixed(1); // cm to inches
        } else {
          finalVal += val[i];
        }
      }
      return finalVal;
    }

    return val;
  };

  const displayStyle = useMemo(() => {
    let displayStyle = "none";
    if (activeTab === "measure") {
      displayStyle = productMeta.size_chart.image ? "block" : "flex";
    }
    return displayStyle;
  }, [activeTab]);

  return (
    <Modal
      modalType="right-modal"
      isOpen={isOpen}
      title=""
      closeDialog={(e) => onCloseDialog(e)}
      headerClassName={styles.sidebarHeader}
      bodyClassName={styles.sizeContainer}
    >
      {/* Size Guide Dialog */}
      <div>
        {/* Tabs */}
        <div className={styles.sizeTabs}>
          {/* Size Guide Tab */}
          {isSizeChartAvailable() && (
            <button
              type="button"
              className={`b2 ${styles.tab} ${styles.tabSizeGuide} ${
                activeTab === "size_guide" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("size_guide")}
            >
              Size guide
            </button>
          )}

          {/* Measure Tab */}
          {productMeta?.size_chart && (
            <button
              type="button"
              className={`b2 ${styles.tab} ${styles.tabMeasure} ${
                activeTab === "measure" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("measure")}
            >
              How to measure
            </button>
          )}
        </div>

        {/* Body */}
        <div className={styles.sidebarBody}>
          {/* Left Container */}
          <div
            className={`${styles.leftContainer} ${
              !productMeta?.size_chart?.image ? styles.cstLw : ""
            }`}
            style={{ display: activeTab === "size_guide" ? "block" : "none" }}
          >
            {/* Button Group */}
            <div className={styles.btnGroup}>
              <h4 className="h4 fontHeader" style={{ marginBottom: "16px" }}>
                {productMeta?.size_chart?.title}
              </h4>
              <div className={styles.btnContainer}>
                {isSizeChartAvailable() &&
                  Object.entries(values)?.map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        changeSelectedMetric(key);
                      }}
                      className={`h5 ${styles.unitBtn} ${styles.fontBody} ${
                        previewSelectedMetric === key
                          ? styles.unitBtnSelected
                          : ""
                      }`}
                    >
                      {val}
                    </button>
                  ))}
              </div>
            </div>
            {/* Size Description */}
            {productMeta?.size_chart &&
              productMeta?.size_chart?.description && (
                <div className={styles.sizeDesc}>
                  <FyHTMLRenderer
                    htmlContent={productMeta?.size_chart?.description}
                  />
                </div>
              )}

            <div className={styles.sizeInfo}>
              <table className={styles.sizeTable}>
                <thead>
                  <tr>
                    {headers?.map(
                      ([key, val]) =>
                        val !== null && (
                          <th
                            key={`column${key}`}
                            className={`b2 ${styles.sizeHeader}`}
                          >
                            {val?.value}
                          </th>
                        )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {productMeta?.size_chart?.sizes?.map((row, index) => (
                    <tr key={`row_${index}`} className={styles.sizeRow}>
                      {Object.entries(row)
                        .filter(
                          ([key, val]) => !key?.includes("__") && val !== null
                        )
                        ?.map(([key, val], index2) => (
                          <td
                            key={`cell_${key}`}
                            className={`captionNormal ${styles.sizeCell}`}
                          >
                            {headers[index2][1]?.convertable
                              ? convertMetrics(val)
                              : val}
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isSizeChartAvailable() && (
              <div className={styles.notAvailable}>
                <h3 className={styles.fontHeader}>
                  Not available, contact us for more information
                </h3>
                <FDKLink to="/contact-us" target="_blank">
                  <button
                    type="button"
                    className={`${styles.contactUs} btnPrimary ${styles.fontBody}`}
                  >
                    CONTACT US
                  </button>
                </FDKLink>
              </div>
            )}
          </div>

          <div
            className={styles.rightContainer}
            style={{
              display: displayStyle,
            }}
          >
            {productMeta &&
              productMeta.size_chart &&
              productMeta.size_chart.image && (
                <div className={styles.sizeGuideImage}>
                  <FyImage
                    src={productMeta.size_chart.image}
                    alt={productMeta.size_chart.title}
                    sources={[{ width: 500 }]}
                    aspectRatio="0.8"
                    mobileAspectRatio="0.8"
                  />
                </div>
              )}

            {/* Not Available */}
            {!productMeta ||
              !productMeta.size_chart ||
              (!productMeta.size_chart.image && (
                <div className={styles.notAvailable}>
                  <h3 className={styles.fontHeader}>
                    Not available, contact us for more information
                  </h3>
                  <FDKLink to="/contact-us" target="_blank">
                    <button
                      type="button"
                      className={`${styles.contactUs} btnPrimary ${styles.fontBody}`}
                    >
                      CONTACT US
                    </button>
                  </FDKLink>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

SizeGuide.propTypes = {
  isOpen: PropTypes.bool,
  productMeta: PropTypes.shape({
    sizeChart: PropTypes.shape({
      unit: PropTypes.string,
    }),
  }),
  onCloseDialog: PropTypes.func,
};

export default SizeGuide;
