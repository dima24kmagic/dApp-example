import { web3 } from "../index";

export const valueIntoHex = (value: string) => {
  const valueInHex = "0x" + Number(value).toString(16);
  return valueInHex;
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
