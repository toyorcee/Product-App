import { useState, useEffect } from "react";
import DashboardSkeleton from "./DashboardSkeleton";

export default function ProfileCard({ onClose }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading)
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full h-[400px] flex items-center justify-center">
        <DashboardSkeleton />
      </div>
    );

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full h-[400px] flex flex-col items-center justify-center relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
      >
        &times;
      </button>
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="Profile"
        className="w-24 h-24 rounded-full border-4 border-blue-400 mb-4"
      />
      <h3 className="text-2xl font-bold mb-2">John Doe</h3>
      <p className="text-gray-600 mb-2">Frontend Engineer</p>
      <p className="text-gray-500">johndoe@email.com</p>
    </div>
  );
}
