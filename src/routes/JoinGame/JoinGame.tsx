import React from "react";
import useJoinGame from "./hooks/useJoinGame";
import PickMove from "../../components/RPSMoves";
import { Button, Input, InputLabel, Typography } from "@mui/material";
import styled from "styled-components";
import { StyledHighlight } from "../../components/AccountInfo/AccountInfo";
import {Text} from "../../components/LoadingState/ProgressLoader";

export interface IJoinGameProps {}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 400px;
  margin: 0 auto;
`;
/**
 * Join created game
 */
function JoinGame(props: IJoinGameProps) {
  const {} = props;
  const {
    joinRPSAddress,
    handleCreatedGameAddressChange,
    handleGetContractInfo,
    handleMoveChange,
    handleAcceptGame,
    handleDenyGame,
    stake,
    selectedMove,
  } = useJoinGame();
  return (
    <StyledWrapper>
      <Text
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        marginBottom="24px"
        fontWeight="900"
        fontSize="32px"
      >
        Join Page
      </Text>
      {stake === "0" && (
        <>
          <InputLabel htmlFor="gameContractAddress">
            Paste Game Contract Address
          </InputLabel>
          <Input
            id="gameContractAddress"
            type="text"
            value={joinRPSAddress}
            onChange={handleCreatedGameAddressChange}
          />
        </>
      )}
      {stake === "0" && (
        <Button variant="outlined" onClick={handleGetContractInfo}>
          Join Game
        </Button>
      )}
      {stake !== "0" && (
        <Text color="white">
          Game Stake: <StyledHighlight>{stake} ETH</StyledHighlight>
        </Text>
      )}
      {stake !== "0" && (
        <PickMove onMoveChange={handleMoveChange} selectedMove={selectedMove} />
      )}
      {stake !== "0" && (
        <Button variant="outlined" onClick={handleAcceptGame}>
          Accept Game
        </Button>
      )}
      {stake !== "0" && (
        <Button variant="outlined" onClick={handleDenyGame}>
          Deny Game
        </Button>
      )}
    </StyledWrapper>
  );
}

export default JoinGame;
