import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
} from "../api/products";

export const fetchDashboardDataAsync = createAsyncThunk(
  "dashboard/fetchData",
  async () => {
    const categoriesRes = await fetchCategories();
    const categories = categoriesRes.data;

    const productsRes = await fetchProducts();
    const apiProducts = productsRes.data;
    const localProducts = JSON.parse(
      localStorage.getItem("localProducts") || "[]"
    );
    const allProducts = [...apiProducts, ...localProducts];

    const totalProducts = allProducts.length;

    const categoryCounts = {};
    await Promise.all(
      categories.map(async (cat) => {
        categoryCounts[cat] = allProducts.filter(
          (p) => p.category === cat
        ).length;
      })
    );

    return {
      categoryCounts,
      totalProducts,
    };
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    categoryCounts: {},
    totalProducts: 0,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardDataAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardDataAsync.fulfilled, (state, action) => {
        state.categoryCounts = action.payload.categoryCounts;
        state.totalProducts = action.payload.totalProducts;
        state.loading = false;
      })
      .addCase(fetchDashboardDataAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
