import { Navigate } from "react-router-dom";

function RutaProtegida({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin" />;
  return children;
}

export default RutaProtegida;