import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesAsync } from "../slices/categoriesSlice";
import {
  fetchProductsByCategoryAsync,
  updateLocalProduct,
  deleteLocalProduct,
  updateProduct,
  deleteProduct,
  fetchProductsAsync,
} from "../slices/productsSlice";
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
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";

export default function Categories() {
  const dispatch = useDispatch();
  const { trackCartActivity, trackViewActivity, trackCategoryActivity } =
    useActivity();
  const { trackActivity } = useActivity();
  const { categories, loading } = useSelector((state) => state.categories);
  const { byCategory, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const userId = useSelector((state) => state.user.user?.id || 3);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

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

  const products = [...(byCategory[selectedCategory] || [])].sort(
    (a, b) => b.id - a.id
  );
  const showSkeleton = !products.length && productsLoading;

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
              style={{ minHeight: 300, maxHeight: 320 }}
              onClick={() => {
                setSelectedProductId(product.id);
                trackViewActivity(product);
              }}
            >
              <CardMedia
                component="img"
                style={{ height: 100, objectFit: "contain" }}
                image={product.image}
                alt={product.title}
                className="bg-gray-50"
              />
              <CardContent
                className="flex-1 p-1 flex flex-col"
                style={{ paddingBottom: 4 }}
              >
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
              <CardActions className="flex flex-col items-stretch gap-1 p-1 pt-0">
                <div className="flex flex-row justify-end gap-2 mb-2">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditForm(product);
                      setEditingProduct(product);
                    }}
                    aria-label="edit"
                  >
                    <EditIcon fontSize="small" className="text-blue-600" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeletingProduct(product);
                    }}
                    aria-label="delete"
                  >
                    <DeleteIcon fontSize="small" className="text-red-600" />
                  </IconButton>
                </div>
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
      <Dialog
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setEditLoading(true);
            try {
              let updated = { ...editForm };
              if (!updated.image || updated.image === "") {
                toast.error("Image is required");
                setEditLoading(false);
                return;
              }
              if (editingProduct.isLocal) {
                updateLocalProduct(updated);
                dispatch(updateProduct(updated));
              } else {
                if (updated.image.startsWith("data:")) {
                  toast.error("API products require a valid image URL");
                  setEditLoading(false);
                  return;
                }
                const apiPayload = {
                  id: editingProduct.id,
                  title: updated.title,
                  price: parseFloat(updated.price),
                  description: updated.description,
                  category: updated.category,
                  image: updated.image,
                };
                await axios.put(
                  `https://fakestoreapi.com/products/${editingProduct.id}`,
                  apiPayload
                );
                dispatch(updateProduct(updated));
              }
              trackActivity("update", `Updated product: ${updated.title}`);
              toast.success("Product updated!");
              dispatch(fetchProductsAsync());
              setEditingProduct(null);
            } catch (err) {
              toast.error("Failed to update product");
              console.error("Update error:", err);
            } finally {
              setEditLoading(false);
            }
          }}
        >
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Title"
              value={editForm.title || ""}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, title: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Price"
              type="number"
              value={editForm.price || ""}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, price: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={editForm.description || ""}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, description: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Category"
              value={editForm.category || ""}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, category: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Image URL"
              value={
                editForm.image && !editForm.image.startsWith("data:")
                  ? editForm.image
                  : ""
              }
              onChange={(e) => {
                const val = e.target.value;
                setEditForm((f) => ({ ...f, image: val }));
              }}
              fullWidth
              required
              helperText={
                editForm.image && editForm.image.startsWith("data:")
                  ? "Current: Local image selected"
                  : "Enter a valid image URL"
              }
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<ImageIcon />}
              sx={{ mt: 1, mb: 0, textTransform: "none" }}
            >
              {editForm.image && editForm.image.startsWith("data:")
                ? "Change Image (Local)"
                : "Upload Local Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("Image size should be less than 5MB");
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditForm((f) => ({ ...f, image: reader.result }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </Button>
            {editForm.image && editForm.image.startsWith("data:") && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Local image selected
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setEditingProduct(null)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog open={!!deletingProduct} onClose={() => setDeletingProduct(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <b>{deletingProduct?.title}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletingProduct(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              try {
                if (deletingProduct.isLocal) {
                  deleteLocalProduct(deletingProduct.id);
                  dispatch(deleteProduct(deletingProduct.id));
                } else {
                  await axios.delete(
                    `https://fakestoreapi.com/products/${deletingProduct.id}`
                  );
                  dispatch(deleteProduct(deletingProduct.id));
                }
                dispatch(fetchProductsAsync());
                setDeletingProduct(null);
              } catch {
                toast.error("Failed to delete product");
              }
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
