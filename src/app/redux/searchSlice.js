// src/redux/searchSlice.js
"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * performSearchThunk
 * Accepts payload: { countryCode, checkIn, checkOut, rooms, adults, currency, nationality, starRating }
 * You already have an API route used in context (performSearch). This thunk calls /api/search (or adapt to your endpoint).
 */
export const performSearchThunk = createAsyncThunk(
  "search/performSearch",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/hotelsearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      // if your backend returns success flag
      // if (!json.success) return rejectWithValue(json);

      return json;
    } catch (err) {
      return rejectWithValue(err.message || "Network error");
    }
  }
);

const initialState = {
  searchPayload: null,        // last request body
  apiResults: null,          // API response for hotels (hotelDetails + prices)
  loading: false,
  error: null,
  selectedHotel: null,       // hotel object user clicked
  dictionaryTypes: null,     // additional API response used in your Book flow (all_types)
};

const slice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchPayload(state, action) {
      state.searchPayload = action.payload;
    },
    setApiResults(state, action) {
      state.apiResults = action.payload;
    },
    setSelectedHotel(state, action) {
      state.selectedHotel = action.payload;
    },
    setDictionaryTypes(state, action) {
      state.dictionaryTypes = action.payload;
    },
    clearSearchState(state) {
      state.searchPayload = null;
      state.apiResults = null;
      state.loading = false;
      state.error = null;
      state.selectedHotel = null;
      state.dictionaryTypes = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearchThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(performSearchThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.apiResults = action.payload;
      })
      .addCase(performSearchThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search failed";
      });
  },
});

export const {
  setSearchPayload,
  setApiResults,
  setSelectedHotel,
  setDictionaryTypes,
  clearSearchState,
} = slice.actions;

export default slice.reducer;
