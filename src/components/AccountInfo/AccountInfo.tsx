import React, { useEffect, useState } from "react";
import { useMetaMask } from "metamask-react";
import { ethers } from "ethers";
import styled from "styled-components";

export interface IAcountInfoProps {}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 48px;
`;
const StyledInfo = styled.div`
  color: white;
  margin-bottom: 16px;
  font-weight: 400;
  word-break: break-word;
  text-align: center;
`;
export const StyledHighlight = styled.span`
  color: ${({ color = "#8bc8ff" }) => color};
  font-weight: bold;
`;

const StyledWelcomWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const WelcomeText = styled.h1`
  font-size: 36px;
  color: white;
  font-weight: 900;
  text-align: center;
  margin-bottom: 24px;
`;
const StyledConnectButton = styled.button`
  padding: 8px 32px;
  font-size: 24px;
  font-weight: 900;
  color: #ed3498;
  cursor: pointer;
`;
/**
 * Metamask account info
 */
function AccountInfo(props: IAcountInfoProps) {
  const { account, connect, status } = useMetaMask();
  const [balance, setBalance] = useState(0);

  const handleConnectToAccount = async () => {
    try {
      await connect();
    } catch (e) {}
  };

  useEffect(() => {
    (async () => {
      if (account) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });

        console.log(ethers.formatEther(balance));
        setBalance(Number(ethers.formatEther(balance)));
      }
    })();
  }, [account]);

  const isConnected = status === "connected";
  const isLoading = status === "initializing";
  if (isLoading) {
    return <WelcomeText>Loading account info...</WelcomeText>;
  }
  return (
    <StyledWrapper>
      {isConnected && (
        <StyledInfo>
          account address: <StyledHighlight>{account}</StyledHighlight>
        </StyledInfo>
      )}
      <StyledInfo>
        balance: <StyledHighlight color="#34ed91">{balance} ETH</StyledHighlight>
      </StyledInfo>
      {!isConnected && (
        <StyledWelcomWrapper>
          <WelcomeText>
            Welcome to RSP game, please connect to your wallet!
          </WelcomeText>
          <StyledConnectButton onClick={handleConnectToAccount}>
            Connect
          </StyledConnectButton>
        </StyledWelcomWrapper>
      )}
    </StyledWrapper>
  );
}

export default AccountInfo;
