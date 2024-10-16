import React, { useState, useRef, useEffect, useMemo } from "react";

import { FDKLink } from "fdk-core/components";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import FyImage from "../core/fy-image/fy-image";
import {
  currencyFormat,
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../helper/utils";
import styles from "./product-hotspot.less";

const Hotspot = ({ product, hotspot, isMobile }) => {
  const [isActive, setIsActive] = useState(false);
  const [tooltipClassDesktop, setTooltipClassDesktop] = useState("");
  const [tooltipClassMobile, setTooltipClassMobile] = useState("");
  const hotspotRef = useRef(null);

  const showHotspot = () => setIsActive(true);
  const hideHotspot = () => setIsActive(false);

  const checkTooltipPosition = () => {
    if (!isRunningOnClient()) return;

    const hotspotElement = hotspotRef.current;
    if (!hotspotElement) return;

    const parentWidth = hotspotElement.offsetParent?.clientWidth;

    if (window.innerWidth > 480) {
      if (hotspotElement.offsetLeft < 165) {
        setTooltipClassDesktop("tooltip-right");
      }
      if (hotspotElement.offsetLeft + 165 > parentWidth) {
        setTooltipClassDesktop("tooltip-left");
      }
    } else {
      if (hotspotElement.offsetLeft < 136) {
        setTooltipClassMobile("tooltip-mob-right");
      }
      if (hotspotElement.offsetLeft + 136 > parentWidth) {
        setTooltipClassMobile("tooltip-mob-left");
      }
    }
  };

  useEffect(() => {
    checkTooltipPosition();
    if (isRunningOnClient()) {
      window.addEventListener("resize", checkTooltipPosition);
    }
    return () => {
      if (isRunningOnClient()) {
        window.removeEventListener("resize", checkTooltipPosition);
      }
    };
  }, []);

  const getHotspotStyle = useMemo(() => {
    let transform = "";
    let top;
    let right;
    let bottom;
    let left = "auto";
    const xpos = hotspot?.props?.x_position?.value;
    const ypos = hotspot?.props?.y_position?.value;

    if (xpos < 50) {
      left = `${xpos}%`;
    } else if (xpos === 50) {
      left = `${xpos}%`;
      transform += " translateX(-50%)";
    } else {
      left = "auto";
      right = `${100 - xpos}%`;
    }

    if (ypos < 50) {
      top = `${ypos}%`;
    } else if (ypos === 50) {
      top = `${ypos}%`;
      transform += " translateY(-50%)";
    } else {
      top = "auto";
      bottom = `${100 - ypos}%`;
    }

    return {
      "--top": top,
      "--right": right,
      "--bottom": bottom,
      "--left": left,
      "--transform": transform,
    };
  }, [hotspot]);

  const getProductImage = useMemo(() => {
    return product?.media?.find((media) => media.type === "image")?.url;
  }, [product, isMobile]);

  return (
    <div
      className={styles.hotspot}
      style={getHotspotStyle}
      onMouseEnter={() => showHotspot()}
      onMouseLeave={() => hideHotspot()}
      onClick={() => showHotspot()}
      ref={hotspotRef}
    >
      <SvgWrapper className={styles.hotspot__icon} svgSrc="hotspot" />
      {product && (
        <div
          className={`
            ${styles["hotspot__tooltip-wrapper"]}
            ${tooltipClassDesktop}
            ${tooltipClassMobile}
            ${isActive ? styles["hotspot__tooltip-wrapper--active"] : ""}
          `}
        >
          <FDKLink
            className={`${styles.hotspot__tooltip} ${styles.product}`}
            to={`/product/${product?.slug}`}
          >
            <FyImage
              customClass={`${styles.product__image} ${styles.fill}`}
              src={getProductImage}
              aspectRatio={getProductImgAspectRatio()}
              mobileAspectRatio={getProductImgAspectRatio()}
              sources={[{ width: 84 }]}
              placeholder={product?.name}
            />
            <div className={styles.product__meta}>
              <div className={styles.product__info}>
                {product?.brand?.name && (
                  <h4 className={styles.product__brand}>
                    {product.brand.name}
                  </h4>
                )}
                <p className={styles.product__name}>{product?.name}</p>
                {product?.sizes?.price?.effective?.min && (
                  <p className={styles.product__price}>
                    {currencyFormat(
                      product?.sizes?.price?.effective?.min,
                      product?.sizes?.price?.effective?.currency_symbol
                    )}
                  </p>
                )}
              </div>
              <SvgWrapper
                className={styles["icon-right"]}
                svgSrc="arrow-down"
              />
            </div>
          </FDKLink>
        </div>
      )}
    </div>
  );
};

export default Hotspot;
