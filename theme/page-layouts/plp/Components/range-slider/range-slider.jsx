/* eslint-disable no-undef */

import React, { useState } from "react";
import RangeSlider from "react-range-slider-input";
import styles from "./range-slider.less";
import { currencyFormat } from "../../../../helper/utils";

export default function InputRangeSlider({
  filterItem,
  showTextBox,
  showSliderText,
  reset,
  sliderQuery,
}) {
  const [displayVal, setDisplayVal] = useState(null);

  function generateDisplayValue(filter, data) {
    let count = 0;
    return filter.values[0].display_format.replace(/{}/g, (match) => {
      count += 1;
      return data[count - 1];
    });
  }

  const getSliderValue = () => {
    if (filterItem.key.kind === "range") {
      const sliderInfo = filterItem.values[0];
      if (sliderInfo.selected_max) {
        const data = [
          Math.floor(sliderInfo.selected_min),
          Math.floor(sliderInfo.selected_max),
        ];
        setDisplayVal(generateDisplayValue(filterItem, data));
        // this.filteritem.query = this.generateQuery(this.filteritem, data);
        return data;
      }
      const data = [Math.floor(sliderInfo.min), Math.floor(sliderInfo.max)];
      setDisplayVal(generateDisplayValue(filterItem, data));
      return data;
    }
    setDisplayVal(null);
    return null;
  };

  const initialSliderInfo = filterItem?.values?.[0];
  const initialSliderData = getSliderValue();
  const initialMinInput =
    Array.isArray(initialSliderData) && initialSliderData.length > 0
      ? initialSliderData?.[0]
      : 0;
  const initialMaxInput =
    Array.isArray(initialSliderData) && initialSliderData.length > 0
      ? initialSliderData[1]
      : 0;
  const initialOptions = {
    lazy: true,
    useKeyboard: false,
    formatter: (v) =>
      currencyFormat(v, filterItem.values[0].currency_symbol || ""),
  };

  // const [sliderInfo, setSliderInfo] = useState(initialSliderInfo);
  // const [sliderVal, setSliderVal] = useState(initialSliderData);

  const [minInput, setMinInput] = useState(initialMinInput);
  const [maxInput, setMaxInput] = useState(initialMaxInput);

  function generateQuery(filter, data) {
    let count = 0;
    return filter.values[0].query_format.replace(/{}/g, (match) => {
      count += 1;
      return data[count - 1];
    });
  }

  function updateSliderInfo() {
    // let data = this.$refs.slider.getValue();
    const data = sliderVal;
    if (showTextBox) {
      setMinInput(data[0]);
      setMaxInput(data[1]);
    }
    const strQuery = generateQuery(filterItem, data);

    sliderQuery(strQuery);
  }

  function onChangeInput(event) {
    const min = parseInt(minInput, 10);
    const max = parseInt(maxInput, 10);
    if (
      min >= 0 &&
      max >= 0 &&
      min >= sliderInfo.min &&
      max <= sliderInfo.max
    ) {
      if (Number(minInput) <= Number(maxInput)) {
        const sliderValue = [Number(minInput), Number(maxInput)];
        setDisplayVal(generateDisplayValue(filterItem, sliderValue));
        const strQuery = generateQuery(filterItem, sliderValue);
        sliderQuery(strQuery);
      }
    }
  }

  function debounceInput() {
    const time = setTimeout(() => {
      onChangeInput();
    }, 500);
    clearInterval(time);
  }

  return (
    <div>
      <div className={styles["slider-filter"]}>
        {showSliderText && (
          <div className={`${styles["cl-mako"]} ${styles["light-xxxs"]}`}>
            {filterItem?.values?.[0] &&
              !filterItem?.values?.[0]?.currency_code && (
                <div>{displayVal}</div>
              )}
            {filterItem?.values?.[0] &&
              filterItem?.values?.[0]?.currency_code && (
                <div>
                  {currencyFormat(
                    sliderVal?.[0],
                    filterItem?.values?.[0]?.currency_code
                  )}
                  to
                  {currencyFormat(
                    sliderVal?.[1],
                    filterItem?.values?.[0]?.currency_code
                  )}
                </div>
              )}
          </div>
        )}
        <RangeSlider
          className={styles["price-slider"]}
          value={sliderVal}
          min={Math.floor(sliderInfo.min)}
          max={Math.floor(sliderInfo.max)}
          onInput={(e) => updateSliderInfo(e)}
          onRangeDragEnd={(e) => updateSliderInfo(e)}
        />
        {/* <no-ssr>
        
      <vue-slider
        ref="slider"
        class="price-slider font-body"
        v-model="sliderVal"
        :height="4"
        :min="Math.floor(sliderInfo.min)"
        :max="Math.floor(sliderInfo.max)"
        v-bind="options"
        @click.native="updateSliderInfo($event)"
        @touchend.native="updateSliderInfo($event)"
        @drag-end="updateSliderInfo($event)"
      />
    </no-ssr> */}
        {showTextBox && (
          <div className={styles["range-box"]}>
            <div className={styles["range-item"]}>
              <label className={styles.label} htmlFor="fromSlider">
                From
                <div className={styles.flexAlignCenter}>
                  {filterItem?.values?.[0]?.currency_code && (
                    <span className={styles.currency}>
                      {filterItem?.values?.[0]?.currency_symbol}
                    </span>
                  )}
                  <input
                    className={!minInput ? styles.empty : ""}
                    value={minInput}
                    onChange={(e) => debounceInput(e.target.value)}
                    onKeyDown={onChangeInput}
                    type="number"
                    min={Math.floor(sliderInfo?.min)}
                    max={Math.floor(sliderInfo?.max)}
                    id="fromSlider"
                  />
                </div>
              </label>
            </div>
            <div className={styles["range-item"]}>
              <label className={styles.label} htmlFor="toSlider">
                To
                <div className={styles.flexAlignCenter}>
                  {filterItem?.values?.[0]?.currency_code && (
                    <span className={styles.currency}>
                      {filterItem?.values?.[0]?.currency_symbol}
                    </span>
                  )}
                  <input
                    className={!maxInput ? styles.empty : ""}
                    onChange={(e) => debounceInput(e.target.value)}
                    onKeyDown={onChangeInput}
                    value={maxInput}
                    type="number"
                    min={Math.floor(sliderInfo?.min)}
                    max={Math.floor(sliderInfo?.max)}
                    id="toSlider"
                  />
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
