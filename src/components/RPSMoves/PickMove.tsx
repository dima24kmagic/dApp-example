import React from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { Text } from "../LoadingState/ProgressLoader";

export const MOVES = {
  Null: 0,
  Rock: 1,
  Paper: 2,
  Scissors: 3,
  Spock: 4,
  Lizard: 5,
};

export type IMoveKey = keyof typeof MOVES;
export type IMove = (typeof MOVES)[IMoveKey];

export interface IRpsMovesProps {
  onMoveChange: (move: IMove) => void;
  selectedMove: IMove;
}

const StyledWrapper = styled.div``;

const WeaponButton = styled(Button)`
  text-decoration: ${({ isSelected }: { isSelected: boolean }) =>
    isSelected ? "underline" : "none"} !important;
  margin-bottom: 8px !important;
  &:not(:last-child) {
    margin-right: 8px;
  }
`;

/**
 * Component to choose RPS move
 */
function PickMove(props: IRpsMovesProps) {
  const { onMoveChange, selectedMove } = props;

  const handleMoveChange = (move: IMove) => () => {
    onMoveChange(move);
  };

  return (
    <StyledWrapper>
      <Text color="white" marginBottom="8px">
        Select Weapon:
      </Text>
      {Object.keys(MOVES).map((key: string) => {
        // @ts-ignore
        const move = MOVES[key];
        if (move === MOVES.Null) {
          return null;
        }
        return (
          <WeaponButton
            key={move}
            onClick={handleMoveChange(move)}
            variant="outlined"
            isSelected={move === selectedMove}
          >
            {key}
          </WeaponButton>
        );
      })}
    </StyledWrapper>
  );
}

export default PickMove;
