import { Position, type NodeProps, type Node } from "@xyflow/react";
import { CustomHandle } from "../../CustomHandle";
import { Typography } from "@mui/material";
import type { JSX } from "react";

export type BaseGateNodeProps =
    NodeProps<Node<
        {
            inputsValue: boolean[];
            outputsValue: boolean[];
        }
    >> & {
        name: string;
        inputs: number;
        svg: JSX.Element;
        isPreview?: boolean;
    }

export const BaseGateNode = ({ data: { inputsValue, outputsValue }, name, inputs, svg, isPreview }: BaseGateNodeProps) => (
    <div style={{ width: 80, height: 60, position: "relative" }}>
        <CustomHandle type="source" position={Position.Right} style={{
            backgroundColor: outputsValue?.[0] ? "green" : "red"
        }} id="source#0" isPreview={isPreview}
        />
        {
            Array.from({ length: inputs }).map((_, i) => (
                <CustomHandle key={i} type="target" position={Position.Left}
                    style={{
                        top: `${((i + 1) / (inputs + 1)) * 100}%`,
                        left: "0%",
                        transform: "translate(-100%, -50%)",
                        background: inputsValue?.[i] ? "green" : "red"
                    }}
                    id={`target#${i + 0}`} isPreview={isPreview}
                />
            ))
        }

        {svg}
        <Typography sx={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)", color: "#fff",
            pointerEvents: "none"
        }}>
            {name}
        </Typography>

    </div>
);

export default BaseGateNode;