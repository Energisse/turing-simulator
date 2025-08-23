import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type AndGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export const AndGateNode = (props: AndGateNodeProps) => {
    return (
        <BaseGateNode
            {...props}
            name="AND"
            inputs={2}
            svg={
                <svg width="80" height="60" viewBox="0 0 80 60">
                    <path
                        d="M0,0 L40,0 Q80,30 40,60 L0,60 Z"
                        fill="#4caf50"
                        stroke="#000"
                        strokeWidth="2"
                    />
                </svg>
            }
        />
    )
}

export default AndGateNode;