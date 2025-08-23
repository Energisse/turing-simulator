import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type NandGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export const NandGateNode = (props: NandGateNodeProps) => {
    return (
        <BaseGateNode
            {...props}
            name="NAND"
            inputs={2}
            svg={
                <svg width="80" height="60" viewBox="0 0 80 60">
                    <path
                        d="M0,0 L40,0 Q80,30 40,60 L0,60 Z"
                        fill="#9c27b0"
                        stroke="#000"
                        strokeWidth="2"
                    />
                    <circle cx="75" cy="30" r="5" fill="#9c27b0" stroke="#000" strokeWidth="2" />
                </svg>
            }
        />
    );
}
export default NandGateNode;
