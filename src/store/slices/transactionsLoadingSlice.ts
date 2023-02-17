import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isMiningTransaction: false,
  loadingMessage: {
    txHash: "",
    message: "",
  },
};

export const transactionsLoadingSlice = createSlice({
  name: "transactionsLoading",
  initialState,
  reducers: {
    setIsMiningTransaction: (state, action: PayloadAction<boolean>) => {
      state.isMiningTransaction = action.payload;
    },
    setLoadingMessage: (
      state,
      action: PayloadAction<typeof initialState.loadingMessage>
    ) => {
      action.payload.message +=
        ". Please don't close browser or this window for correct application behaviour";
      state.loadingMessage = action.payload;
    },
  },
});

export const { setIsMiningTransaction, setLoadingMessage } =
  transactionsLoadingSlice.actions;
