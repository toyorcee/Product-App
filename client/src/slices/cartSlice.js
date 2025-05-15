import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart_items");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const fetchCartsAsync = createAsyncThunk(
  "cart/fetchCarts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        userId
          ? `https://fakestoreapi.com/carts/user/${userId}`
          : "https://fakestoreapi.com/carts"
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch carts");
    }
  }
);

export const fetchCartWithProductsAsync = createAsyncThunk(
  "cart/fetchCartWithProducts",
  async (cartId, { rejectWithValue }) => {
    try {
      const cartResponse = await axios.get(
        `https://fakestoreapi.com/carts/${cartId}`
      );
      const cart = cartResponse.data;

      // Fetch product details for each product in the cart
      const productsWithDetails = await Promise.all(
        cart.products.map(async (product) => {
          const productResponse = await axios.get(
            `https://fakestoreapi.com/products/${product.productId}`
          );
          return {
            ...product,
            details: productResponse.data,
          };
        })
      );

      return {
        ...cart,
        products: productsWithDetails,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch cart details"
      );
    }
  }
);

export const addProductToCartAsync = createAsyncThunk(
  "cart/addProductToCart",
  async ({ userId, productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://fakestoreapi.com/carts", {
        userId,
        products: [{ productId, quantity }],
      });
      return { productId, quantity, product: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to add to cart");
    }
  }
);

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem("cart_items", JSON.stringify(items));
  } catch {}
};

const initialState = {
  carts: [],
  currentCart: null,
  items: loadCartFromStorage(),
  loading: false,
  error: null,
  selectedUserId: 3, // Default to user 3
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUserId = action.payload;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      saveCartToStorage(state.items);
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.carts = action.payload;
        state.error = null;
      })
      .addCase(fetchCartsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartWithProductsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartWithProductsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCart = action.payload;
        state.error = null;
      })
      .addCase(fetchCartWithProductsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProductToCartAsync.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const existing = state.items.find((item) => item.id === productId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.items.push({ id: productId, quantity });
        }
        saveCartToStorage(state.items);
      });
  },
});

// Selectors
export const selectAllCarts = (state) => state.cart.carts;
export const selectCurrentCart = (state) => state.cart.currentCart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectSelectedUser = (state) => state.cart.selectedUserId;
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

// Actions
export const {
  setSelectedUser,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
