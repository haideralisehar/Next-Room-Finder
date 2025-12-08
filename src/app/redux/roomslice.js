// src/redux/priceConfirmSlice.js
"use client";

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  priceConfirmData: null,
  error: null,
};

const priceConfirmSlice = createSlice({
  name: "priceConfirm",
  initialState,
  reducers: {
    priceConfirmStart(state) {
      state.loading = true;
      state.error = null;
    },
    priceConfirmSuccess(state, action) {
      state.loading = false;
      state.priceConfirmData = action.payload;
    },
    priceConfirmFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    clearPriceConfirm(state) {
      state.priceConfirmData = null;
      state.error = null;
      state.loading = false;
    }
  }
});

export const {
  priceConfirmStart,
  priceConfirmSuccess,
  priceConfirmFailure,
  clearPriceConfirm,
} = priceConfirmSlice.actions;

export default priceConfirmSlice.reducer;
