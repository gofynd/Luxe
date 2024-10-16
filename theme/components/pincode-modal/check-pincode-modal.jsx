import React, { useState, useEffect } from "react";
import styles from "./check-pincode-modal.less";
import SvgWrapper from "../core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate } from "../../helper/utils";

export default function CheckPincodeModal({
  setOpenPicodeModal,
  pincode,
  pincodeErrorMessage,
  setCurrentPincode,
  checkPincode,
  setPincodeErrorMessage,
}) {
  const [postCode, setPostCode] = useState(pincode || "");
  const [tatMessage, setTatMessage] = useState("");
  useEffect(() => {
    setPostCode(pincode);
  }, [pincode]);
  // console.log(postCode.length, "postCode.length");
  useEffect(() => {
    if (postCode.length === 6 && pincodeErrorMessage.length === 0) {
      setOpenPicodeModal(false);
    }
  }, [localStorage.getItem("pincode")]);

  function changePostCode(e) {
    setPostCode(e?.target?.value);
    setTatMessage("");
    setPincodeErrorMessage("");
  }

  return (
    <div>
      <div className={styles.modalContainer}>
        <div className={styles.headingContainer}>
          <h1 className={styles.heading}>Select delivery location</h1>
          <div
            className={styles.close}
            onClick={() => setOpenPicodeModal(false)}
          >
            <SvgWrapper svgSrc="close" />
          </div>
        </div>
        <div className={styles.inputContainer}>
          <input
            autoComplete="off"
            value={postCode}
            onChange={(e) => changePostCode(e)}
            placeholder="Please enter pincode to check delivery time "
            className={`b2 ${styles.pincodeInput} ${styles.fontBody}`}
            type="text"
            maxLength="6"
          />
          <button
            type="button"
            className={`${styles.button} ${styles.fontBody}`}
            onClick={() => {
              setCurrentPincode(postCode);
              checkPincode(postCode);
            }}
            // disabled={postCode.length !== 6}
          >
            <span className={`${styles.flexAlignCenter}`}>
              CHECK
              <SvgWrapper
                svgSrc="delivery"
                className={`${styles.deliveryIcon}`}
              />
            </span>
          </button>
        </div>

        {pincodeErrorMessage && (
          <div className={`${styles.captionNormal} ${styles.error}`}>
            {pincodeErrorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
