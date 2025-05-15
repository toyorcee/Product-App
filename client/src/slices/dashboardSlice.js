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
    const allProducts = productsRes.data;
    const totalProducts = allProducts.length;

    const categoryCounts = {};
    await Promise.all(
      categories.map(async (cat) => {
        const res = await fetchProductsByCategory(cat);
        categoryCounts[cat] = res.data.length;
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
