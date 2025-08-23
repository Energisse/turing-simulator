import ReactFlow, { Background, useReactFlow } from 'reactflow';
import './App.css'
import { useCallback } from 'react';
import { Box } from '@mui/material';
import { Sidebar } from './sidebar';
import { useDnD } from './DnDContext';
import { nodes as customNodeTypes } from './ui/components/nodes/nodes';
import { useSimulatorContext } from './simulatorContext';


function App() {
  const { nodes, edges, addEdge, addNode, onEdgesChange, onNodesChange } = useSimulatorContext();

  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [addNode, screenToFlowPosition, type],
  );

  return (
    <Box
      width={'100%'}
      height={'100%'}
    >
      <Box sx={{
        zIndex: 99,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
      >
        <Sidebar />
      </Box>

      <ReactFlow
        nodeTypes={customNodeTypes}
        nodes={nodes}
        edges={edges}
        onConnect={addEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        className="touch-flow"
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitView
      >
        <Background gap={20} />
      </ReactFlow>
    </Box>

  );
}

export default App
