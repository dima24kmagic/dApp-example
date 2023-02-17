import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { StyledHighlight } from "../../components/AccountInfo/AccountInfo";
import styled from "styled-components";
import { IMoveKey } from "../../components/RPSMoves/PickMove";
import { getRPSContractInstance } from "../../services/contract_rps";
import { useMetaMask } from "metamask-react";
import { Text } from "../../components/LoadingState/ProgressLoader";

export interface IGameProps {
  contractKey: string;
  move: IMoveKey;
  creatorAccount: string;
  onContractStatusCheck: (contractAddress: string) => void;
}

const StyledGameWrapper = styled.div`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 8px;
`;

/**
 * Created Game Info
 */
function Game(props: IGameProps) {
  const { account } = useMetaMask();
  const { contractKey, move, creatorAccount, onContractStatusCheck } = props;
  const [secondPlayerMove, setSecondPlayerMove] = useState("0");

  useEffect(() => {
    (async () => {
      try {
        const rpsContractInstance = await getRPSContractInstance({
          deployedRPSContractAddress: contractKey,
        });
        const secondPlayerMove = await rpsContractInstance.methods.c2().call();
        setSecondPlayerMove(secondPlayerMove);
      } catch (e) {
        console.log(e);
      }
    })();

    return () => {};
  }, [contractKey]);

  const isOwner = account === creatorAccount.toLowerCase();
  return (
    <StyledGameWrapper key={contractKey}>
      <Text color="white">
        Contract: <StyledHighlight>{contractKey}</StyledHighlight>
      </Text>
      <Text color="white">
        Selected move: <StyledHighlight>{move}</StyledHighlight>
      </Text>
      <Text color="white">
        Creator address: <StyledHighlight>{creatorAccount}</StyledHighlight>
      </Text>
      {isOwner && (
        <Text color="white">
          Did second player played:{" "}
          <StyledHighlight>
            {secondPlayerMove !== "0" ? "Yes" : "No"}
          </StyledHighlight>
        </Text>
      )}
      <Button
        variant="outlined"
        onClick={() => onContractStatusCheck(contractKey)}
      >
        Check status
      </Button>
    </StyledGameWrapper>
  );
}

export default Game;
