import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Divider,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAsync,
  updateProduct,
  updateLocalProduct,
} from "../slices/productsSlice";
import { useActivity } from "../hooks/useActivity";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import { fetchDashboardDataAsync } from "../slices/dashboardSlice";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dnryzbfqb/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

export default function EditProductForm({ product, onClose }) {
  const dispatch = useDispatch();
  const { trackActivity } = useActivity();
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [imagePreview, setImagePreview] = useState(product.image);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
    },
  });

  useEffect(() => {
    setValue("title", product.title);
    setValue("price", product.price);
    setValue("description", product.description);
    setValue("category", product.category);
  }, [product, setValue]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(CLOUDINARY_UPLOAD_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.secure_url) {
          setImagePreview(data.secure_url);
          setSelectedImage(data.secure_url);
          toast.success("Image uploaded!");
        } else {
          toast.error("Image upload failed.");
        }
      } catch (err) {
        toast.error("Image upload error.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!selectedImage) {
        toast.error("Please upload an image first.");
        setLoading(false);
        return;
      }

      const updatedProduct = {
        ...product,
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        image: selectedImage,
      };

      if (product.isLocal) {
        updateLocalProduct(updatedProduct);
        dispatch(updateProduct(updatedProduct));
      } else {
        if (selectedImage.startsWith("data:")) {
          toast.error("API products require a valid image URL");
          setLoading(false);
          return;
        }
        const apiPayload = {
          id: product.id,
          title: data.title,
          price: parseFloat(data.price),
          description: data.description,
          category: data.category,
          image: selectedImage,
        };
        await axios.put(
          `https://fakestoreapi.com/products/${product.id}`,
          apiPayload
        );
        dispatch(updateProduct(updatedProduct));
      }

      trackActivity("update", `Updated product: ${updatedProduct.title}`);
      toast.success("Product updated successfully!");

      await Promise.all([
        dispatch(fetchProductsAsync()),
        dispatch(fetchDashboardDataAsync()),
      ]);

      onClose();
    } catch (err) {
      toast.error("Error updating product");
      console.error("Product update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        background: "#f0f6ff",
        borderRadius: 3,
        border: "1.5px solid #e3edfa",
        p: { xs: 3, sm: 4 },
        boxShadow: 4,
        maxWidth: 400,
        mx: "auto",
        my: 2,
        minWidth: { xs: 0, sm: 340 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "visible",
        position: "relative",
      }}
    >
      <IconButton
        aria-label="close"
        onClick={() => !loading && onClose()}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          color: "#2563eb",
          background: "none",
          p: 0.5,
        }}
        disabled={loading}
      >
        <CloseIcon fontSize="small" sx={{ color: "#2563eb" }} />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            background: "linear-gradient(135deg, #2563eb 60%, #60a5fa 100%)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <svg width="28" height="28" fill="white" viewBox="0 0 24 24">
            <path
              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              stroke="white"
              strokeWidth="0.5"
            />
          </svg>
        </Box>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
          align="center"
          sx={{ mb: 0.5, letterSpacing: 0.5 }}
        >
          Edit Product
        </Typography>
        <Divider
          sx={{
            width: 60,
            height: 3,
            bgcolor: "primary.main",
            borderRadius: 2,
            mt: 1,
            mb: 0.5,
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxHeight: 380,
          overflowY: "auto",
          pr: 1,
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={1.2}>
            <TextField
              label="Title"
              fullWidth
              size="small"
              {...register("title", { required: "Title is required" })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              size="small"
              inputProps={{ step: "0.01" }}
              {...register("price", {
                required: "Price is required",
                min: 0.01,
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={2}
              {...register("description", {
                required: "Description is required",
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="Category"
              fullWidth
              size="small"
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category?.message}
            />
            <Box sx={{ width: "100%", mt: 1 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<ImageIcon />}
                  fullWidth
                  sx={{ mb: 1 }}
                  disabled={!product.isLocal}
                >
                  {product.isLocal ? "Change Product Image" : "Image URL Only"}
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 1, textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "60px",
                      maxHeight: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      margin: "0 auto",
                    }}
                  />
                </Box>
              )}
            </Box>
            <Button
              type="submit"
              fullWidth
              size="large"
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
                mt: 1,
                background: "#2563eb",
                color: "#fff !important",
                cursor: "pointer",
                "&:hover": { background: "#1e40af" },
              }}
              disabled={loading || !selectedImage}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
