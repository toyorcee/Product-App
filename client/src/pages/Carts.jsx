import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DashboardSkeleton from "../components/DashboardSkeleton";
import Pagination from "@mui/material/Pagination";
import ProductModal from "../components/ProductModal";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  selectCartTotalItems,
} from "../slices/cartSlice";
import { fetchProductsAsync } from "../slices/productsSlice";
import { toast } from "react-toastify";

const PAGE_SIZE = 6;

export default function Carts() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const productsById = useSelector((state) => state.products.byId);
  const allProducts = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const cartTotalItems = useSelector(selectCartTotalItems);
  const [page, setPage] = useState(1);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    itemId: null,
    type: null,
  });

  useEffect(() => {
    if (!allProducts || allProducts.length === 0) {
      dispatch(fetchProductsAsync());
    }
  }, [dispatch, allProducts]);

  if (loading) return <DashboardSkeleton />;

  const pageCount = Math.ceil(cartItems.length / PAGE_SIZE);
  const paginated = cartItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRemove = (itemId) => {
    setConfirmDialog({ open: true, itemId, type: "remove" });
  };

  const handleBuy = (itemId) => {
    setConfirmDialog({ open: true, itemId, type: "buy" });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.itemId !== null) {
      if (confirmDialog.type === "remove") {
        dispatch(removeFromCart(confirmDialog.itemId));
      } else if (confirmDialog.type === "buy") {
        toast.success("Purchase successful!");
      }
    }
    setConfirmDialog({ open: false, itemId: null, type: null });
  };

  const handleCancelAction = () => {
    setConfirmDialog({ open: false, itemId: null, type: null });
  };

  return (
    <div className="pt-8 pb-8 px-4 md:px-12 max-w-6xl mx-auto min-h-screen">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Card className="max-w-md w-full mx-auto p-8 flex flex-col items-center shadow-lg rounded-xl bg-white">
            <ShoppingCartIcon className="text-6xl text-blue-300 mb-4" />
            <Typography variant="h5" className="font-bold mb-2 text-gray-700">
              Your cart is empty
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-500 mb-4 text-center"
            >
              Looks like you haven&apos;t added any products yet. Browse our
              products and add your favorites to your cart!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href="/products"
              className="!bg-blue-600 !hover:bg-blue-700 !text-white font-semibold rounded-lg"
            >
              Shop Now
            </Button>
          </Card>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:grid md:grid-cols-3 gap-6 overflow-x-auto pb-2 md:pb-0">
            {paginated.map((item) => {
              const product =
                productsById[item.id] ||
                allProducts.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <Card
                  key={item.id}
                  className="flex flex-col justify-between h-full w-[260px] min-w-[260px] max-w-xs mx-auto shadow-md rounded-xl cursor-pointer bg-white"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    className="!bg-red-600 hover:!bg-red-700 !text-white font-semibold rounded-t-xl"
                    style={{
                      borderRadius: 0,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(item.id);
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Remove from Cart
                  </Button>
                  <CardMedia
                    component="img"
                    style={{ height: 160, objectFit: "contain" }}
                    image={product.image}
                    alt={product.title}
                    className="bg-gray-50"
                  />
                  <CardContent className="flex-1 p-3 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        component="div"
                        className="truncate font-semibold"
                      >
                        {product.title}
                      </Typography>
                    </div>
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
                    <div className="flex items-center gap-2 mt-2">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(decreaseQuantity(item.id));
                        }}
                        disabled={item.quantity <= 1}
                        className="!bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Chip
                        label={`Qty: ${item.quantity}`}
                        size="small"
                        className="bg-blue-100 text-blue-800"
                      />
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(increaseQuantity(item.id));
                        }}
                        className="!bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </div>
                  </CardContent>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    className="!bg-green-600 hover:!bg-green-700 !text-white font-semibold rounded-b-xl"
                    style={{
                      borderRadius: 0,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(item.id);
                    }}
                  >
                    Buy Now
                  </Button>
                </Card>
              );
            })}
          </div>
          {pageCount > 1 && (
            <Box className="flex justify-center mt-8">
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
          <Dialog open={confirmDialog.open} onClose={handleCancelAction}>
            <DialogTitle>
              {confirmDialog.type === "buy"
                ? "Confirm Purchase"
                : "Remove from Cart"}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {confirmDialog.type === "buy"
                  ? "Are you sure you want to purchase this item?"
                  : "Are you sure you want to remove this product from your cart?"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCancelAction} color="primary">
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAction}
                color={confirmDialog.type === "buy" ? "success" : "error"}
                variant="contained"
              >
                {confirmDialog.type === "buy" ? "Buy Now" : "Remove"}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Box className="mt-8 text-sm text-gray-500">
        <Typography variant="body2">Total Items: {cartTotalItems}</Typography>
      </Box>
      {selectedProductId && (
        <ProductModal
          id={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}
    </div>
  );
}
