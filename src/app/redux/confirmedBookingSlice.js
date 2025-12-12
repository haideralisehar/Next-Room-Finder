import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookingData: null,     // will store final confirmed booking response
  loading: false,        // optional: you can use this for APIs
  error: null,           // store any API error message
};

const confirmedBookingSlice = createSlice({
  name: "confirmedBooking",
  initialState,
  reducers: {
    setConfirmedBooking: (state, action) => {
      state.bookingData = action.payload;
    },
    clearConfirmedBooking: (state) => {
      state.bookingData = null;
      state.loading = false;
      state.error = null;
    },
    setConfirmedBookingLoading: (state, action) => {
      state.loading = action.payload;
    },
    setConfirmedBookingError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setConfirmedBooking,
  clearConfirmedBooking,
  setConfirmedBookingLoading,
  setConfirmedBookingError,
} = confirmedBookingSlice.actions;

export default confirmedBookingSlice.reducer;
