import React, { useState } from 'react';
import styled from 'styled-components';

const GeneratorContainer = styled.div`
  padding: 20px;
`;

const ColorDisplay = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => props.color};
  border: 1px solid #000;
  margin: 10px;
`;

function ColorSchemeGenerator() {
  const [baseColor, setBaseColor] = useState('#ffffff');

  const generateColorScheme = (baseColor) => {
    // This is a placeholder for actual color scheme generation logic
    return [baseColor, '#000000'];
  };

  const colors = generateColorScheme(baseColor);

  return (
    <GeneratorContainer>
      <input
        type="color"
        value={baseColor}
        onChange={(e) => setBaseColor(e.target.value)}
      />
      {colors.map(color => (
        <ColorDisplay key={color} color={color} />
      ))}
    </GeneratorContainer>
  );
}

export default ColorSchemeGenerator;