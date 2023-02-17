import React from "react";
import styled from "styled-components";
import { MOVES } from "../../components/RPSMoves/PickMove";
import Game from "./Game";
import { Text } from "../../components/LoadingState/ProgressLoader";
import { useCreatedGames } from "./hooks/useCreatedGames";

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
  const { createdContracts, joinedContracts, handleCheckContractStatus } =
    useCreatedGames();
  const renderGames = (contracts: any) => {
    return (
      <>
        {Object.keys(contracts).map((contractKey: string) => {
          const contractData = contracts[contractKey];
          const move = Object.keys(MOVES).find(
            // @ts-ignore
            (key) => MOVES[key] === contractData?.move
          );
          const creatorAccount = contractData?.account;
          return (
            <Game
              key={contractKey}
              creatorAccount={creatorAccount}
              onContractStatusCheck={handleCheckContractStatus}
              contractKey={contractKey}
              // @ts-ignore
              move={move}
            />
          );
        })}
      </>
    );
  };

  return (
    <StyledWrapper>
      <Text
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        marginBottom="24px"
        fontWeight="900"
        fontSize="32px"
      >
        My Game Contracts
      </Text>

      <Text color="white" marginTop="16px">
        Joined Games:
      </Text>
      {renderGames(joinedContracts)}
      <Text color="white" marginTop="16px">
        Created Games:
      </Text>
      {renderGames(createdContracts)}
    </StyledWrapper>
  );
}

export default MyGames;
