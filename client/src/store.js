import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import userReducer from "./slices/userSlice";
import dashboardReducer from "./slices/dashboardSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    user: userReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
