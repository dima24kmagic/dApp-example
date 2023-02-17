import React from "react";
import useStartGame from "./hooks/useStartGame";
import RPSMoves from "../../components/RPSMoves/PickMove";
import { Button, Input, InputLabel, Typography } from "@mui/material";
import styled from "styled-components";
import PickMove from "../../components/RPSMoves/PickMove";
import { StyledHighlight } from "../../components/AccountInfo/AccountInfo";
import {Text} from "../../components/LoadingState/ProgressLoader";

export interface IStartGameProps {}

const StyledGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-width: 100%;
  margin: 0 auto;
`;

const StyledInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;
/**
 * Start game screen
 */
function StartGame(props: IStartGameProps) {
  const {
    selectedMove,
    rpsCreatedContractAddress,
    stake,
    secondPartyAddress,
    handleStakeChange,
    handleMoveChange,
    handleSecondPlayerAddressChange,
    handleStartGame,
  } = useStartGame();

  const startDisabled =
    !stake || stake === "0" || isNaN(Number(stake)) || !secondPartyAddress;
  return (
    <StyledGameContainer>
      <Typography
        color="rgba(255,255,255,0.9)"
        textAlign="center"
        marginBottom="24px"
        fontWeight="900"
        fontSize="32px"
      >
        Start Page
      </Typography>
      <StyledInputWrapper>
        <InputLabel color="success" htmlFor="stake">
          Set Stake
        </InputLabel>
        <Input
          id="stake"
          type="number"
          value={stake}
          color="info"
          onChange={handleStakeChange}
        />
      </StyledInputWrapper>
      <StyledInputWrapper>
        <InputLabel color="info" htmlFor="secondPlayer">
          Set Second Player Address
        </InputLabel>
        <Input
          id="secondPlayer"
          type="text"
          value={secondPartyAddress}
          onChange={handleSecondPlayerAddressChange}
        />
      </StyledInputWrapper>

      <StyledInputWrapper>
        <PickMove onMoveChange={handleMoveChange} selectedMove={selectedMove} />
      </StyledInputWrapper>
      {rpsCreatedContractAddress && (
        <Text color="white">
          Created Game Contract:{" "}
          <StyledHighlight color="magenta">{rpsCreatedContractAddress}</StyledHighlight>
        </Text>
      )}
      <Button
        disabled={startDisabled}
        variant="outlined"
        onClick={handleStartGame}
      >
        {rpsCreatedContractAddress ? "Start New Game" : "Start Game"}
      </Button>
    </StyledGameContainer>
  );
}

export default StartGame;
