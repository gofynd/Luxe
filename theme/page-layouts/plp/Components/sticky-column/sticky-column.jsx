import React, { useEffect, useRef, useState } from "react";

function StickyColumn({ children }) {
  const elementRef = useRef(null);
  const [lastKnownY, setLastKnownY] = useState(0);
  const [currentTop, setCurrentTop] = useState(0);
  const [pendingRaf, setPendingRaf] = useState(false);
  const [stickyHeaderOffset, setStickyHeaderOffset] = useState(0);

  const colStyle = {
    position: "sticky",
    alignSelf: "start",
    willChange: "top",
  };

  const getStickyHeaderOffset = () =>
    parseInt(
      getComputedStyle(elementRef.current).getPropertyValue("--headerHeight"),
      10 || 0
    );

  const getTopOffset = () => {
    if (!stickyHeaderOffset) {
      setStickyHeaderOffset(getStickyHeaderOffset());
    }
    return stickyHeaderOffset + 30;
  };
  const checkPosition = () => {
    if (pendingRaf) return;
    setPendingRaf(true);
    requestAnimationFrame(() => {
      const { top } = elementRef.current.getBoundingClientRect();
      const maxTop =
        top + window.scrollY - elementRef.current.offsetTop + getTopOffset();
      const minTop = elementRef.current.clientHeight - window.innerHeight + 30;

      if (window.scrollY < lastKnownY) {
        setCurrentTop(currentTop - (lastKnownY - window.scrollY));
      } else {
        setCurrentTop(currentTop + (window.scrollY - lastKnownY));
      }
      setLastKnownY(window.scrollY);
      setCurrentTop(
        Math.min(Math.max(currentTop, -minTop), maxTop, getTopOffset())
      );
      elementRef.current.style.top = `${currentTop}px`;
      setPendingRaf(false);
    });
  };

  const getInitialValues = () => {
    setLastKnownY(window.scrollY || 0);
    setCurrentTop(0);
    setPendingRaf(false);
    setStickyHeaderOffset(getStickyHeaderOffset());
  };

  const setupStickyScroll = () => {
    getInitialValues();
    window.addEventListener("scroll", checkPosition);
  };

  const destroyStickyScroll = () => {
    window.removeEventListener("scroll", checkPosition);
  };

  useEffect(() => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      setupStickyScroll();
      return () => destroyStickyScroll();
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return (
    <div style={colStyle} ref={elementRef}>
      {children}
    </div>
  );
}

export default StickyColumn;
