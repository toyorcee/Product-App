import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductById,
} from "../api/products";

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const { products } = getState().products;
    if (products.length > 0) return products;
    const res = await fetchProducts();
    return res.data;
  }
);

export const fetchProductsByCategoryAsync = createAsyncThunk(
  "products/fetchByCategory",
  async (category, { getState }) => {
    const { byCategory } = getState().products;
    if (byCategory[category]) {
      return { category, products: byCategory[category], fromCache: true };
    }
    const res = await fetchProductsByCategory(category);
    return { category, products: res.data, fromCache: false };
  }
);

export const fetchProductByIdAsync = createAsyncThunk(
  "products/fetchById",
  async (id, { getState }) => {
    const { byId } = getState().products;
    if (byId && byId[id]) {
      return { id, product: byId[id], fromCache: true };
    }
    const res = await fetchProductById(id);
    return { id, product: res.data, fromCache: false };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: { products: [], byCategory: {}, byId: {}, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProductsAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductsByCategoryAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsByCategoryAsync.fulfilled, (state, action) => {
        state.byCategory[action.payload.category] = action.payload.products;
        state.loading = false;
      })
      .addCase(fetchProductsByCategoryAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.byId[action.payload.id] = action.payload.product;
        state.loading = false;
      })
      .addCase(fetchProductByIdAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default productsSlice.reducer;
