import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@xyflow/react/dist/style.css';
import App from './App.tsx'
import { DnDProvider } from './DnDContext.tsx';
import { ReactFlowProvider } from 'reactflow';
import { SimulatorProvider } from './simulatorContext.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactFlowProvider>
      <DnDProvider>
        <SimulatorProvider>
          <App />
        </SimulatorProvider>
      </DnDProvider>
    </ReactFlowProvider>
  </StrictMode>,
)
