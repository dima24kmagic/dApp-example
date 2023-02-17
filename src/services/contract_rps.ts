import RPS from "../contracts/build/contracts/RPS.json";
import { web3 } from "../index";
import {
  getContractRawData,
  waitForTheTransactionToBeMined,
} from "./contract_hash";

export const valueIntoHex = (value: string) => {
  const valueInHex = "0x" + Number(value).toString(16);
  return valueInHex;
};

export const createRPSContractInstance = async ({
  account,
  stakeValue,
  hash,
  secondPartyAddress,
  onProcessing
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
  onProcessing(transactionHash)

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
