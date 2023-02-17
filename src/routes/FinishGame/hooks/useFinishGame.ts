import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { rpsContractFinishGame } from "../../../services/contract_rps";
import { useMetaMask } from "metamask-react";
import { IMove, MOVES } from "../../../components/RPSMoves/PickMove";
import {
  setFinishRPSAddress,
  setSelectedMove,
} from "../../../store/slices/finishGameSlice";
import { ChangeEvent } from "react";
import {
  contractsStorageKey,
  getLocalStorageCreatedContracts,
} from "../../../services/manageContractsLocalStorage";
import {
  setIsMiningTransaction,
  setLoadingMessage,
} from "../../../store/slices/transactionsLoadingSlice";
import { useNavigate } from "react-router-dom";

const useFinishGame = () => {
  const navigate = useNavigate();
  const { account } = useMetaMask();
  const { finishRPSAddress, selectedMove } = useSelector(
    (state: RootState) => state.finishGame
  );
  const dispatch = useDispatch();

  const handleSetSelectedMove = (move: IMove) => {
    dispatch(setSelectedMove(move));
  };
  const handleSetFinishRPSAddress = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setFinishRPSAddress(e.target.value));
  };

  const handleFinishGame = async () => {
    try {
      await rpsContractFinishGame({
        account: account as string,
        selectedMove,
        finishRPSAddress,
        onConfirmFinishGame: () => {
          dispatch(setIsMiningTransaction(true));
          dispatch(
            setLoadingMessage({
              message: "Please send transaction to solve the game",
              txHash: "",
            })
          );
        },
        onProcessTransaction: (txHash) => {
          dispatch(
            setLoadingMessage({
              message: "Solving game on blockchain",
              txHash,
            })
          );
        },
      });
      dispatch(setIsMiningTransaction(false));

      const { contractsData } =
        getLocalStorageCreatedContracts(contractsStorageKey);
      // @ts-ignore
      delete contractsData[finishRPSAddress];
      localStorage.setItem(contractsStorageKey, JSON.stringify(contractsData));
      dispatch(setFinishRPSAddress(""));
      dispatch(setSelectedMove(MOVES.Rock));
      navigate("/");
    } catch (e) {
      alert("Wrong Contract Address");
      dispatch(setIsMiningTransaction(false));
      console.log(e);
    }
  };

  return {
    handleFinishGame,
    handleSetSelectedMove,
    handleChangeFinishRPSAddress: handleSetFinishRPSAddress,
    selectedMove,
    finishRPSAddress,
  };
};

export default useFinishGame;
