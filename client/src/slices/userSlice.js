import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserById, updateUser } from "../api/user";

export const fetchUserByIdAsync = createAsyncThunk(
  "user/fetchById",
  async (id, { getState }) => {
    const { user } = getState().user;
    if (user && user.id === id) {
      return user;
    }
    const res = await fetchUserById(id);
    return res.data;
  }
);

export const updateUserAsync = createAsyncThunk(
  "user/update",
  async (payload) => {
    const res = await updateUser(payload);
    return res.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { user: null, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserByIdAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserByIdAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserByIdAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        state.loading = false;
      })
      .addCase(updateUserAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
