import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const financialDataSlice = createSlice({
  name: "financialData",
  initialState,
  reducers: {
    setFinancialData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setFinancialData } = financialDataSlice.actions;
export default financialDataSlice.reducer;
