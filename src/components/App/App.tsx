import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import StartGame from "../../routes/StartGame";
import JoinGame from "../../routes/JoinGame";
import FinishGame from "../../routes/FinishGame";
import Root from "../../routes/Root/Root";
import styled from "styled-components";
import AccountInfo from "../AccountInfo";
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { Home } from "@mui/icons-material";
import MyGames from "../../routes/MyGames";
import ProgressLoader from "../LoadingState";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px 64px;
  width: 100%;
  height: auto;
  min-height: 100%;
  background: rgb(4, 4, 4);
`;

const StyledHomeButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
`;
const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  return (
    <Wrapper>
      <ThemeProvider theme={darkTheme}>
        <AccountInfo />
        <ProgressLoader />
        <BrowserRouter>
          <StyledHomeButton to="/" aria-label="navigate home">
            <Button>
              <Home />
            </Button>
          </StyledHomeButton>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/start" element={<StartGame />} />
            <Route path="/join" element={<JoinGame />} />
            <Route path="/finish" element={<FinishGame />} />
            <Route path="/games" element={<MyGames />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Wrapper>
  );
}

export default App;
