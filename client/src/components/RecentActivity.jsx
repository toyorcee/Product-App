import { useSelector } from "react-redux";
import { selectActivities } from "../slices/activitySlice";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryIcon from "@mui/icons-material/Category";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const getActivityIcon = (type) => {
  switch (type) {
    case "cart":
      return <ShoppingCartIcon className="text-purple-500" />;
    case "view":
      return <VisibilityIcon className="text-blue-500" />;
    case "category":
      return <CategoryIcon className="text-green-500" />;
    default:
      return <AccessTimeIcon className="text-gray-500" />;
  }
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - activityTime) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function RecentActivity() {
  const activities = useSelector(selectActivities);

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="text-gray-500 text-center py-4">
          No recent activities
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="mt-1">{getActivityIcon(activity.type)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {activity.message}
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <AccessTimeIcon
                  className="text-gray-400 mr-1"
                  style={{ fontSize: "0.875rem" }}
                />
                {formatTimeAgo(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
