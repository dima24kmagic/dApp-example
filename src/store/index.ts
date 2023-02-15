import { configureStore } from "@reduxjs/toolkit";
import { startGameSlice } from "./slices/startGameSlice";
import { joinGameSlice } from "./slices/joinGameSlice";
import { finishGameSlice } from "./slices/finishGameSlice";

export const store = configureStore({
  reducer: {
    startGame: startGameSlice.reducer,
    joinGame: joinGameSlice.reducer,
    finishGame: finishGameSlice.reducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
