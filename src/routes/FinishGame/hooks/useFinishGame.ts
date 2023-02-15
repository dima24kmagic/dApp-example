import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getRPSContractInstance } from "../../../services/contract_rps";
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
  getSaltFromLocalStorage,
} from "../../../services/manageContractsLocalStorage";

const useFinishGame = () => {
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
      const rpsContractInstance = await getRPSContractInstance({
        deployedRPSContractAddress: finishRPSAddress,
      });

      const salt = getSaltFromLocalStorage(rpsContractInstance.options.address);

      try {
        await rpsContractInstance.methods
          .solve(selectedMove, salt)
          .send({ from: account });
        const { contractsData } = getLocalStorageCreatedContracts();
        // @ts-ignore
        delete contractsData[rpsContractInstance.options.address];
        localStorage.setItem(
          contractsStorageKey,
          JSON.stringify(contractsData)
        );
        dispatch(setFinishRPSAddress(""));
        dispatch(setSelectedMove(MOVES.Rock));
      } catch (e) {}
    } catch (e) {
      alert("Wrong Contract Address");
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
