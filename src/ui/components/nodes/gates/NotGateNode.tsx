import BaseGateNode, { type BaseGateNodeProps } from "./BaseGateNode";

export type NotGateNodeProps = Omit<BaseGateNodeProps, "name" | "inputs" | "svg">

export const NotGateNode = (props: NotGateNodeProps) => (
    <BaseGateNode
        {...props}
        name="NOT"
        inputs={1}
        svg={
            <svg width="60" height="60" viewBox="0 0 60 60">
                <polygon points="5,5 45,30 5,55" fill="#f44336" stroke="#000" strokeWidth="2" />
                <circle cx="50" cy="30" r="5" fill="#f44336" stroke="#000" strokeWidth="2" />
            </svg>
        }
    />
);

export default NotGateNode;