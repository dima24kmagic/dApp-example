import Hasher from "../contracts/build/contracts/Hasher.json";
import { ethersProvider, web3 } from "../index";
import { IMove } from "../components/RPSMoves/PickMove";
import { ContractFactory } from "ethers";

export const createHashContractInstance = async ({
  initiatorAccountAddress,
  initiatorMove,
  salt,
}: {
  initiatorAccountAddress: string;
  initiatorMove: IMove;
  salt: string;
}) => {
  const signer = ethersProvider.getSigner();
  const hasherFactory = new ContractFactory(
    Hasher.abi,
    Hasher.bytecode,
    signer
  );
  const hashContractInstance = await hasherFactory
    .deploy(initiatorMove, salt)
    .then(() => {
      console.log("deployed successfully");
    })
    .catch(() => {
      console.log("Not deployed");
    });
  // const hashContract = new web3.eth.Contract(
  //   // @ts-ignore
  //   Hasher.abi,
  // );
  //
  // // Get the gas estimate for deploying the contract
  // const gasEstimate = await web3.eth.estimateGas({
  //   data: Hasher.bytecode,
  // });
  // // Get the current gas price
  // const gasPrice = await web3.eth.getGasPrice();
  //
  // console.log({ gasPrice, gasEstimate });
  //
  // const hashContractInstance = await hashContract
  //   .deploy({ data: Hasher.bytecode, arguments: [initiatorMove, salt] })
  //   .send({
  //     from: initiatorAccountAddress,
  //     gas: gasEstimate,
  //     gasPrice: gasPrice,
  //   });
  return hashContractInstance;
};
