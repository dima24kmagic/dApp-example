import Hasher from "../contracts/build/contracts/Hasher.json";
import { web3 } from "../index";
import { IMove } from "../components/RPSMoves/PickMove";
import {
  getContractRawData,
  waitForTheTransactionToBeMined,
} from "./contracts";

const DEPLOYED_HASHER_CONTRACT_ADDRESS =
  process.env.REACT_APP_HASHER_CONTRACT_ADDRESS ??
  "0xa9CA5a398A0d50ae4dB9EB4774a3CD03f8Dab15a";

export const getHasherContractInstance = () => {
  // @ts-ignore
  const contractABI: AbiItem | AbiItem[] = Hasher.abi;
  return new web3.eth.Contract(contractABI, DEPLOYED_HASHER_CONTRACT_ADDRESS);
};

// Create hasher contract instance if needed or can't deploy with truffle for some reason
export const createHashContractInstance = async ({
  initiatorAccountAddress,
  initiatorMove,
  salt,
  onProcessing,
}: {
  initiatorAccountAddress: string;
  initiatorMove: IMove;
  salt: string;
  onProcessing: (txHash: string) => void;
}) => {
  // @ts-ignore
  const contractABI: AbiItem | AbiItem[] = Hasher.abi;
  const contractBytecode: string = Hasher.bytecode;

  const rawTransaction = await getContractRawData({
    contractABI,
    contractBytecode,
    args: [initiatorMove, salt],
    accountAddress: initiatorAccountAddress,
  });

  // Sign the raw transaction with MetaMask and deploy using the MetaMask UI
  const transactionHash = await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [rawTransaction],
  });

  onProcessing(transactionHash);
  const receipt = await waitForTheTransactionToBeMined(transactionHash);

  const contractAddress = receipt.contractAddress;

  // Create a new contract instance using the ABI and address
  const hashContractInstance = new web3.eth.Contract(
    contractABI,
    contractAddress
  );

  return hashContractInstance;
};
