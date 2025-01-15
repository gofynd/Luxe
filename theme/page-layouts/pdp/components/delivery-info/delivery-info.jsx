import React, { useEffect, useMemo, useState } from "react";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import {
  convertUTCDateToLocalDate,
  isEmptyOrNull,
} from "../../../../helper/utils";
import { useHyperlocalTat } from "../../../../helper/hooks";
import styles from "./delivery-info.less"; // Import the module CSS

function DeliveryInfo({
  selectPincodeError,
  storeInfo,
  tat,
  pincode,
  pincodeErrorMessage,
  setCurrentPincode,
  checkPincode,
  setPincodeErrorMessage,
  isIntlShippingEnabled,
  sellerDetails,
  fpi,
  pincodeDetails,
  locationDetails,
  showLogo = false,
}) {
  const [postCode, setPostCode] = useState(pincode || "");
  const [tatMessage, setTatMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const pinCodeRegex = /^[1-9][0-9]{5}$/;
  const { isHyperlocal, convertUTCToHyperlocalTat } = useHyperlocalTat({ fpi });

  useEffect(() => {
    setPostCode(pincode);
  }, [pincode]);

  useEffect(() => {
    let flag = false;
    if (isIntlShippingEnabled) {
      if (sellerDetails?.country?.iso_code) {
        flag = true;
      } else flag = false;
    } else {
      flag = postCode?.length > 5;
    }
    if (flag) {
      getDeliveryDate();
    }
  }, [tat, isIntlShippingEnabled, sellerDetails]);

  function changePostCode(e) {
    setPostCode(e?.target?.value);
    setCurrentPincode(e.target.value);
    setTatMessage("");
    setPincodeErrorMessage("");
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

    if (isHyperlocal) {
      setTatMessage(convertUTCToHyperlocalTat(min));
      return;
    }

    const minDate = convertUTCDateToLocalDate(min, options);
    const maxDate = convertUTCDateToLocalDate(max, options);
    setTimeout(() => {
      setTatMessage(
        `Will be delivered ${
          min === max ? `on ${minDate}` : `between ${minDate} - ${maxDate}`
        }`
      );
    }, 1000);
  };

  const getDeliveryLoc = useMemo(() => {
    return (
      pincodeDetails?.localityValue ??
      (locationDetails?.pincode || locationDetails?.sector)
    );
  }, [pincodeDetails, locationDetails]);

  const shouldShowTatMsg = useMemo(() => {
    if (isIntlShippingEnabled) {
      if (sellerDetails?.country?.iso_code) {
        return true;
      } else return false;
    } else {
      return postCode?.length === 6;
    }
  }, [postCode, sellerDetails]);
  const openInternationalDropdown = () => {
    fpi.custom.setValue("isI18ModalOpen", true);
  };
  const deliveryLocForIntlShipping = () => {
    return (
      <>
        {!getDeliveryLoc || isEmptyOrNull(sellerDetails) ? (
          <h4
            className={`${styles.deliveryLabel} b2 ${styles.cursor}`}
            onClick={openInternationalDropdown}
          >
            Select delivery location
          </h4>
        ) : (
          <span className={`${styles.flexAlignCenter}`}>
            <span className={styles.deliveryLocation}>
              <span className={styles.deliveryLocation__bold}>
                Delivery at{" "}
              </span>
              <span
                onClick={openInternationalDropdown}
                className={styles.deliveryLocation__addrs}
              >
                {getDeliveryLoc}
              </span>
            </span>
          </span>
        )}
      </>
    );
  };
  const deliveryLoc = () => {
    return (
      <>
        <h4 className={`${styles.deliveryLabel} b2`}>
          Select delivery location
        </h4>
        <div className={styles.delivery}>
          <input
            autoComplete="off"
            value={postCode}
            placeholder="Check delivery time"
            className={`b2 ${styles.pincodeInput} ${styles.fontBody}`}
            type="text"
            maxLength="6"
            onChange={(e) => changePostCode(e)}
          />
          <button
            type="button"
            className={`${styles.button} ${styles.fontBody}`}
            onClick={() => checkPincode(postCode)}
            disabled={postCode.length !== 6}
          >
            <span className={`${styles.flexAlignCenter}`}>
              CHECK
              <SvgWrapper
                svgSrc="delivery"
                pincode
                className={`${styles.deliveryIcon}`}
              />
            </span>
          </button>
        </div>
        {selectPincodeError && !pincodeErrorMessage.length && (
          <div className={`captionNormal ${styles.emptyPincode}`}>
            Please enter valid pincode before Add to cart/ Buy now
          </div>
        )}
      </>
    );
  };

  return (
    <div className={styles.deliveryInfo}>
      <div className={isIntlShippingEnabled ? styles.deliveryWrapper : ""}>
        {isIntlShippingEnabled && <SvgWrapper svgSrc="locationOn" />}
        <div className={styles.deliveryInfoWrapper}>
          {isIntlShippingEnabled ? deliveryLocForIntlShipping() : deliveryLoc()}
          {!pincodeErrorMessage && !selectPincodeError && (
            <div
              className={`${styles.deliveryDate} ${styles.dateInfoContainer}`}
            >
              {shouldShowTatMsg && tatMessage?.length > 0 && (
                <>
                  {!isIntlShippingEnabled && (
                    <div>
                      <SvgWrapper
                        svgSrc="delivery"
                        className={`${styles.deliveryIcon}`}
                      />
                    </div>
                  )}
                  <div className="captionNormal">
                    {tatMessage}
                    {showLogo && (
                      <div className={styles.fyndLogo}>
                        <span>with</span>
                        <SvgWrapper
                          style={{ marginLeft: "4px" }}
                          svgSrc="fynd-logo"
                        />
                        <span className={styles.fyndText}>Fynd</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {pincodeErrorMessage && (
        <div className={`captionNormal ${styles.error}`}>
          {pincodeErrorMessage}
        </div>
      )}
    </div>
  );
}

export default DeliveryInfo;
