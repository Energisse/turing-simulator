import { useEffect, useState, useMemo, useRef } from "react";
import { getSmoothStepPath } from "reactflow";
import { type EdgeProps, type Edge } from "@xyflow/react";

// Custom edge component for React Flow with animated arrows
export const CurrentEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    data: {
        value,
        selected
    } = { value: false, selected: false },
}: EdgeProps<Edge<{
    value: boolean;
    selected: boolean;
}>>) => {
    const pathRef = useRef<SVGPathElement>(null);
    const [distance, setDistance] = useState(0);

    // Memoize the edge path to avoid unnecessary recalculations
    const [edgePath] = useMemo(
        () =>
            getSmoothStepPath({
                sourceX,
                sourceY,
                sourcePosition,
                targetX,
                targetY,
                targetPosition,
            }),
        [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition]
    );

    // Update the path length whenever the path changes
    useEffect(() => {
        if (pathRef.current) {
            setDistance(pathRef.current.getTotalLength());
        }
    }, [edgePath]);

    const speed = 25; // Arrow speed in pixels per second
    const duration = distance / speed; // Animation duration

    const spacing = 1; // Time between arrows in seconds
    const numArrows = Math.ceil(duration / spacing) || 1; // Number of arrows to display
    const realSpacing = distance / numArrows; // Actual spacing between arrows

    return (
        <g className="animated-v-edge" style={style}>
            {/* Main edge path */}
            <path
                id={id}
                d={edgePath}
                fill="transparent"
                stroke={selected ? "#1976d2" : "yellow"}
                strokeWidth={6}
                ref={pathRef}
            />

            {/* Animated arrows moving along the edge path */}
            {value && distance > 0 &&
                Array.from({ length: numArrows }).map((_, i) => (
                    <polygon
                        key={i}
                        points="2,2 -4,2 -2,0 -4,-2 2,-2 4,0"
                        fill={"green"}
                        stroke="none"
                    >
                        <animateMotion
                            dur={`${duration}s`}
                            repeatCount="indefinite"
                            begin={`${-(i * realSpacing) / speed}s`} // Stagger the start time for each arrow
                            rotate="auto"
                        >
                            <mpath href={`#${id}`} />
                        </animateMotion>
                    </polygon>
                ))}
        </g>
    );
};

export default CurrentEdge;
