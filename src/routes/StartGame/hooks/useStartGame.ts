import { ChangeEvent } from "react";
import {
  createHashContractInstance,
  getHasherContractInstance,
} from "../../../services/contract_hash";
import { createRPSContractInstance } from "../../../services/contract_rps";
import { useMetaMask } from "metamask-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  setRpsCreatedContractAddress,
  setSecondPartyAddress,
  setSelectedMove,
  setStake,
} from "../../../store/slices/startGameSlice";
import { IMove, MOVES } from "../../../components/RPSMoves/PickMove";
import {
  generateSalt,
  saveSaltToLocalStorage,
} from "../../../services/manageContractsLocalStorage";
import {
  setIsMiningTransaction,
  setLoadingMessage,
} from "../../../store/slices/transactionsLoadingSlice";

const useStartGame = () => {
  const { account } = useMetaMask();

  const { stake, secondPartyAddress, selectedMove, rpsCreatedContractAddress } =
    useSelector((state: RootState) => state.startGame);
  const dispatch = useDispatch();

  const handleStakeChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setStake(e.target.value));
  };
  const handleSecondPlayerAddressChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setSecondPartyAddress(e.target.value));
  };
  const handleMoveChange = (move: IMove) => {
    dispatch(setSelectedMove(move));
  };

  const handleStartGame = async () => {
    if (!secondPartyAddress) {
      alert("Paste second player address");
      return;
    }
    if (!stake) {
      alert("Set stake!");
      return;
    }
    if (!account) {
      alert("Connect to your metamask account!");
    }

    const salt = generateSalt();
    dispatch(setIsMiningTransaction(true));
    const hashContractInstance = await getHasherContractInstance();

    const hash = await hashContractInstance.methods
      .hash(selectedMove, salt)
      .call();

    dispatch(
      setLoadingMessage({
        txHash: "",
        message: "Now it time to create game smart contract",
      })
    );

    try {
      const rpsContractInstance = await createRPSContractInstance({
        account: account as string,
        hash,
        secondPartyAddress,
        stakeValue: stake,
        onProcessing: (txHash) => {
          dispatch(setIsMiningTransaction(true));
          dispatch(
            setLoadingMessage({
              txHash,
              message: "Creating RPS Smart Contract",
            })
          );
        },
      });
      saveSaltToLocalStorage({
        salt,
        contractAddress: rpsContractInstance.options.address,
        move: selectedMove,
        account: account as string,
      });
      dispatch(setIsMiningTransaction(false));
      dispatch(
        setRpsCreatedContractAddress(rpsContractInstance.options.address)
      );
      dispatch(setSelectedMove(MOVES.Rock));
      dispatch(setStake("0"));
      dispatch(setSecondPartyAddress(""));
    } catch (e) {
      alert("Cant RPS contract");
      dispatch(setIsMiningTransaction(false));
      console.log(e);
    }
  };

  return {
    stake,
    selectedMove,
    secondPartyAddress,
    rpsCreatedContractAddress,
    handleStakeChange,
    handleMoveChange,
    handleSecondPlayerAddressChange,
    handleStartGame,
  };
};

export default useStartGame;
