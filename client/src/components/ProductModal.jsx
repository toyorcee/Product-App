import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByIdAsync } from "../slices/productsSlice";
import Rating from "@mui/material/Rating";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch as useReduxDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";

function ProductModalSkeleton() {
  return (
    <div className="flex flex-col md:flex-row gap-6 w-full">
      <div className="md:w-1/2 w-full bg-gray-100 flex items-center justify-center p-8">
        <div className="w-full h-80 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="md:w-1/2 w-full flex flex-col justify-between p-8">
        <div>
          <div className="h-6 w-3/4 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-4 w-1/3 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 rounded mb-2 animate-pulse" />
          <div className="h-4 w-2/3 bg-gray-200 rounded mb-6 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ProductModal({ id, onClose }) {
  const dispatch = useDispatch();
  const { byId, loading } = useSelector((state) => state.products);
  const cartDispatch = useReduxDispatch();

  useEffect(() => {
    if (!byId[id]) {
      dispatch(fetchProductByIdAsync(id));
    }
  }, [id, byId, dispatch]);

  const product = byId[id];
  const showSkeleton = !product && loading && !byId[id];

  const handleAddToCart = () => {
    cartDispatch(addToCart(product));
    toast.success("Added to cart!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0, 0, 0, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 hover:scale-110"
          aria-label="Close modal"
        >
          <CloseIcon className="text-gray-600 hover:text-red-500 text-2xl" />
        </button>
        {showSkeleton ? (
          <ProductModalSkeleton />
        ) : product ? (
          <>
            <div className="md:w-1/2 w-full bg-gray-50 flex items-center justify-center p-4 sm:p-8">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-64 sm:h-80 object-contain rounded-lg shadow"
              />
            </div>
            <div className="md:w-1/2 w-full flex flex-col justify-between p-4 sm:p-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 flex items-center gap-2">
                  <InfoOutlinedIcon className="text-blue-500" />
                  {product.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <CategoryIcon className="text-green-500" />
                  <span className="text-gray-600 font-medium capitalize">
                    {product.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <Rating
                    value={product.rating?.rate || 0}
                    precision={0.1}
                    readOnly
                    size="medium"
                  />
                  <span className="text-sm text-gray-700 font-semibold">
                    {product.rating?.rate || 0}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.rating?.count || 0} reviews)
                  </span>
                </div>
                <p className="text-gray-700 mb-6 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <AttachMoneyIcon className="text-blue-600 text-2xl sm:text-3xl" />
                  <span className="text-2xl sm:text-3xl font-bold text-blue-700">
                    ${product.price}
                  </span>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="w-full sm:w-auto !bg-blue-600 !hover:bg-blue-700 !text-white font-semibold px-6 py-2 rounded-lg shadow transition hover:shadow-lg"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 p-8">
            Product not found.
          </div>
        )}
      </div>
    </div>
  );
}
