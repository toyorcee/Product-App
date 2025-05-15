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
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import { addProductToCartAsync } from "../slices/cartSlice";
import { useActivity } from "../hooks/useActivity";
import { toast } from "react-toastify";

export default function Categories() {
  const dispatch = useDispatch();
  const { trackCartActivity, trackViewActivity, trackCategoryActivity } =
    useActivity();
  const { categories, loading } = useSelector((state) => state.categories);
  const { byCategory, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const userId = useSelector((state) => state.user.user?.id || 3);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

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
  }, [loading, categories]);

  const selectedCategory = searchParams.get("category") || categories[0] || "";

  useEffect(() => {
    if (!selectedCategory) return;
    if (!byCategory[selectedCategory]) {
      dispatch(fetchProductsByCategoryAsync(selectedCategory));
      trackCategoryActivity(selectedCategory);
    }
  }, [selectedCategory, byCategory, dispatch]);

  const products = byCategory[selectedCategory] || [];
  const showSkeleton = !products.length && productsLoading;

  // Search filter
  const filteredProducts = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(
      addProductToCartAsync({ userId, productId: product.id, quantity: 1 })
    )
      .unwrap()
      .then(() => {
        trackCartActivity("add", product);
        toast.success("Added to cart!");
      })
      .catch(() => toast.error("Failed to add to cart"));
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 mt-4 w-full flex justify-center lg:justify-end">
        <TextField
          label="Search in category"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white w-full max-w-md"
        />
      </div>
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
              onChange={(_, value) => {
                setSearchParams({ category: value });
                trackCategoryActivity(value);
              }}
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
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col justify-between h-full w-full max-w-[250px] mx-auto cursor-pointer"
              onClick={() => {
                setSelectedProductId(product.id);
                trackViewActivity(product);
              }}
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
              <CardActions className="p-0">
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="!bg-blue-600 !hover:bg-blue-700 !text-white font-semibold rounded-b-lg"
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  Add to Cart
                </Button>
              </CardActions>
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
