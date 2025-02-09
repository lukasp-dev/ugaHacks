import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problems: [],
  answers: {},
  loading: false,
  error: null,
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    fetchProblemsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProblemsSuccess: (state, action) => {
      state.loading = false;
      state.problems = action.payload;
      state.answers = {};
    },
    fetchProblemsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateAnswer: (state, action) => {
      const { problemId, isCorrect, explanation } = action.payload;
      state.answers[problemId] = { isCorrect, explanation };
    },
  },
});

export const {
  fetchProblemsStart,
  fetchProblemsSuccess,
  fetchProblemsFailure,
  updateAnswer,
} = problemSlice.actions;

export default problemSlice.reducer;
