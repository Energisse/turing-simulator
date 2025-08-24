import { SerializableProperty, SerializableClass } from "./decorators/serializable";

// Represents a connection (edge) between two nodes in a graph structure.
@SerializableClass()
export default class Edge {
    // The ID of the source node.
    @SerializableProperty()
    readonly source: string;
    // The ID of the target node.
    @SerializableProperty()
    readonly target: string;
    // The handle index on the source node.
    @SerializableProperty()
    readonly sourceHandle: number;
    // The handle index on the target node.
    @SerializableProperty()
    readonly targetHandle: number;

    /**
     * Creates a new Edge instance.
     * @param source - The ID of the source node.
     * @param target - The ID of the target node.
     * @param sourceHandle - The handle index on the source node.
     * @param targetHandle - The handle index on the target node.
     */
    constructor(source: string, target: string, sourceHandle: number, targetHandle: number) {
        this.source = source;
        this.target = target;
        this.sourceHandle = sourceHandle;
        this.targetHandle = targetHandle;
    }
}