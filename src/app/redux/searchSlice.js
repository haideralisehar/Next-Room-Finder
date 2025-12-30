// store/hotelSlice.js
import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    hotels: [],
    meta: null,
    status: 'idle', // idle | loading | streaming | completed | failed
    error: null,
    dictionaryTypes: [],
    demandedRooms:null,
     country: "",
  },
  reducers: {
    startSearch: (state) => {
      state.hotels = [];
      state.meta = null;
      state.status = 'loading';
      state.error = null;
      
    },

    setDictionaryTypes(state, action) {
      state.dictionaryTypes = action.payload;
    },

    setCountry: (state, action) => {
  state.country = action.payload;
},

    setdemandedRooms(state, action){
      state.demandedRooms = action.payload;
    },

    setMeta: (state, action) => {
      state.meta = action.payload;
      state.status = 'streaming';
    },
    addBatch: (state, action) => {
      // Append new hotels from the batch to the current list
      state.hotels = [...state.hotels, ...action.payload];
    },
    searchDone: (state) => {
      state.status = 'completed';
    },
    searchError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { startSearch, setMeta, addBatch, searchDone, searchError, setDictionaryTypes, setdemandedRooms
 } = searchSlice.actions;
export default searchSlice.reducer;