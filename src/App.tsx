import ReactFlow, { Background, useReactFlow } from 'reactflow';
import './App.css'
import { useCallback, useMemo, useRef, useState } from 'react';
import { Box, Fab } from '@mui/material';
import { Sidebar } from './sidebar';
import { useDnD } from './DnDContext';
import { nodes as customNodeTypes } from './ui/components/nodes/nodes';
import { useSimulatorContext } from './simulatorContext';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function App() {
  const { nodes, edges, addEdge, addNode, onEdgesChange, onNodesChange, reset, deleteNode } = useSimulatorContext();
  const deleteFabRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const dragTimer = useRef<number | null>(null);
  const [isActuallyDragging, setIsActuallyDragging] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

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
  const onNodeDragStop = useCallback(
    (event: React.MouseEvent | React.TouchEvent, node: any) => {
      setIsActuallyDragging(false);

      // Clear the timer if it exists
      if (dragTimer.current) {
        clearTimeout(dragTimer.current);
        dragTimer.current = null;
      }

      const fabRect = deleteFabRef.current?.getBoundingClientRect();
      if (!fabRect) return;

      let clientX: number, clientY: number;
      if ('touches' in event && event.changedTouches.length > 0) {
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
      } else if ('clientX' in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      } else {
        return;
      }

      if (
        clientX >= fabRect.left &&
        clientX <= fabRect.right &&
        clientY >= fabRect.top &&
        clientY <= fabRect.bottom
      ) {
        deleteNode(node.id);
      }
    },
    [deleteNode]
  );

  const onNodeDragStart = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    // Store initial position
    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    dragStartPos.current = { x: clientX, y: clientY };

    // Set a timer to show FAB only after a short delay
    dragTimer.current = window.setTimeout(() => {
      setIsActuallyDragging(true);
    }, 200); // 200ms delay
  }, []);

  const onNodeDrag = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!dragStartPos.current) return;

    let clientX: number, clientY: number;
    if ('touches' in event && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ('clientX' in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      return;
    }

    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(clientX - dragStartPos.current.x, 2) +
      Math.pow(clientY - dragStartPos.current.y, 2)
    );

    // If moved more than 10px, consider it a real drag
    if (distance > 10) {
      setIsActuallyDragging(true);
    }
  }, []);

  // Edge selection handler
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: any) => {
    event.stopPropagation();
    setSelectedEdge(selectedEdge === edge.id ? null : edge.id);
  }, [selectedEdge]);

  // Delete selected edge
  const deleteSelectedEdge = useCallback(() => {
    if (selectedEdge) {
      onEdgesChange([{ type: 'remove', id: selectedEdge }]);
      setSelectedEdge(null);
    }
  }, [selectedEdge, onEdgesChange]);

  // Clear selection when clicking on canvas
  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
  }, []);

  // Enhanced edges with selection styling
  const enhancedEdges = useMemo(() => {
    return edges.map(edge => ({
      ...edge,
      selected: edge.id === selectedEdge,
      style: {
        stroke: edge.id === selectedEdge ? '#1976d2' : '#b1b1b7', // blue for selected
        strokeWidth: edge.id === selectedEdge ? 3 : 2,
      },
    }));
  }, [edges, selectedEdge]);

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
        edges={enhancedEdges}
        onConnect={addEdge}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeDragStop={onNodeDragStop}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        defaultEdgeOptions={{ type: 'smoothstep' }}
        className="touch-flow"
        snapToGrid={true}
        snapGrid={[20, 20]}
        fitView
      >
        <Background gap={20} />
      </ReactFlow>
      <Fab color="error" size='small' aria-label="reset" onClick={reset} sx={{ position: 'absolute', bottom: 16, right: 16 }}>
        <DeleteIcon />
      </Fab>

      {/* Delete FAB that appears during actual drag or when edge is selected */}
      {(isActuallyDragging || selectedEdge) && (
        <Box
          ref={deleteFabRef}
          sx={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%)',
            pointerEvents: 'auto',
            zIndex: 999,
            touchAction: 'none',
          }}
        >
          <Fab
            color="error"
            size="large"
            className="delete-fab"
            onClick={selectedEdge ? deleteSelectedEdge : undefined}
            sx={{
              transition: 'transform 0.2s, background 0.2s, color 0.2s',
              '&:hover': {
                transform: 'scale(1.2)',
              },
            }}
          >
            <DeleteOutlineIcon />
          </Fab>
        </Box>

      )}
    </Box>

  );
}

export default App
