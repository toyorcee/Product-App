import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsAsync } from "../slices/productsSlice";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import Rating from "@mui/material/Rating";
import ProductModal from "../components/ProductModal";
import { addProductToCartAsync } from "../slices/cartSlice";
import { useActivity } from "../hooks/useActivity";
import { toast } from "react-toastify";

const PAGE_SIZE = 9;

export default function Products() {
  const dispatch = useDispatch();
  const { trackCartActivity, trackViewActivity } = useActivity();
  const { products, loading } = useSelector((state) => state.products);
  const userId = useSelector((state) => state.user.user?.id || 3);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const filtered = products.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      String(p.price).includes(term)
    );
  });

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    dispatch(
      addProductToCartAsync({ userId, productId: product.id, quantity: 1 })
    )
      .unwrap()
      .then((res) => {
        trackCartActivity("add", product);
        toast.success("Added to cart!");
      })
      .catch((err) => {
        toast.error("Failed to add to cart");
        console.error("Add to cart error:", err);
      });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-4 mt-4 w-full flex justify-center lg:justify-end">
        <TextField
          label="Search products"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-white w-full max-w-md"
        />
      </div>
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </div>
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
            {paginated.map((product) => (
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
