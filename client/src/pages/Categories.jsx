import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../slices/categoriesSlice";
import { fetchProductsByCategoryAsync } from "../slices/productsSlice";
import { useSearchParams } from "react-router-dom";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import ProductModal from "../components/ProductModal";
import MenuIcon from "@mui/icons-material/Menu";

export default function Categories() {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const { byCategory, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategoriesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && categories.length > 0) {
      const current = searchParams.get("category");
      if (!current || !categories.includes(current)) {
        setSearchParams({ category: "electronics" });
      }
    }
    // eslint-disable-next-line
  }, [loading, categories]);

  const selectedCategory = searchParams.get("category") || categories[0] || "";

  useEffect(() => {
    if (!selectedCategory) return;
    if (!byCategory[selectedCategory]) {
      dispatch(fetchProductsByCategoryAsync(selectedCategory));
    }
  }, [selectedCategory, byCategory, dispatch]);

  const products = byCategory[selectedCategory] || [];
  const showSkeleton = !products.length && productsLoading;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {/* Mobile: Side Drawer */}
      <div className="md:hidden mb-4">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded shadow"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
          Categories
        </button>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="w-64 bg-white h-full shadow-lg p-4 flex flex-col">
              <button
                className="self-end text-2xl mb-4 text-gray-400 hover:text-red-500"
                onClick={() => setDrawerOpen(false)}
              >
                &times;
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`text-left px-2 py-2 rounded mb-2 font-medium ${
                    selectedCategory === cat
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSearchParams({ category: cat });
                    setDrawerOpen(false);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div
              className="flex-1"
              onClick={() => setDrawerOpen(false)}
              style={{ background: "rgba(0,0,0,0.1)" }}
            />
          </div>
        )}
      </div>
      <div className="w-full hidden md:flex justify-center">
        <div className="w-full border rounded-lg shadow bg-white mb-4">
          <div className="overflow-x-auto">
            <Tabs
              value={selectedCategory}
              onChange={(_, value) => setSearchParams({ category: value })}
              variant="scrollable"
              scrollButtons="auto"
              className="flex-nowrap"
            >
              {categories.map((cat) => (
                <Tab key={cat} label={cat} value={cat} />
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      {showSkeleton ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {products.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between h-full w-full max-w-[250px] mx-auto cursor-pointer"
              onClick={() => setSelectedProductId(product.id)}
            >
              <CardMedia
                component="img"
                style={{ height: 160, objectFit: "contain" }}
                image={product.image}
                alt={product.title}
                className="bg-gray-50"
              />
              <CardContent className="flex-1 p-2 flex flex-col">
                <Typography
                  gutterBottom
                  variant="subtitle2"
                  component="div"
                  className="truncate"
                >
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>
                <div className="flex items-center gap-2 mt-1">
                  <Rating
                    value={product.rating?.rate || 0}
                    precision={0.1}
                    readOnly
                    size="small"
                  />
                  <span className="text-sm text-gray-700 font-semibold">
                    {product.rating?.rate || 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.rating?.count || 0})
                  </span>
                </div>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  className="mt-1"
                >
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {selectedProductId && (
        <ProductModal
          id={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
