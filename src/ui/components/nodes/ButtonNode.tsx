import { Position } from "reactflow";
import { CustomHandle } from "../CustomHandle";
import { useSimulatorContext } from "../../../simulatorContext";
import type { BaseGateNodeProps } from "./gates/BaseGateNode";

export type ButtonNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export default function ButtonNode({ id, data: { outputsValue }, isPreview }: ButtonNodeProps) {

    const { setValue } = useSimulatorContext();

    const handleClick = () => {
        setValue(id, !outputsValue[0]);
    };

    return (
        <div style={{ width: 60, height: 60, position: "relative" }}>
            <CustomHandle type="source" position={Position.Right} id="source#0" isPreview={isPreview} style={{
                backgroundColor: outputsValue[0] ? "green" : "red"
            }} />

            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="15" fill="#f44336" stroke="#000" strokeWidth="2" />
                <circle cx="30" cy="30" r="10" fill={outputsValue[0] ? "green" : "red"} stroke="#000" strokeWidth="2" onClick={handleClick} />
            </svg>
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", color: "#fff", fontWeight: "bold",
                pointerEvents: "none"
            }}></div>
        </div>
    );
}