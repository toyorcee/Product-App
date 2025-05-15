import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./slices/productsSlice";
import categoriesReducer from "./slices/categoriesSlice";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import dashboardReducer from "./slices/dashboardSlice";
import activityReducer from "./slices/activitySlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    categories: categoriesReducer,
    user: userReducer,
    cart: cartReducer,
    dashboard: dashboardReducer,
    activity: activityReducer,
  },
});
