import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Stack,
  Divider,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductsAsync,
  addProduct,
  saveLocalProduct,
} from "../slices/productsSlice";
import { fetchCategoriesAsync, addCategory } from "../slices/categoriesSlice";
import { useActivity } from "../hooks/useActivity";
import ImageIcon from "@mui/icons-material/Image";
import { store } from "../store";
import { fetchDashboardDataAsync } from "../slices/dashboardSlice";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

export default function CreateProductForm({ onClose }) {
  const dispatch = useDispatch();
  const { trackActivity } = useActivity();
  const categories = useSelector((state) => state.categories.categories);
  const categoriesLoading = useSelector((state) => state.categories.loading);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategoriesAsync());
    }
  }, [dispatch, categories]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const CLOUDINARY_UPLOAD_URL =
    "https://api.cloudinary.com/v1_1/dnryzbfqb/image/upload";
  const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset";

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
      const payload = {
        title: data.title,
        price: parseFloat(data.price),
        description: data.description,
        category: data.category,
        image: selectedImage,
      };
      console.log("Submitting product payload:", payload);
      const res = await axios.post(
        "https://fakestoreapi.com/products",
        payload
      );
      console.log("API response:", res.data);
      trackActivity("create", `Created product: ${res.data.title}`);
      toast.success("Product created! ID: " + res.data.id);
      reset();
      setSelectedImage(null);
      setImagePreview(null);

      // Save the new product to localStorage
      const localProducts = JSON.parse(
        localStorage.getItem("localProducts") || "[]"
      );
      localProducts.push(res.data);
      localStorage.setItem("localProducts", JSON.stringify(localProducts));
      console.log(
        "localProducts in localStorage after appending:",
        localProducts
      );

      if (!categories.includes(res.data.category)) {
        dispatch(addCategory(res.data.category));
      }
      dispatch(fetchProductsAsync());
      dispatch(fetchCategoriesAsync());
      dispatch(fetchDashboardDataAsync());
      setTimeout(() => {
        const state = store.getState();
        console.log(
          "Products in Redux after optimistic update:",
          state.products
        );
        console.log(
          "Categories in Redux after optimistic update:",
          state.categories
        );
      }, 1200);
    } catch (err) {
      toast.error("Error creating product");
      console.error("Product creation error:", err);
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
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 10,
          color: "#2563eb",
          background: "none",
          p: 0.5,
        }}
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
              d="M12 5v14m-7-7h14"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
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
          Create Product
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
            <FormControl fullWidth error={!!errors.category} size="small">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                defaultValue=""
                {...register("category", { required: "Category is required" })}
                disabled={categoriesLoading}
              >
                {categories &&
                  categories.map((cat, idx) => (
                    <MenuItem value={cat} key={idx}>
                      {cat}
                    </MenuItem>
                  ))}
              </Select>
              {errors.category && (
                <Typography color="error" variant="caption">
                  {errors.category.message}
                </Typography>
              )}
            </FormControl>
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
                >
                  Upload Product Image
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
              {loading ? "Creating..." : "Create Product"}
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}
