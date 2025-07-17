import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { GlobalState } from "../GlobalState";
import ErrorPage from "../pages/ErrorPage";

const AdminRoute = ({ children }) => {
  const { UserAPI, token: tokenPair } = useContext(GlobalState);
  const [token] = tokenPair;

  // 1) If the context isn't wired up yet, wait
  if (!UserAPI) return <div>Loading...</div>;

  // 2) Pull user flags out of your hook
  const [isLogged]    = UserAPI.isLogged    || [false];
  const [isAdmin]     = UserAPI.isAdmin     || [false];
  const isLoadingUser = UserAPI.isLoadingUser;

  console.log("AdminRoute:", { token, isLoadingUser, isLogged, isAdmin });

  // 3) If we don't have a token at all, go sign in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 4) If we _do_ have a token but are still fetching profile, show spinner
  if (isLoadingUser) {
    return <div>Loading user info…</div>;
  }

  // 5) If the fetch is done and they're not an admin, show error
  if (!isAdmin) {
    return <ErrorPage />;
  }

  // 6) Finally, we know they're logged in AND admin—render the protected routes
  return children;
};

export default AdminRoute;
