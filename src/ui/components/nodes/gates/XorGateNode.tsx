import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type XorGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export const XorGateNode = (props: XorGateNodeProps) => (
    <BaseGateNode
        {...props}
        name="XOR"
        inputs={2}
        svg={
            <svg width="80" height="60" viewBox="0 0 80 60">
                <path
                    d="M5,0 Q40,30 5,60 Q40,30 80,30 Q40,30 5,0 Z"
                    fill="#ff9800"
                    stroke="#000"
                    strokeWidth="2"
                />
                <path
                    d="M0,0 Q35,30 0,60"
                    fill="none"
                    stroke="#000"
                    strokeWidth="2"
                />
            </svg>
        }
    />
);

export default XorGateNode;