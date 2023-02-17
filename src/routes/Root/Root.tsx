import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useMetaMask } from "metamask-react";

export interface IRootProps {}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background: #000;
`;

const NavItem = styled(NavLink)`
  color: #ff9344;
  cursor: pointer;
  font-size: 36px;
  font-weight: 900;
  margin-bottom: 32px;
  text-decoration: none;

  transition: color 0.15s;
  &:hover {
    color: #ffbb87;
  }
`;

/**
 * Root route
 */
function Root(props: IRootProps) {
  const {} = props;
  const { account } = useMetaMask();
  if (!account) {
    return null;
  }
  return (
    <Wrapper>
      <NavItem to="/start">Start Game</NavItem>
      <NavItem to="/join">Join Game</NavItem>
      <NavItem to="/finish">Finish Game</NavItem>
      <NavItem to="/games">My games</NavItem>
    </Wrapper>
  );
}

export default Root;
