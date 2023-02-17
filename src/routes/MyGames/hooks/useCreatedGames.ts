import { useMetaMask } from "metamask-react";
import { useEffect, useState } from "react";
import {
  contractsStorageKey,
  deleteContractFromLocalStorage,
  getLocalStorageCreatedContracts,
  joinedContractsLocalStorageKey,
} from "../../../services/manageContractsLocalStorage";
import { web3 } from "../../../index";
import { getRPSContractInstance } from "../../../services/contract_rps";
import moment from "moment/moment";

export const useCreatedGames = () => {
  const { account } = useMetaMask();
  const [createdContracts, setCreatedContracts] = useState({});
  const [joinedContracts, setJoinedContracts] = useState({});

  useEffect(() => {
    const { contractsData } =
      getLocalStorageCreatedContracts(contractsStorageKey);
    const { contractsData: joinedContractsData } =
      getLocalStorageCreatedContracts(joinedContractsLocalStorageKey);

    setCreatedContracts(contractsData);
    setJoinedContracts(joinedContractsData);
  }, []);

  const deleteContractFromLocalStorageAndState = (
    contractAddress: string,
    localStorageKey: string
  ) => {
    const localStorageContractData = deleteContractFromLocalStorage(
      contractAddress,
      localStorageKey
    );
    if (localStorageKey === contractsStorageKey) {
      setCreatedContracts(localStorageContractData);
    } else {
      setJoinedContracts(localStorageContractData);
    }
  };
  const handleCheckContractStatus = async (contractAddress: string) => {
    const contractBalance = await web3.eth.getBalance(contractAddress);

    if (contractBalance === "0") {
      alert("Game being played by both parties");
      deleteContractFromLocalStorageAndState(
        contractAddress,
        contractsStorageKey
      );
      return deleteContractFromLocalStorageAndState(
        contractAddress,
        joinedContractsLocalStorageKey
      );
    }

    const rpsContractInstance = await getRPSContractInstance({
      deployedRPSContractAddress: contractAddress,
    });

    const ownerAddress = await rpsContractInstance.methods.j1().call();
    const isOwner = ownerAddress.toLowerCase() === account;

    const lastAction = await rpsContractInstance.methods.lastAction().call();
    const lastActionDate = moment.unix(lastAction);
    const now = moment();
    const fiveMinutesAgo = moment(now).subtract(5, "minutes");
    const hasFiveMinutesPassed = fiveMinutesAgo.isAfter(lastActionDate);

    const secondPartyMove = await rpsContractInstance.methods.c2().call();

    if (isOwner && secondPartyMove !== "0") {
      return alert("Second party did a move, please finish game");
    }
    if (!hasFiveMinutesPassed) {
      return alert(
        `Wait ${lastActionDate.diff(fiveMinutesAgo, "seconds")} seconds`
      );
    }
    if (hasFiveMinutesPassed) {
      if (isOwner) {
        // is second party doesn't have a move - it will refund
        if (secondPartyMove === "0") {
          try {
            console.log(secondPartyMove, hasFiveMinutesPassed);
            try {
              await rpsContractInstance.methods.j2Timeout().call();
              deleteContractFromLocalStorageAndState(
                rpsContractInstance.options.address,
                contractsStorageKey
              );
              return alert(
                "Second player didn't make a move - returning funds"
              );
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          alert(
            "Second player did a move, finish this play before second player request refund"
          );
        }
      } else {
        if (secondPartyMove === "0") {
          return alert(
            "First player can close this game, you can get refund if after accepting the game in join game tab and waiting for first party to forget to finish it"
          );
        }
        await rpsContractInstance.methods.j1Timeout().send({ from: account });
        deleteContractFromLocalStorageAndState(
          rpsContractInstance.options.address,
          joinedContractsLocalStorageKey
        );
        return alert(
          "First player didn't finished game on time - returning funds"
        );
      }
    }
  };

  return {
    joinedContracts,
    createdContracts,
    handleCheckContractStatus,
  };
};
