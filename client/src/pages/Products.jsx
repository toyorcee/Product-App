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
import Dialog from "@mui/material/Dialog";
import AddIcon from "@mui/icons-material/Add";
import CreateProductForm from "../components/CreateProductForm";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import {
  updateLocalProduct,
  deleteLocalProduct,
  updateProduct,
  deleteProduct,
} from "../slices/productsSlice";
import EditProductForm from "../components/EditProductForm";

const PAGE_SIZE = 9;
const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dnryzbfqb/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

export default function Products() {
  const dispatch = useDispatch();
  const { trackCartActivity, trackViewActivity, trackActivity } = useActivity();
  const { products, loading } = useSelector((state) => state.products);
  const userId = useSelector((state) => state.user.user?.id || 3);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, [dispatch]);

  const sortedProducts = [...products].sort((a, b) => b.id - a.id);

  const filtered = sortedProducts.filter((p) => {
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

  const mensProducts = products.filter((p) => p.category === "men's clothing");

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
    <div
      className={
        openCreate
          ? "flex flex-col h-full p-4 overflow-hidden"
          : "flex flex-col h-full p-4"
      }
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 mt-4 w-full gap-2">
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="!bg-blue-600 !hover:bg-blue-700 !text-white font-semibold rounded-lg w-full sm:w-auto"
          onClick={() => setOpenCreate(true)}
        >
          Create Product
        </Button>
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
        </div>
      )}
      {selectedProductId && (
        <ProductModal
          id={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
      <Dialog
        open={openCreate}
        onClose={() => !loading && setOpenCreate(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            maxHeight: "100vh",
          },
        }}
        BackdropProps={{
          style: {
            background: "rgba(30, 41, 59, 0.35)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <CreateProductForm onClose={() => setOpenCreate(false)} />
      </Dialog>
      <Dialog
        open={!!editingProduct}
        onClose={() => !editLoading && setEditingProduct(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "none",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "visible",
            maxHeight: "100vh",
          },
        }}
        BackdropProps={{
          style: {
            background: "rgba(30, 41, 59, 0.35)",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        {editingProduct && (
          <EditProductForm
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
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
                  const localProducts = JSON.parse(
                    localStorage.getItem("localProducts") || "[]"
                  );
                  const filtered = localProducts.filter(
                    (p) => p.id !== deletingProduct.id
                  );
                  localStorage.setItem(
                    "localProducts",
                    JSON.stringify(filtered)
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
