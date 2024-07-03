import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
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
    // Placeholder logic for generating a color scheme
    return [baseColor, '#000000'];
  };

  const colors = generateColorScheme(baseColor);

  return (
    <GeneratorContainer>
      <SketchPicker
        color={baseColor}
        onChangeComplete={(color) => setBaseColor(color.hex)}
      />
      {colors.map(color => (
        <ColorDisplay key={color} color={color} />
      ))}
    </GeneratorContainer>
  );
}

export default ColorSchemeGenerator;