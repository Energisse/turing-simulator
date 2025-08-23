import { Grid } from '@mui/material';
import { useDnD } from './DnDContext.tsx';
import { nodes } from './ui/components/nodes/nodes.ts';

export const Sidebar = () => {
    const [, setType] = useDnD();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <Grid component={"aside"} container spacing={2} p={2} sx={{
            zIndex: 10,
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
        }} >

            {
                Object.entries(nodes).map(([key, NodeComponent]) => (
                    <div className="dndnode" onDragStart={(event) => onDragStart(event, key)} draggable key={key}>
                        <NodeComponent
                            id="preview"
                            type={key}
                            selected={false}
                            zIndex={0}
                            dragging={false}
                            isConnectable={true}
                            xPos={0}
                            yPos={0}
                            data={{
                                inputsValue: [],
                                outputsValue: [],
                            }}
                            isPreview={true}
                        />
                    </div>
                ))
            }
        </Grid>
    );
};

