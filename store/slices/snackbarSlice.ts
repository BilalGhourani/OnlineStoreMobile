import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  show: boolean;
  isError: Boolean | undefined;
  message: string;
}

const initialState: SnackbarState = {
  show: false,
  isError: false,
  message: "",
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; isError?: boolean }>
    ) => {
      state.message = action.payload.message;
      state.isError = action.payload.isError;
      state.show = true;
    },
    hideSnackbar: (state) => {
      state.show = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
