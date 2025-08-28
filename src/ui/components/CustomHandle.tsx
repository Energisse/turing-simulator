import { Handle } from "@xyflow/react";

export type CustomHandleProps = React.ComponentProps<typeof Handle> & {
    isPreview?: boolean;
};

export const CustomHandle = (props: CustomHandleProps) => {
    if (props.isPreview) {
        // juste un rond visuel
        return (
            <div
                style={{
                    width: 10,
                    height: 10,
                    background: "#555",
                    borderRadius: "50%",
                    position: "absolute",
                    ...(props.position === "right" ? { right: 0, top: "50%" } : { left: 0, top: "50%" }),
                    transform: props.position === "right" ? "translate( 50%, -50%)" : "translate(-50%, -50%)",
                    ...props.style,
                }}
            />
        );
    }

    return (
        <Handle
            {...props}
            style={{
                width: 10,
                height: 10,
                background: "#555",
                ...props.style,
            }}
        />
    );
};
