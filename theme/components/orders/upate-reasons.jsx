import React, { useState } from "react";
import styles from "./styles/upate-reasons.less";
import ReasonItem from "./reason-item";

function UpateReasons({ reasons, selectedReason, change, otherReason }) {
  const getPriorityReasons = () => {
    const allreason = reasons?.sort((a, b) => a.priority - b.priority);
    return allreason?.map((it) => {
      it.reason_other_text = "";
      return it;
    });
  };
  return (
    <div>
      {getPriorityReasons()?.map((item, index) => (
        <ReasonItem
          key={index}
          className={`${styles.reasonItem}`}
          selectedReason={selectedReason}
          reason={item}
          change={change}
          otherReason={otherReason}
        ></ReasonItem>
      ))}
    </div>
  );
}

export default UpateReasons;
