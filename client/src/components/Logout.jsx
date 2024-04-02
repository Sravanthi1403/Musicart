import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../store/AppContext";

export const Logout = () => {
  const { logoutAPICall } = useAppContext();

  useEffect(() => {
    logoutAPICall();
  }, [logoutAPICall]);
  return <Navigate to="/login" />;
};
