import React, { useEffect } from "react";
import { isLoggedIn } from "../helper/auth-guard";
import ProfileRoot from "../components/profile/profile-root";
import ProfileDetailsPage from "../page-layouts/profile/profile-details-page";

function ProfileDetails({ fpi }) {
  return (
    <ProfileRoot fpi={fpi}>
      <ProfileDetailsPage fpi={fpi} />
    </ProfileRoot>
  );
}

ProfileDetails.authGuard = isLoggedIn;

export default ProfileDetails;
