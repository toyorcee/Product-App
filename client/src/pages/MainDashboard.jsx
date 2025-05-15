import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDashboardDataAsync } from "../slices/dashboardSlice";
import { selectCartTotalItems } from "../slices/cartSlice";
import { fetchUserByIdAsync } from "../slices/userSlice";
import DashboardSkeleton from "../components/DashboardSkeleton";
import RecentActivity from "../components/RecentActivity";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function MainDashboard() {
  const dispatch = useDispatch();
  const { categoryCounts, totalProducts, loading } = useSelector(
    (state) => state.dashboard
  );
  const { categories } = useSelector((state) => state.categories);
  const { user } = useSelector((state) => state.user);
  const cartTotalItems = useSelector(selectCartTotalItems);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!user) {
      dispatch(fetchUserByIdAsync(6));
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(fetchDashboardDataAsync());
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !categoryCounts || Object.keys(categoryCounts).length === 0) {
    return <DashboardSkeleton />;
  }

  const nigeriaTime = new Date(now.getTime());
  const hour = nigeriaTime.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good afternoon";
  } else if (hour >= 17 || hour < 5) {
    greeting = "Good evening";
  }

  const fullName =
    user && user.name ? `${user.name.firstname} ${user.name.lastname}` : "User";

  const dateString = nigeriaTime.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeString = nigeriaTime.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="p-4">
      <div className="w-full mb-6 shadow rounded-lg bg-white px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4">
        <div>
          <div className="text-2xl font-bold text-gray-800">
            {greeting}, {fullName}!
          </div>
          <div className="text-sm text-blue-500 mt-1">
            Your products overview awaits you beautifully below.
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="flex items-center space-x-2 bg-gray-50 rounded shadow px-4 py-2">
            <CalendarTodayIcon className="text-blue-500" />
            <span className="font-medium text-gray-700">{dateString}</span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 rounded shadow px-4 py-2">
            <AccessTimeIcon className="text-green-500" />
            <span className="font-mono text-gray-700 text-lg">
              {timeString}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {totalProducts}
          </div>
          <div className="text-gray-700 font-semibold">Total Products</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {cartTotalItems}
          </div>
          <div className="text-gray-700 font-semibold flex items-center gap-2">
            <ShoppingCartIcon className="text-purple-600" />
            Cart Items
          </div>
        </div>
        {Object.keys(categoryCounts).map((cat) => (
          <div
            key={cat}
            className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">
              {categoryCounts[cat] ?? 0}
            </div>
            <div className="text-gray-700 font-semibold text-center">
              {cat} Products
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
