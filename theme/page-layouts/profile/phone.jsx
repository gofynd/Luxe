import React, { useCallback } from "react";
import PhonePage from "fdk-react-templates/pages/profile/phone";
import { isLoggedIn } from "../../helper/auth-guard";
import ProfileRoot from "../../components/profile/profile-root";
import "fdk-react-templates/page-layouts/auth/mobile-number/mobile-number.css";
import { usePhone } from "./usePhone";
import { useSnackbar, useAccounts } from "../../helper/hooks";
import "fdk-react-templates/pages/profile/phone/phone.css";

function Phone({ fpi }) {
  const { setMobileNumberAsPrimary, deleteMobileNumber, phoneNumbers } =
    usePhone({ fpi });
  const { sendOtpMobile, verifyMobileOtp, resendOtp } = useAccounts({ fpi });
  const { showSnackbar } = useSnackbar();

  const handleSetPrimary = useCallback(async (phoneDetails) => {
    try {
      await setMobileNumberAsPrimary(phoneDetails);
      showSnackbar(`${phoneDetails?.phone} set as primary`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleSendOtp = useCallback(async (phoneDetails) => {
    try {
      const data = await sendOtpMobile(phoneDetails);
      showSnackbar(`Otp sent on mobile ${phoneDetails?.mobile}`, "success");
      return data;
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleVerifyOtp = useCallback(async (otpDetails) => {
    try {
      await verifyMobileOtp(otpDetails);
      showSnackbar(`Otp verified`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleResendOtp = useCallback(async (phoneDetails) => {
    try {
      const data = await resendOtp(phoneDetails);
      showSnackbar(`Otp sent on mobile ${phoneDetails?.mobile}`, "success");
      return data;
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  const handleDelete = useCallback(async (phoneDetails) => {
    try {
      await deleteMobileNumber(phoneDetails);
      showSnackbar(`${phoneDetails?.phone} removed successfully`, "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  }, []);

  return (
    <ProfileRoot fpi={fpi}>
      <PhonePage
        setMobileNumberAsPrimary={handleSetPrimary}
        deleteMobileNumber={handleDelete}
        phoneNumbers={phoneNumbers}
        sendOtpMobile={handleSendOtp}
        verifyMobileOtp={handleVerifyOtp}
        resendOtp={handleResendOtp}
      />
    </ProfileRoot>
  );
}

Phone.authGuard = isLoggedIn;

export default Phone;
