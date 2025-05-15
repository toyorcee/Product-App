import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProducts,
  fetchProductsByCategory,
  fetchProductById,
} from "../api/products";

function getLocalProducts() {
  return JSON.parse(localStorage.getItem("localProducts") || "[]");
}

export function saveLocalProduct(product) {
  const localProducts = getLocalProducts();
  localProducts.push(product);
  localStorage.setItem("localProducts", JSON.stringify(localProducts));
}

function groupByCategory(products) {
  const byCategory = {};
  for (const product of products) {
    if (!byCategory[product.category]) {
      byCategory[product.category] = [];
    }
    byCategory[product.category].push(product);
  }
  return byCategory;
}

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const { products } = getState().products;
    if (products.length > 0) return products;
    const res = await fetchProducts();
    const apiProducts = res.data;
    const localProducts = getLocalProducts();
    return [...apiProducts, ...localProducts];
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

export function updateLocalProduct(updatedProduct) {
  let localProducts = JSON.parse(localStorage.getItem("localProducts") || "[]");
  localProducts = localProducts.map((p) =>
    p.id === updatedProduct.id ? updatedProduct : p
  );
  localStorage.setItem("localProducts", JSON.stringify(localProducts));
}

export function deleteLocalProduct(id) {
  let localProducts = JSON.parse(localStorage.getItem("localProducts") || "[]");
  localProducts = localProducts.filter((p) => p.id !== id);
  localStorage.setItem("localProducts", JSON.stringify(localProducts));
}

const productsSlice = createSlice({
  name: "products",
  initialState: { products: [], byCategory: {}, byId: {}, loading: false },
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
      const cat = action.payload.category;
      if (!state.byCategory[cat]) {
        state.byCategory[cat] = [];
      }
      state.byCategory[cat].push(action.payload);
    },
    updateProduct: (state, action) => {
      const idx = state.products.findIndex((p) => p.id === action.payload.id);
      if (idx !== -1) {
        state.products[idx] = action.payload;
      }
      // Update byCategory as well
      const cat = action.payload.category;
      if (state.byCategory[cat]) {
        const catIdx = state.byCategory[cat].findIndex(
          (p) => p.id === action.payload.id
        );
        if (catIdx !== -1) {
          state.byCategory[cat][catIdx] = action.payload;
        }
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
      for (const cat in state.byCategory) {
        state.byCategory[cat] = state.byCategory[cat].filter(
          (p) => p.id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
        console.log("fetchProductsAsync fulfilled, payload:", action.payload);
        state.products = action.payload;
        state.byCategory = groupByCategory(action.payload);
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

export const { addProduct, updateProduct, deleteProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
