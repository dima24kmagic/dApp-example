import { ChangeEvent } from "react";
import { web3 } from "../../../index";
import {
  getRPSContractInstance,
  rpsContractJoinGame,
} from "../../../services/contract_rps";
import { useMetaMask } from "metamask-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  setJoinRPSAddress,
  setJoinStake,
  setSelectedMove,
} from "../../../store/slices/joinGameSlice";
import { IMove, MOVES } from "../../../components/RPSMoves/PickMove";
import { createJoinedLocalStorageContract } from "../../../services/manageContractsLocalStorage";
import {
  setIsMiningTransaction,
  setLoadingMessage,
} from "../../../store/slices/transactionsLoadingSlice";
import { useNavigate } from "react-router-dom";

const useJoinGame = () => {
  const { account } = useMetaMask();
  const navigate = useNavigate();

  const { joinStake, selectedMove, joinRPSAddress } = useSelector(
    (state: RootState) => state.joinGame
  );
  const dispatch = useDispatch();

  const handleJoinRPSAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(setJoinRPSAddress(e.target.value));
  };
  const handleMoveChange = (move: IMove) => {
    dispatch(setSelectedMove(move));
  };

  const handleGetContractInfo = async () => {
    if (!joinRPSAddress) {
      alert("Paste game contract address");
    }

    try {
      const rpsContractInstance = await getRPSContractInstance({
        deployedRPSContractAddress: joinRPSAddress,
      });
      const rpsStake = await rpsContractInstance.methods.stake().call();
      const contractStake = web3.utils.fromWei(rpsStake, "ether");
      dispatch(setJoinStake(contractStake));
    } catch (e) {
      alert("Can't get contract instance");
      console.log(e);
    }
  };

  const handleAcceptGame = async () => {
    try {
      const { creatorAccount } = await rpsContractJoinGame({
        account: account as string,
        joinRPSAddress,
        joinStake,
        selectedMove,
        onConfirmJoinGame: () => {
          dispatch(setIsMiningTransaction(true));
          dispatch(
            setLoadingMessage({
              message: "Please confirm sending your move and stake",
              txHash: "",
            })
          );
        },
        onProcessTransaction: (txHash) =>
          dispatch(
            setLoadingMessage({
              message: "Please wait for contract mining",
              txHash,
            })
          ),
      });
      dispatch(setIsMiningTransaction(false));
      dispatch(setJoinStake("0"));
      dispatch(setSelectedMove(MOVES.Rock));
      dispatch(setJoinRPSAddress(""));
      createJoinedLocalStorageContract({
        contractAddress: joinRPSAddress,
        move: selectedMove,
        account: creatorAccount,
      });
      navigate("/games");
    } catch (e) {
      console.log(e);
      alert("Problems joining game");
      dispatch(setIsMiningTransaction(false));
    }
  };

  const handleDenyGame = () => {
    dispatch(setJoinRPSAddress(""));
    dispatch(setJoinStake("0"));
  };
  return {
    joinRPSAddress,
    selectedMove,
    stake: joinStake,
    handleCreatedGameAddressChange: handleJoinRPSAddressChange,
    handleGetContractInfo,
    handleMoveChange,
    handleAcceptGame,
    handleDenyGame,
  };
};

export default useJoinGame;
