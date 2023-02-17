import Hasher from "../contracts/build/contracts/Hasher.json";
import { web3 } from "../index";
import { IMove } from "../components/RPSMoves/PickMove";
import { valueIntoHex } from "./contract_rps";

export const waitForTheTransactionToBeMined = async (
  transactionHash: string
) => {
  let receipt = null;
  while (receipt === null) {
    try {
      receipt = await window.ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [transactionHash],
      });
    } catch (error) {
      console.error(error);
    }
    // Wait 1 second before checking the transaction status again
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return receipt;
};

export const getContractRawData = async ({
  contractABI,
  contractBytecode,
  args,
  accountAddress,
  value,
  to,
}: {
  contractABI: any;
  contractBytecode: any;
  args: any[];
  accountAddress: string;
  value?: string;
  to?: string;
}) => {
  const contract = new web3.eth.Contract(contractABI);

  // Create a new contract deployment transaction
  const deployTransaction = contract.deploy({
    data: contractBytecode,
    ...(args?.length > 0 ? { arguments: args } : {}),
  });

  const nonce = await web3.eth.getTransactionCount(accountAddress);
  const netId = await web3.eth.net.getId();

  const rawTransaction = {
    from: accountAddress,
    nonce: web3.utils.toHex(nonce),
    data: deployTransaction.encodeABI(),
    chainId: netId,
    ...(value ? { value: valueIntoHex(web3.utils.toWei(value, "ether")) } : {}),
    ...(to ? { to } : {}),
  };

  return rawTransaction;
};

// TODO: .env.production, .env.development
const DEPLOYED_HASHER_CONTRACT_ADDRESS = "0xa9CA5a398A0d50ae4dB9EB4774a3CD03f8Dab15a";

export const getHasherContractInstance = () => {
  // @ts-ignore
  const contractABI: AbiItem | AbiItem[] = Hasher.abi;
  return new web3.eth.Contract(contractABI, DEPLOYED_HASHER_CONTRACT_ADDRESS)
}

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
