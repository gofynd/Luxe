import React from "react";
import { isLoggedIn } from "../helper/auth-guard";
import ProfileRoot from "../components/profile/profile-root";
import ProfileAddressPage from "../page-layouts/profile-address/profile-address-page";

function ProfileAddress({ fpi }) {
  return (
    <ProfileRoot fpi={fpi}>
      <ProfileAddressPage fpi={fpi} />
    </ProfileRoot>
  );
}

ProfileAddress.authGuard = isLoggedIn;

export default ProfileAddress;
