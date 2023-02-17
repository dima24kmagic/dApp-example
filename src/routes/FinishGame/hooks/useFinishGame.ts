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
import { web3 } from "../../../index";
import { waitForTheTransactionToBeMined } from "../../../services/contract_hash";
import {
  setIsMiningTransaction,
  setLoadingMessage,
} from "../../../store/slices/transactionsLoadingSlice";

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
        const solveMethodABI = await rpsContractInstance.methods
          .solve(selectedMove, salt)
          .encodeABI();

        const networkId = await web3.eth.net.getId();
        const transactionParameters = {
          from: account,
          to: finishRPSAddress,
          data: solveMethodABI,
          chainId: networkId,
        };

        dispatch(setIsMiningTransaction(true));
        dispatch(
          setLoadingMessage({
            message: "Please send transaction to solve the game",
            txHash: "",
          })
        );
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        dispatch(
          setLoadingMessage({
            message: "Solving game on blockchain",
            txHash,
          })
        );

        await waitForTheTransactionToBeMined(txHash);

        dispatch(setIsMiningTransaction(false));

        const { contractsData } =
          getLocalStorageCreatedContracts(contractsStorageKey);
        // @ts-ignore
        delete contractsData[rpsContractInstance.options.address];
        localStorage.setItem(
          contractsStorageKey,
          JSON.stringify(contractsData)
        );
        dispatch(setFinishRPSAddress(""));
        dispatch(setSelectedMove(MOVES.Rock));
      } catch (e) {
        dispatch(setIsMiningTransaction(false));
        console.log(e);
      }
    } catch (e) {
      alert("Wrong Contract Address");
      dispatch(setIsMiningTransaction(false));
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
