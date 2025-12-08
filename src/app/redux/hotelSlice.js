import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedHotel: null,
  apiResults: null,
  searchDetails: null, // NEW: stores checkin/checkout/rooms
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    setSelectedHotel(state, action) {
      state.selectedHotel = action.payload;
    },
    setApiResults(state, action) {
      state.apiResults = action.payload;
    },
    setSearchDetails(state, action) {
      state.searchDetails = action.payload;
    },
    clearHotelData(state) {
      state.selectedHotel = null;
      state.apiResults = null;
      state.searchDetails = null;
    },
  },
});

export const {
  setSelectedHotel,
  setApiResults,
  setSearchDetails,
  clearHotelData,
} = hotelSlice.actions;

export default hotelSlice.reducer;
