import { Grid } from '@mui/material';
import { useDnD } from './DnDContext.tsx';
import { nodes } from './ui/components/nodes/nodes.ts';

export const Sidebar = () => {
    const [, setType] = useDnD();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    // Enhanced touch support
    const onTouchStart = (event: React.TouchEvent<HTMLDivElement>, nodeType: string) => {
        setType(nodeType);
        // Add visual feedback for touch
        event.currentTarget.style.transform = 'scale(1.05)';
        event.currentTarget.style.opacity = '0.8';
    };

    const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        // Reset visual feedback
        event.currentTarget.style.transform = 'scale(1)';
        event.currentTarget.style.opacity = '1';
    };

    return (
        <Grid component={"aside"} container spacing={{
            xs: 0,
            sm: 1,
        }} p={{
            xs: 0.5,
            sm: 1,
        }} sx={{
            zIndex: 10,
            pointerEvents: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(5px)',
        }} >

            {
                Object.entries(nodes).map(([key, NodeComponent]) => (
                    <Grid
                        container
                        justifyContent={"center"}
                        alignItems={"center"}
                        className="dndnode"
                        onDragStart={(event) => onDragStart(event, key)}
                        onTouchStart={(event) => onTouchStart(event, key)}
                        onTouchEnd={onTouchEnd}
                        draggable
                        key={key}
                        sx={{
                            touchAction: 'none',
                            transition: 'transform 0.2s ease, opacity 0.2s ease',
                            cursor: 'grab',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            msUserSelect: 'none',
                            minHeight: '60px',
                            minWidth: '80px',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            background: 'white',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            margin: '4px',
                            position: 'relative',
                            '&:hover': {
                                borderColor: '#007bff',
                                boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            },
                            '  > *': {
                                transform: 'scale(0.8)',
                            }
                        }}
                    >
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
                    </Grid>
                ))
            }
        </Grid >
    );
};
