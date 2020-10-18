import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { MarkerEditableTooltipContainer } from './components/marker-editable-tooltip-container';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

const Container = styled.div`
  height: 100vh;
`;

const App = () => {
  return (
    <Container role="main">
      <GlobalStyle />
      <MarkerEditableTooltipContainer />
    </Container>
  );
};

export default App;
