import React, { useState } from "react";
import styles from "./styles/reason-item.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";

function ReasonItem({ reason, selectedReason, change, otherReason }) {
  const [reasonOtherText, setReasonOtherText] = useState("");
  return (
    <div className={`${styles.reasonItem}`}>
      <div>
        <div className={`${styles.reasonContent}`}>
          {selectedReason?.id !== reason?.id && (
            <SvgWrapper onClick={() => change(reason)} svgSrc="regular" />
          )}
          {selectedReason?.id === reason?.id && (
            <SvgWrapper svgSrc="radio-selected" />
          )}

          <span className={`${styles.text} ${styles.lightxs}`}>
            {reason.display_name}
          </span>
        </div>

        {selectedReason?.id === reason?.id && reason?.meta?.show_text_area && (
          <div className={`${styles.textarea}`}>
            <textarea
              className={`${styles.textarea}`}
              value={reasonOtherText}
              placeholder="Enter reason"
              onChange={(e) => setReasonOtherText(e.target.value)}
              onBlur={() => otherReason(reasonOtherText)}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReasonItem;
