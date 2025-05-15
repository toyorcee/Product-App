export default function DashboardSkeleton() {
  return (
    <div className="p-4 space-y-6 animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <div className="h-64 bg-gray-200 rounded mt-8"></div>
    </div>
  );
}
