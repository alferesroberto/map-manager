import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../pages/loginPage";
import RegisterPage from "../pages/RegisterPage";
import MapPage from "../pages/MapPage";

export const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/map", element: <MapPage /> }
]);
