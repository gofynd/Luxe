import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SvgWrapper from "../../components/core/svgWrapper/SvgWrapper";
import Modal from "../../components/core/modal/modal";
import { PRODUCT_COMPARISON } from "../../queries/compareQuery";
import { useSnackbar } from "../../helper/hooks";
import styles from "./compare.less";
import compareWarning from "../../assets/images/compare-warning.png";

const ProductCompareButton = ({ slug, fpi, customClass }) => {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [isOpen, setIsOpen] = useState(false);
  const [warning, setWarning] = useState("");

  const addCompareProducts = () => {
    if (!slug) return;
    const existingSlugs = JSON.parse(
      localStorage?.getItem("compare_slugs") || "[]"
    );
    if (existingSlugs.includes(slug)) {
      navigate("/compare");
    } else if (existingSlugs.length < 4) {
      compareProducts({ existingSlugs });
    } else {
      setWarning("You can only compare 4 products at a time");
      setIsOpen(true);
    }
  };

  const compareProducts = ({ existingSlugs = [], action = "" }) => {
    try {
      let productsToBeCompared = [];
      if (action === "remove") {
        localStorage.removeItem("compare_slug");
        productsToBeCompared = [slug];
      } else if (action === "goToCompare") {
        navigate("/compare");
      } else {
        productsToBeCompared = [slug, ...existingSlugs];
        fpi
          .executeGQL(PRODUCT_COMPARISON, { slug: productsToBeCompared })
          .then(({ data, errors }) => {
            if (errors) {
              setWarning(
                "Select products from the same category for comparison"
              );
              setIsOpen(true);
              return;
            }
            if (data?.productComparison) {
              localStorage?.setItem(
                "compare_slugs",
                JSON.stringify(productsToBeCompared)
              );
              navigate("/compare");
            }
          });
      }
    } catch (error) {
      showSnackbar("Something went wrong!", "error");
      throw error;
    }
  };
  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={`${styles.button} btnPrimary ${styles.flexCenter} ${styles.addToCompare} ${customClass}`}
        onClick={addCompareProducts}
      >
        <SvgWrapper svgSrc="compare-icon" className={styles.compareIcon} />
        Add to Compare
      </button>
      <Modal isOpen={isOpen} closeDialog={closeDialog}>
        <div className={styles.compareModal}>
          <button
            type="button"
            className={styles.crossBtn}
            onClick={closeDialog}
          >
            <SvgWrapper svgSrc="close" alt="close" />
          </button>
          <div className={styles.modalBody}>
            <div className={styles.modalContent}>
              <div className={styles.image}>
                <img src={compareWarning} alt="Warning" />
              </div>
              <div className={`${styles["bold-md"]} ${styles["primary-text"]}`}>
                {warning}
              </div>
            </div>
            <div className={styles["button-container"]}>
              <div>
                <button
                  type="button"
                  className={`${styles.button} btnSecondary`}
                  onClick={() => compareProducts({ action: "reset" })}
                >
                  Reset
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className={`${styles.button} btnPrimary ${styles.btnNoBorder}`}
                  onClick={() => compareProducts({ action: "goToCompare" })}
                >
                  Go to Compare
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCompareButton;
