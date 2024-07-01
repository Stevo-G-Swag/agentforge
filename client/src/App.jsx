import React from 'react';
import ComponentBrowser from './components/ComponentBrowser';
import ColorSchemeGenerator from './components/ColorSchemeGenerator';
import WysiwygEditor from './components/WysiwygEditor';
import ComponentMixer from './components/ComponentMixer';

function App() {
  return (
    <div>
      <ComponentBrowser />
      <ColorSchemeGenerator />
      <WysiwygEditor />
      <ComponentMixer />
    </div>
  );
}

export default App;