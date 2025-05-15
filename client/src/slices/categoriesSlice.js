import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCategories } from "../api/products";

export const fetchCategoriesAsync = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { getState }) => {
    const { categories } = getState().categories;
    if (categories.length > 0) {
      return categories;
    }
    const res = await fetchCategories();
    return res.data;
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState: { categories: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategoriesAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categoriesSlice.reducer;
