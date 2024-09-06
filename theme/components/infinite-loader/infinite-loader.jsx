import React, { useEffect, useRef } from "react";
import styles from "./infinite-loader.less";

const InfiniteLoader = ({
  children,
  isLoading,
  loader,
  loadMore,
  hasNext,
  infiniteLoaderEnabled = true,
}) => {
  const observer = useRef();
  const lastElementRef = useRef(null);

  useEffect(() => {
    if (!infiniteLoaderEnabled) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNext && !isLoading) {
        loadMore();
      }
    });

    if (lastElementRef.current)
      observer.current.observe(lastElementRef.current);
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isLoading, hasNext, loadMore, infiniteLoaderEnabled]);

  return (
    <>
      {children}
      {infiniteLoaderEnabled && (
        <div ref={lastElementRef}>{hasNext && (loader || <Loader />)}</div>
      )}
    </>
  );
};

const Loader = () => {
  return (
    <div className={styles["loader-container"]}>
      <span className={`${styles["inline-svg"]} ${styles.rotate}`}>
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 174C140.869 174 174 140.869 174 100C174 59.1309 140.869 26 100 26C59.1309 26 26 59.1309 26 100C26 140.869 59.1309 174 100 174Z"
            stroke="#4E3F09"
            strokeWidth="20"
            strokeDasharray="348.72 120.24"
          />
        </svg>
      </span>
    </div>
  );
};

export default InfiniteLoader;
