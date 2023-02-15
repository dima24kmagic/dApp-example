import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { MOVES } from "../../components/RPSMoves/PickMove";
import { getRPSContractInstance } from "../../services/contract_rps";
import moment from "moment";
import { useMetaMask } from "metamask-react";
import Game from "./Game";
import {
  contractsStorageKey,
  deleteContractFromLocalStorage,
  getJoinedLocalStorageContracts,
  getLocalStorageCreatedContracts,
  joinedContractsLocalStorageKey,
} from "../../services/manageContractsLocalStorage";

export interface IMyGamesProps {}
const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 100%;
  margin: 0 auto;
`;

/**
 * Route with all games stored in localstorage
 */
function MyGames(props: IMyGamesProps) {
  const {} = props;
  const { account } = useMetaMask();
  const [contractsData, setContractsData] = useState({});
  const [joinedContracts, setJoinedContracts] = useState({});

  useEffect(() => {
    const { contractsData } = getLocalStorageCreatedContracts();
    const joinedContractsData = getJoinedLocalStorageContracts();
    setContractsData(contractsData);
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
      setContractsData(localStorageContractData);
    } else {
      setJoinedContracts(localStorageContractData);
    }
  };

  const handleIfCanRefund = async (contractAddress: string) => {
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
            await rpsContractInstance.methods
              .j2Timeout()
              .send({ from: account });
            deleteContractFromLocalStorageAndState(
              rpsContractInstance.options.address,
              contractsStorageKey
            );
            return alert("Second player didn't make a move - returning funds");
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

  return (
    <StyledWrapper>
      <Typography
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        marginBottom="24px"
        fontWeight="900"
        fontSize="32px"
      >
        My Game Contracts
      </Typography>

      <Typography color="white" marginTop="16px">
        Joined Games:
      </Typography>
      {Object.keys(joinedContracts).map((contractKey) => {
        // @ts-ignore
        const contractData = joinedContracts[contractKey];
        // @ts-ignore
        const move = Object.keys(MOVES).find(
          // @ts-ignore
          (key) => MOVES[key] === contractData?.move
        );
        const creatorAccount = contractData?.account;

        if (creatorAccount.toLowerCase() === account) {
          return;
        }
        return (
          <Game
            creatorAccount={creatorAccount}
            handleIfCanRefund={handleIfCanRefund}
            contractKey={contractKey}
            // @ts-ignore
            move={move}
          />
        );
      })}

      <Typography color="white" marginTop="16px">
        Created Games:
      </Typography>
      {Object.keys(contractsData).map((contractKey) => {
        // @ts-ignore
        const contractData = contractsData[contractKey];
        // @ts-ignore
        const move = Object.keys(MOVES).find(
          // @ts-ignore
          (key) => MOVES[key] === contractData?.move
        );
        const creatorAccount = contractData?.account;

        if (creatorAccount.toLowerCase() !== account) {
          return;
        }
        return (
          <Game
            creatorAccount={creatorAccount}
            handleIfCanRefund={handleIfCanRefund}
            contractKey={contractKey}
            // @ts-ignore
            move={move}
          />
        );
      })}
    </StyledWrapper>
  );
}

export default MyGames;
