import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGlobalStore } from "fdk-core/utils";
import { FAQ_CATEGORIES, FAQS_BY_CATEGORY } from "../../queries/faqQuery";

const useFaq = ({ fpi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [activeFaqCat, setActiveFaqCat] = useState(null);
  const [faqs, setFaqs] = useState(null);

  const { categories: faqCategories } =
    useGlobalStore(fpi?.getters?.FAQ_CATEGORIES) ?? {};
  const FAQS = useGlobalStore(fpi?.getters?.FAQS) ?? {};

  useEffect(() => {
    fpi.executeGQL(FAQ_CATEGORIES);
  }, []);

  useEffect(() => {
    setFaqs(FAQS.faqs);
  }, [FAQS.faqs]);

  useEffect(() => {
    const slug = searchParams.get("category");
    if (faqCategories?.length && !slug) {
      const defaultSlug = faqCategories?.[0]?.slug ?? "";
      setActiveFaqCat(
        faqCategories?.find((i) => i.slug === defaultSlug) ?? null
      );
      fpi.executeGQL(FAQS_BY_CATEGORY, { slug: defaultSlug });
    }
  }, [faqCategories]);

  useEffect(() => {
    const slug = searchParams.get("category");
    if (slug) {
      setActiveFaqCat(faqCategories?.find((i) => i.slug === slug) ?? null);
      fpi.executeGQL(FAQS_BY_CATEGORY, { slug });
    }
  }, [location.search, faqCategories]);

  const updateSearchParams = ({ key = "category", value, action }) => {
    if (action === "delete") {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: false,
    });
  };

  return {
    faqCategories,
    activeFaqCat,
    faqs,
    setFaqs,
    updateSearchParams,
    hasCatQuery: !!searchParams.get("category"),
  };
};

export default useFaq;
