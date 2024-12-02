import React from "react";
import ProfileDetails from "fdk-react-templates/pages/profile";
import "fdk-react-templates/pages/profile/profile-details.css";
import { useGlobalStore } from "fdk-core/utils";
import { useAccounts, useSnackbar } from "../../helper/hooks";

function ProfileDetailsPage({ fpi }) {
  const { first_name, last_name, gender, user } = useGlobalStore(
    fpi.getters.USER_DATA
  );

  const userData = {
    firstName: first_name ?? user?.first_name,
    lastName: last_name ?? user?.last_name,
    gender: gender ?? user?.gender,
  };

  const { updateProfile } = useAccounts({ fpi });

  const { showSnackbar } = useSnackbar();

  const handleSave = async ({ firstName, lastName, gender }) => {
    try {
      await updateProfile({
        firstName,
        lastName,
        gender,
      });

      showSnackbar("Updated Successfully", "success");
    } catch (error) {
      showSnackbar(error?.message, "error");
    }
  };

  return <ProfileDetails handleSave={handleSave} userData={userData} />;
}

export default ProfileDetailsPage;
