import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SEND_RESET_TOKEN } from "../../queries/authQuery";
import { useAccounts } from "../../helper/hooks";

const useSetPassword = ({ fpi }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState(null);

  const { setPassword } = useAccounts({ fpi });

  const query = new URLSearchParams(location.search);

  useEffect(() => {
    const payload = {
      codeRequestBodySchemaInput: {
        code: query.get("code"),
      },
    };
    return fpi
      .executeGQL(SEND_RESET_TOKEN, payload)
      .then((res) => {
        if (res?.errors) {
          throw res?.errors?.[0];
        }
        return res?.data?.sendResetToken;
      })
      .catch((err) => {
        const queryParams = new URLSearchParams();
        navigate({
          pathname: "/auth/login",
          search: queryParams.toString(),
        });
      });
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const handleSetPassword = ({ newPassword }) =>
    setPassword({
      password: newPassword,
      code: query.get("code"),
    })
      .then((res) => {
        setError(null);
      })
      .catch((err) => {
        setError({ message: err?.message || "Something went wrong" });
      });

  return { error, onSetPasswordSubmit: handleSetPassword };
};

export default useSetPassword;
