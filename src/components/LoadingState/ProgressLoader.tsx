import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { CircularProgress, Typography } from "@mui/material";

export interface ILoadingStateProps {}

const StyledWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 999;
  padding: 32px 64px;
  backdrop-filter: blur(5px);
`;

export const Text = styled(Typography)`
  word-break: break-word;
`;

/**
 * Loading screen
 */
function ProgressLoader(props: ILoadingStateProps) {
  const { loadingMessage, isMiningTransaction } = useSelector(
    (state: RootState) => state.transactionsLoading
  );

  if (!isMiningTransaction) {
    return <></>;
  }
  return (
    <StyledWrapper>
      {loadingMessage.txHash && (
        <Text
          textAlign="center"
          color="white"
          marginBottom="8px"
          fontWeight="100"
        >
          txHash: {loadingMessage.txHash}
        </Text>
      )}
      <Text
        color="white"
        marginBottom="8px"
        fontSize="32px"
        fontWeight="900"
        textAlign="center"
      >
        {loadingMessage.message}
      </Text>
      <CircularProgress />
    </StyledWrapper>
  );
}

export default ProgressLoader;
