import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMove, MOVES } from "../../components/RPSMoves/PickMove";

const initialState = {
  stake: "0",
  secondPartyAddress: "",
  selectedMove: MOVES.Rock,
  rpsCreatedContractAddress: "",
};

export const startGameSlice = createSlice({
  name: "startGame",
  initialState,
  reducers: {
    setStake: (state, action: PayloadAction<string>) => {
      state.stake = action.payload;
    },
    setSecondPartyAddress: (state, action: PayloadAction<string>) => {
      state.secondPartyAddress = action.payload;
    },
    setSelectedMove: (state, action: PayloadAction<IMove>) => {
      state.selectedMove = action.payload;
    },
    setRpsCreatedContractAddress: (state, action: PayloadAction<string>) => {
      state.rpsCreatedContractAddress = action.payload;
    },
  },
});

export const {
  setStake,
  setSelectedMove,
  setSecondPartyAddress,
  setRpsCreatedContractAddress,
} = startGameSlice.actions;
