import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type NorGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

const NorGateNode = (props: NorGateNodeProps) => (
    <BaseGateNode
        {...props}
        name="NOR"
        inputs={2}
        svg={<svg width="80" height="60" viewBox="0 0 80 60">
            <path
                d="M0,0 Q40,30 0,60 Q40,30 80,30 Q40,30 0,0 Z"
                fill="#795548"
                stroke="#000"
                strokeWidth="2"
            />
            <circle cx="75" cy="30" r="5" fill="#795548" stroke="#000" strokeWidth="2" />
        </svg>}
    />
);

export default NorGateNode;
