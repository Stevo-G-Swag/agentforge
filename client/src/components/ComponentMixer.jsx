import React, { useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls } from 'react-flow-renderer';

const initialElements = [
  { id: '1', type: 'input', data: { label: 'Component A' }, position: { x: 250, y: 5 } },
  // Add more components as needed
];

function ComponentMixer() {
  const [elements, setElements] = useState(initialElements);

  const onConnect = (params) => setElements((els) => addEdge(params, els));

  return (
    <div style={{ height: 500 }}>
      <ReactFlow elements={elements} onConnect={onConnect}>
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default ComponentMixer;