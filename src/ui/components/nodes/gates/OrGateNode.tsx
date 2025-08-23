import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type OrGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export const OrGateNode = (props: OrGateNodeProps) => (
    <BaseGateNode
        {...props}
        name="OR"
        inputs={2}
        svg={
            <svg width="80" height="60" viewBox="0 0 80 60">
                <path
                    d="M0,0 Q40,30 0,60 Q40,30 80,30 Q40,30 0,0 Z"
                    fill="#2196f3"
                    stroke="#000"
                    strokeWidth="2"
                />
            </svg>
        }
    />
);


export default OrGateNode;