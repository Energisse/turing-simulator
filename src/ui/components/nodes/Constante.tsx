import { Position } from "reactflow";
import { CustomHandle } from "../CustomHandle";
import { useState } from "react";

export default function ButtonNode() {

    const [active, setActive] = useState(false);

    const handleClick = () => {
        setActive(!active);
    };

    return (
        <div style={{ width: 60, height: 60, position: "relative" }}>
            <CustomHandle type="source" position={Position.Right} id="source#0" />
            <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="15" fill="#f44336" stroke="#000" strokeWidth="2" />
                <circle cx="30" cy="30" r="10" fill={active ? "#4caf50" : "#f44336"} stroke="#000" strokeWidth="2" onClick={handleClick} />
            </svg>
            <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)", color: "#fff", fontWeight: "bold",
                pointerEvents: "none"
            }}></div>
        </div>
    );
}