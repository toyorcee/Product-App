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

  // First, get all unique categories
  const allCategories = Array.from(
    new Set(products.map((p) => p.category.trim()))
  );

  // Initialize empty arrays for each category
  allCategories.forEach((cat) => {
    byCategory[cat] = [];
  });

  // Group products by their exact category
  products.forEach((product) => {
    const category = product.category.trim();
    if (byCategory[category]) {
      byCategory[category].push(product);
    }
  });

  return byCategory;
}

export const fetchProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState }) => {
    const res = await fetchProducts();
    const apiProducts = res.data;
    const localProducts = JSON.parse(
      localStorage.getItem("localProducts") || "[]"
    );

    // Merge products and sort by ID
    const merged = [...apiProducts, ...localProducts].sort(
      (a, b) => b.id - a.id
    );
    return merged;
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
  try {
    const localProducts = JSON.parse(
      localStorage.getItem("localProducts") || "[]"
    );
    const filteredProducts = localProducts.filter((p) => p.id !== id);
    localStorage.setItem("localProducts", JSON.stringify(filteredProducts));
  } catch (error) {
    console.error("Error deleting local product:", error);
  }
}

const productsSlice = createSlice({
  name: "products",
  initialState: { products: [], byCategory: {}, byId: {}, loading: false },
  reducers: {
    addProduct: (state, action) => {
      // Add to products array
      state.products.push(action.payload);

      // Update byCategory
      const category = action.payload.category.trim();
      if (!state.byCategory[category]) {
        state.byCategory[category] = [];
      }
      state.byCategory[category].push(action.payload);

      // Update byId
      state.byId[action.payload.id] = action.payload;
    },
    updateProduct: (state, action) => {
      const updatedProduct = action.payload;
      const oldProduct = state.byId[updatedProduct.id];

      // Update in products array
      const productIndex = state.products.findIndex(
        (p) => p.id === updatedProduct.id
      );
      if (productIndex !== -1) {
        state.products[productIndex] = updatedProduct;
      }

      // Update in byCategory
      if (oldProduct) {
        // Remove from old category
        const oldCategory = oldProduct.category.trim();
        if (state.byCategory[oldCategory]) {
          state.byCategory[oldCategory] = state.byCategory[oldCategory].filter(
            (p) => p.id !== updatedProduct.id
          );
        }
      }

      // Add to new category
      const newCategory = updatedProduct.category.trim();
      if (!state.byCategory[newCategory]) {
        state.byCategory[newCategory] = [];
      }
      state.byCategory[newCategory].push(updatedProduct);

      // Update byId
      state.byId[updatedProduct.id] = updatedProduct;
    },
    deleteProduct: (state, action) => {
      const productId = action.payload;
      const product = state.byId[productId];

      // Remove from products array
      state.products = state.products.filter((p) => p.id !== productId);

      // Remove from category
      if (product) {
        const category = product.category.trim();
        if (state.byCategory[category]) {
          state.byCategory[category] = state.byCategory[category].filter(
            (p) => p.id !== productId
          );
        }
      }

      // Remove from byId
      delete state.byId[productId];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsAsync.fulfilled, (state, action) => {
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
