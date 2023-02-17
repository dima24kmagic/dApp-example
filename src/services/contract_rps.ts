import RPS from "../contracts/build/contracts/RPS.json";
import { web3 } from "../index";
import {
  getContractRawData,
  valueIntoHex,
  waitForTheTransactionToBeMined,
} from "./contracts";
import { IMove } from "../components/RPSMoves/PickMove";
import { getSaltFromLocalStorage } from "./manageContractsLocalStorage";

export const createRPSContractInstance = async ({
  account,
  stakeValue,
  hash,
  secondPartyAddress,
  onProcessing,
}: {
  account: string;
  stakeValue: string;
  hash?: string;
  secondPartyAddress: string;
  onProcessing: (txHash: string) => void;
}) => {
  // @ts-ignore
  const contractABI: AbiItem | AbiItem[] = RPS.abi;
  const contractBytecode: string = RPS.bytecode;

  const rawTransaction = await getContractRawData({
    contractABI,
    contractBytecode,
    accountAddress: account,
    args: [hash, secondPartyAddress],
    value: stakeValue,
  });

  // Sign the raw transaction with MetaMask and deploy using the MetaMask UI
  const transactionHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [rawTransaction],
  });

  onProcessing(transactionHash);
  const receipt = await waitForTheTransactionToBeMined(transactionHash);

  const contractAddress = receipt.contractAddress;

  const rpsContractInstance = new web3.eth.Contract(
    contractABI,
    contractAddress
  );

  return rpsContractInstance;
};

export const getRPSContractInstance = async ({
  deployedRPSContractAddress,
}: {
  deployedRPSContractAddress: string;
}) => {
  // @ts-ignore
  const contractABI: AbiItem | AbiItem[] = RPS.abi;
  const rpsContract = new web3.eth.Contract(
    // @ts-ignore
    contractABI,
    deployedRPSContractAddress
  );

  return rpsContract;
};

export const rpsContractJoinGame = async ({
  joinRPSAddress,
  selectedMove,
  account,
  joinStake,
  onConfirmJoinGame,
  onProcessTransaction,
}: {
  joinRPSAddress: string;
  selectedMove: IMove;
  account: string;
  joinStake: string;
  onConfirmJoinGame: () => void;
  onProcessTransaction: (txHash: string) => void;
}) => {
  const rpsContractInstance = await getRPSContractInstance({
    deployedRPSContractAddress: joinRPSAddress,
  });

  const playMethodAbi = rpsContractInstance.methods
    .play(selectedMove)
    .encodeABI();
  const transactionParameters = {
    from: account,
    to: joinRPSAddress,
    value: valueIntoHex(web3.utils.toWei(joinStake, "ether")),
    data: playMethodAbi,
  };

  onConfirmJoinGame();
  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
  });

  onProcessTransaction(txHash);
  await waitForTheTransactionToBeMined(txHash);

  const creatorAccount = await rpsContractInstance.methods.j1().call();

  return { creatorAccount };
};

export const rpsContractFinishGame = async ({
  finishRPSAddress,
  selectedMove,
  account,
  onConfirmFinishGame,
  onProcessTransaction,
}: {
  finishRPSAddress: string;
  selectedMove: IMove;
  account: string;
  onConfirmFinishGame: () => void;
  onProcessTransaction: (txHash: string) => void;
}) => {
  const rpsContractInstance = await getRPSContractInstance({
    deployedRPSContractAddress: finishRPSAddress,
  });
  const salt = getSaltFromLocalStorage(rpsContractInstance.options.address);

  const solveMethodABI = await rpsContractInstance.methods
    .solve(selectedMove, salt)
    .encodeABI();

  const transactionParameters = {
    from: account,
    to: finishRPSAddress,
    data: solveMethodABI,
  };

  onConfirmFinishGame();

  const txHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [transactionParameters],
  });

  onProcessTransaction(txHash);

  await waitForTheTransactionToBeMined(txHash);
};
