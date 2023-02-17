import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMove, MOVES } from "../../components/RPSMoves/PickMove";

const initialState = {
  joinStake: "0",
  selectedMove: MOVES.Rock,
  joinRPSAddress: "",
};

export const joinGameSlice = createSlice({
  name: "joinGame",
  initialState,
  reducers: {
    setJoinStake: (state, action: PayloadAction<string>) => {
      state.joinStake = action.payload;
    },
    setJoinRPSAddress: (state, action: PayloadAction<string>) => {
      state.joinRPSAddress = action.payload;
    },
    setSelectedMove: (state, action: PayloadAction<IMove>) => {
      state.selectedMove = action.payload;
    },
  },
});

export const { setJoinStake, setSelectedMove, setJoinRPSAddress } =
  joinGameSlice.actions;
