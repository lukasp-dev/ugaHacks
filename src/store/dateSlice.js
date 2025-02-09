import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 1,
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    reset: (state) => {
      state.value = 1;
    },
  },
});

export const { increment, reset } = dateSlice.actions;
export default dateSlice.reducer;
