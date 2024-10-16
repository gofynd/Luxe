import React from "react";
import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../components/core/svgWrapper/SvgWrapper";
import useFaq from "../page-layouts/faq/useFaq";
import styles from "../styles/faq.less";

function Faqs({ fpi }) {
  const {
    faqCategories,
    activeFaqCat,
    faqs,
    setFaqs,
    updateSearchParams,
    hasCatQuery,
  } = useFaq({ fpi });

  const handleQuestionClick = (index) => {
    setFaqs((preVal) => {
      const updatedFaqs = [...preVal];
      updatedFaqs[index] = {
        ...updatedFaqs[index],
        open: !updatedFaqs[index].open,
      };
      return updatedFaqs;
    });
  };

  const handleCategoryClick = (params) => {
    updateSearchParams(params);
  };

  const navigateToContactUsPage = () => {};
  return (
    <div
      className={`${styles.faq} ${styles.basePageContainer} ${styles.margin0auto} fontBody`}
    >
      <div className={styles.heading}>
        <div className={styles["back-head"]}>
          {hasCatQuery && (
            <>
              <span
                onClick={() => {
                  updateSearchParams({ action: "delete" });
                }}
              >
                <SvgWrapper svgSrc="arrow-left" />
              </span>
              <h3 className={`${styles["show-on-mobile"]} fontHeader`}>
                {activeFaqCat?.title}
              </h3>
            </>
          )}
          <h3
            className={`${styles[hasCatQuery && "hide-on-mobile"]} fontHeader`}
          >
            Frequently Asked Questions
          </h3>
        </div>
        <div className={styles["contact-us"]}>
          <span>Still need help?</span>
          <FDKLink to="/contact-us">
            <button type="button" onClick={navigateToContactUsPage}>
              CONTACT US
            </button>
          </FDKLink>
        </div>
      </div>
      <div className={styles["faq-container"]}>
        <div
          className={`${styles.sidebar} ${styles[hasCatQuery && "hide-on-mobile"]}`}
        >
          <ul>
            {faqCategories?.map((el, i) => (
              <div
                key={i}
                onClick={() => handleCategoryClick({ value: el.slug })}
                className={activeFaqCat?.slug === el.slug ? styles.active : ""}
              >
                <SvgWrapper className={styles.star} svgSrc="star" />
                <li className="fontHeader">{el.title}</li>
                <SvgWrapper
                  className={styles.arrowRight}
                  svgSrc="arrow-right"
                />
              </div>
            ))}
          </ul>
        </div>
        <div
          className={`${styles.contentContainer} ${!hasCatQuery && styles["hide-on-mobile"]}`}
        >
          <div className={styles.content}>
            <div
              className={`${styles["top-queries"]} ${styles["hide-on-mobile"]}`}
            >
              <h4 className="fontHeader">{activeFaqCat?.title}</h4>
            </div>
            <div className={styles["faq-list"]}>
              <ul>
                {faqs?.map((item, index) => (
                  <li
                    className={styles["faq-item"]}
                    key={index}
                    onClick={() => handleQuestionClick(index)}
                  >
                    <div className={styles.quesContainer}>
                      <div className={styles["qa-box"]}>
                        {" "}
                        <span className={`${styles.question} fontHeader`}>
                          {item.question}
                        </span>
                        {item.open && (
                          <div className={styles.answer}>{item.answer}</div>
                        )}
                      </div>
                      {item.open ? (
                        <SvgWrapper svgSrc="minus-circle" />
                      ) : (
                        <SvgWrapper svgSrc="plus-circle" />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const sections = JSON.stringify([]);

export default Faqs;
