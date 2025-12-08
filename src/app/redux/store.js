"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import searchReducer from "./searchSlice";
import hotelReducer from "./hotelSlice";
import priceConfirmReducer from "./roomslice";


import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";

// -----------------------------------
// 1. Combine all reducers
// -----------------------------------
const rootReducer = combineReducers({
  search: searchReducer,
  hotel: hotelReducer,
  priceConfirm: priceConfirmReducer,
});

// -----------------------------------
// 2. redux-persist config
// -----------------------------------
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["search", "hotel", "priceConfirm"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// -----------------------------------
// 3. Configure the store
// -----------------------------------
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
});

// -----------------------------------
// 4. Create the persistor
// -----------------------------------
export const persistor = persistStore(store);
