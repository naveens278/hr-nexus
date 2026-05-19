import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PrivateRoute({children}){

  const {user, loading} = useContext(AuthContext);

  if (loading) return null;

  return user ? children : <Navigate to="/" />

}

export default PrivateRoute;