import React, { useEffect, useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import { convertUTCDateToLocalDate } from "../../../../helper/utils";
import styles from "./delivery-info.less"; // Import the module CSS

function DeliveryInfo({
  selectPincodeError,
  storeInfo,
  tat,
  pincode,
  pincodeErrorMessage,
  setCurrentPincode,
  checkPincode,
}) {
  const [postCode, setPostCode] = useState(pincode || "");
  const [tatMessage, setTatMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const pinCodeRegex = /^[1-9][0-9]{5}$/;

  useEffect(() => {
    setPostCode(pincode);
  }, [pincode]);

  useEffect(() => {
    if (postCode?.length > 5) {
      getDeliveryDate();
    }
  }, [tat]);

  function changePostCode(e) {
    setPostCode(e?.target?.value);
    setCurrentPincode(e.target.value);
    if (e?.target?.value?.length === 6) {
      checkPincode(e.target.value);
    }
  }

  const getDeliveryDate = () => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    const { min, max } = tat || {};

    if (!min) {
      return false;
    }

    const minDate = convertUTCDateToLocalDate(min, options);
    const maxDate = convertUTCDateToLocalDate(max, options);

    setTatMessage(
      `Will be delivered ${
        min === max ? `on ${minDate}` : `between ${minDate} - ${maxDate}`
      }`
    );
  };

  return (
    <div className={styles.deliveryInfo}>
      <h4 className={`${styles.deliveryLabel} b2`}>Select delivery location</h4>
      <div className={styles.delivery}>
        <input
          autoComplete="off"
          value={postCode}
          placeholder="Please enter pincode"
          className={`b2 ${styles.pincodeInput} ${styles.fontBody}`}
          type="text"
          maxLength="6"
          onChange={(e) => changePostCode(e)}
        />
        <button
          type="button"
          className={`${styles.button} ${styles.btnPrimary} ${styles.fontBody}`}
          onClick={() => checkPincode(postCode)}
          disabled={postCode.length !== 6}
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
      {selectPincodeError && !pincodeErrorMessage.length && (
        <div className={`${styles.captionNormal} ${styles.emptyPincode}`}>
          Please enter valid pincode before Add to cart/ Buy now
        </div>
      )}
      {!pincodeErrorMessage && !selectPincodeError && (
        <div className={styles.deliveryDate}>
          {postCode?.length === 6 && (
            <>
              <SvgWrapper
                svgSrc="delivery"
                className={`${styles.deliveryIcon}`}
              />
              <p className={`${styles.captionNormal}`}>{tatMessage}</p>
            </>
          )}
        </div>
      )}
      {pincodeErrorMessage && (
        <div className={`${styles.captionNormal} ${styles.error}`}>
          {pincodeErrorMessage}
        </div>
      )}
    </div>
  );
}

export default DeliveryInfo;
