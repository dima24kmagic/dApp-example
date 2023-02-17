import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMove, MOVES } from "../../components/RPSMoves/PickMove";

const initialState = {
  selectedMove: MOVES.Rock,
  finishRPSAddress: "",
};

export const finishGameSlice = createSlice({
  name: "finishGame",
  initialState,
  reducers: {
    setFinishRPSAddress: (state, action: PayloadAction<string>) => {
      state.finishRPSAddress = action.payload;
    },
    setSelectedMove: (state, action: PayloadAction<IMove>) => {
      state.selectedMove = action.payload;
    },
  },
});

export const { setSelectedMove, setFinishRPSAddress } = finishGameSlice.actions;
