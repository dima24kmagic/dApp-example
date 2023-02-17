import { ChangeEvent } from "react";
import { web3 } from "../../../index";
import {
  getRPSContractInstance,
  valueIntoHex,
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
import { waitForTheTransactionToBeMined } from "../../../services/contract_hash";
import {
  setIsMiningTransaction,
  setLoadingMessage,
} from "../../../store/slices/transactionsLoadingSlice";

const useJoinGame = () => {
  const { account } = useMetaMask();

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
    const rpsContractInstance = await getRPSContractInstance({
      deployedRPSContractAddress: joinRPSAddress,
    });
    try {
      const playMethodAbi = rpsContractInstance.methods
        .play(selectedMove)
        .encodeABI();

      const networkId = await web3.eth.net.getId();

      const transactionParameters = {
        from: account,
        to: joinRPSAddress,
        value: valueIntoHex(web3.utils.toWei(joinStake, "ether")),
        data: playMethodAbi,
        chainId: networkId,
      };

      dispatch(setIsMiningTransaction(true));
      dispatch(
        setLoadingMessage({
          message: "Please confirm sending your move and stake",
          txHash: "",
        })
      );
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      dispatch(
        setLoadingMessage({
          message: "Please wait for contract mining",
          txHash,
        })
      );
      await waitForTheTransactionToBeMined(txHash);
      dispatch(setIsMiningTransaction(false));

      const creatorAccount = await rpsContractInstance.methods.j1().call();

      dispatch(setJoinStake("0"));
      dispatch(setSelectedMove(MOVES.Rock));
      dispatch(setJoinRPSAddress(""));
      createJoinedLocalStorageContract({
        contractAddress: joinRPSAddress,
        move: selectedMove,
        account: creatorAccount,
      });
    } catch (e) {
      console.log(e);
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
