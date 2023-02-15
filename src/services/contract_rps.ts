import RPS from "../contracts/build/contracts/RPS.json";
import { web3 } from "../index";

export const createRPSContractInstance = async ({
  account,
  stakeValue,
  hash,
  secondPartyAddress,
}: {
  account: string;
  stakeValue: string;
  hash?: string;
  secondPartyAddress: string;
}) => {
  const netId = await web3.eth.net.getId();
  // @ts-ignore
  const RPSNetwork = RPS.networks[netId];
  const rpsContract = new web3.eth.Contract(
    // @ts-ignore
    RPS.abi,
    RPSNetwork && RPSNetwork.address
  );
  const rpsContractInstance = await rpsContract
    .deploy({ data: RPS.bytecode, arguments: [hash, secondPartyAddress] })
    .send({
      from: account as string,
      value: stakeValue,
      gas: 6721975,
      gasPrice: web3.utils.toWei("20", "gwei"),
    });
  return rpsContractInstance;
};

export const getRPSContractInstance = async ({
  deployedRPSContractAddress,
}: {
  deployedRPSContractAddress: string;
}) => {
  const rpsContract = new web3.eth.Contract(
    // @ts-ignore
    RPS.abi,
    deployedRPSContractAddress
  );

  return rpsContract;
};
