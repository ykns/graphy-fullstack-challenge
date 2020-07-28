import React, {useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Coords = styled.div`
  color: #aaa;
`;

const App = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (ev: React.MouseEvent) => {
    const { pageX: x, pageY: y } = ev;
    setCoords({ x, y });
  };

  return (
    <Container onMouseMove={handleMouseMove}>
      <p>Hello world!</p>
      <Coords>{coords.x}x{coords.y}</Coords>
    </Container>
  );
};

export default App;
