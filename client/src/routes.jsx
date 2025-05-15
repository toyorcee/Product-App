import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import MainDashboard from "./pages/MainDashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import UserProfile from "./pages/UserProfile";
import Carts from "./pages/Carts";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<MainDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="carts" element={<Carts />} />
      </Route>
    </Routes>
  );
}
