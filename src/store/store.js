import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import dateReducer from "./dateSlice";
import problemReducer from "./problemSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  date: dateReducer,
  problems: problemReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
