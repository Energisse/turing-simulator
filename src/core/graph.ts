import type BaseElementInterface from "./baseElementInterface";
import BaseGate from "./gates/baseGate";
import BaseInput from "./inputs/baseInput";

/** Represents a connection between two nodes, including which output/input handles it connects */
export type Edge = {
    source: string,
    target: string;
    sourceHandle: number;
    targetHandle: number
};

/**
 * Generic Graph class to manage nodes (elements) and edges (connections)
 * Supports simulation starting from output nodes and recursively computing dependencies.
 */
export default class Graph<T extends BaseElementInterface> {
    // Map of nodes by their unique ID
    private nodes: Map<string, T> = new Map();

    // List of edges connecting nodes
    private edges: Array<Edge> = [];

    /** Add a new node to the graph */
    addNode(node: T) {
        this.nodes.set(node.getId(), node);
    }

    /** Add an edge between nodes, avoiding duplicates */
    addEdge(source: string, target: string, sourceHandle: number, targetHandle: number) {
        if (this.edges.some(edge =>
            edge.source === source &&
            edge.target === target &&
            edge.sourceHandle === sourceHandle &&
            edge.targetHandle === targetHandle
        )) {
            return;
        }
        this.edges.push({ source, target, sourceHandle, targetHandle });
    }

    /** Remove a node and all connected edges */
    deleteNode(id: string) {
        this.nodes.delete(id);
        this.edges = this.edges.filter(edge => edge.source !== id && edge.target !== id);
    }

    /** Remove a specific edge */
    deleteEdge(source: string, target: string, sourceHandle: number, targetHandle: number) {
        this.edges = this.edges.filter(edge => {
            return edge.target !== target ||
                edge.sourceHandle !== sourceHandle ||
                edge.targetHandle !== targetHandle ||
                edge.source !== source;
        });
    }

    /** Get a node by its ID */
    getNode(id: string) {
        return this.nodes.get(id);
    }

    /** Return all nodes as an array */
    getNodes() {
        return Array.from(this.nodes.values());
    }

    /** Return outgoing edges for a given node (neighbors) */
    getNeighbors(id: string) {
        return this.edges.filter(edge => edge.source === id);
    }

    /** Return all edges in the graph */
    getEdges(): Edge[] {
        return this.edges;
    }

    /**
     * Run the simulation starting from output nodes (nodes without outgoing edges)
     * Resets all gates and evaluates nodes recursively from outputs backwards.
     */
    simulate() {
        // Reset all gates before simulation
        this.nodes.forEach((node) => {
            if (node.is(BaseGate)) {
                node.reset();
            }
        });

        // Find all output nodes (no outgoing edges)
        const outputNodes = this.getNodes().filter(node => {
            return this.getNeighbors(node.getId()).length === 0;
        });

        // Evaluate each output node recursively
        for (const node of outputNodes) {
            this.evaluateNode(node);
        }
    }

    /**
     * Recursively evaluate a node and all its dependencies.
     * - Inputs are already set and do not need computation
     * - Gates compute their outputs once all inputs are ready
     */
    evaluateNode(node: BaseElementInterface) {
        if (node.is(BaseInput)) {
            // Input nodes already have values; nothing to do
            return;
        }

        if (node.is(BaseGate)) {
            // Ensure all input nodes are evaluated before computing this gate
            const incomingEdges = this.getIncomingEdges(node.getId());
            for (const edge of incomingEdges) {
                const sourceNode = this.getNode(edge.source);
                if (sourceNode) {
                    this.evaluateNode(sourceNode); // recursive call
                    // Pass the output value of the source node as input to this node
                    const value = sourceNode.getOutputs()[edge.sourceHandle];
                    node.setInput(edge.targetHandle, value);
                }
            }
            node.compute(); // compute gate output
        }
    }

    /** Return all edges that point to the given node (incoming edges) */
    getIncomingEdges(nodeId: string) {
        return this.edges.filter(e => e.target === nodeId);
    }
}
