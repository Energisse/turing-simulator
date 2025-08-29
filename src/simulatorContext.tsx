import React, { createContext, useContext, useRef, useEffect } from "react";
import {
    useNodesState,
    useEdgesState,
    type Connection,
    type NodeChange,
    type EdgeChange,
    type Node,
    type Edge,
} from "@xyflow/react";
import equal from "fast-deep-equal";

import Graph from "./core/graph";
import NandGate from "./core/gates/nandGate";
import NotGate from "./core/gates/notGate";
import OrGate from "./core/gates/orGate";
import NorGate from "./core/gates/norGate";
import XorGate from "./core/gates/xorGate";
import AndGate from "./core/gates/andGate";
import Button from "./core/inputs/button";
import { deserialize, serialize } from "./core/decorators/serializable";
import type BaseElement from "./core/baseElement";
import { Mixin, type PositionableInterface } from "./core/positionable";
import BaseInput from "./core/inputs/baseInput";

// -------------------------------
// Type Definitions
// -------------------------------
type SimulatorContextType = {
    nodes: Node[];
    edges: Edge[];
    addNode: (type: string, position: { x: number; y: number }) => void;
    addEdge: (connection: Connection) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    simulate: () => void;
    setValue: (id: string, value: boolean) => void;
    reset: () => void;
    deleteNode: (id: string) => void;
};

// -------------------------------
// Context
// -------------------------------
const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

// -------------------------------
// Map of gate types to classes
// -------------------------------
const gatesMap: Record<string, new (id: string) => BaseElement> = {
    NAND: NandGate,
    NOT: NotGate,
    BUTTON: Button,
    OR: OrGate,
    NOR: NorGate,
    XOR: XorGate,
    AND: AndGate,
};

// -------------------------------
// Provider Component
// -------------------------------
export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // React Flow nodes and edges state
    const [nodes, setNodes, _onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, _onEdgesChange] = useEdgesState<Edge>([]);

    // Graph instance stored in a ref (persistent across renders)
    const graphRef = useRef<Graph<BaseElement & PositionableInterface>>(
        deserialize(Graph<BaseElement & PositionableInterface>, JSON.parse(localStorage.getItem("myGraph") || "null")) || new Graph<BaseElement & PositionableInterface>()
    );

    useEffect(() => {
        update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // -------------------------------
    // Core simulation logic
    // -------------------------------
    const simulate = () => {
        graphRef.current.simulate();
    };

    // -------------------------------
    // Add a node to the graph
    // -------------------------------
    const addNode = (type: string, position: { x: number; y: number }) => {
        const GateClass = Mixin.Positionable(gatesMap[type]);
        if (!GateClass) return;

        const gate = new GateClass(position.x, position.y, Date.now().toString());

        graphRef.current.addNode(gate);
        update();
    };

    // -------------------------------
    // Add an edge to the graph
    // -------------------------------
    const addEdge = (connection: Connection) => {
        if (!connection.source || !connection.target || !connection.sourceHandle || !connection.targetHandle) return;

        graphRef.current.addEdge(
            connection.source,
            connection.target,
            +connection.sourceHandle.split("#")[1],
            +connection.targetHandle.split("#")[1]
        );

        update();
    };

    // -------------------------------
    // Set input value (for buttons, etc.)
    // -------------------------------
    const setValue = (id: string, value: boolean) => {
        const node = graphRef.current.getNode(id);
        if (node instanceof BaseInput) {
            node.setValue(value);
        }
        update();
    };

    // -------------------------------
    // Update node position
    // -------------------------------
    const setNodePosition = (id: string, position: { x: number; y: number }) => {
        const node = graphRef.current.getNode(id);
        if (node) {
            node.setPosition(position.x, position.y);
        }
        // We skip calling update to avoid unnecessary simulation on drag
    };

    // -------------------------------
    // Update React Flow nodes and edges from Graph
    // -------------------------------
    function update() {
        simulate();

        // Update edges
        setEdges((prevEdges) => {
            const newEdges = graphRef.current.getEdges().map((edge) => {
                const edgeId = `${edge.source}-${edge.target}-${edge.sourceHandle}-${edge.targetHandle}`;
                const newEdge: Edge = {
                    id: edgeId,
                    type: "current",
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: `source#${edge.sourceHandle}`,
                    targetHandle: `target#${edge.targetHandle}`,
                    data: { value: edge.getValue() },
                };
                const prevEdge = prevEdges.find((e) => e.id === edgeId);
                return equal(prevEdge, newEdge) ? prevEdge! : newEdge;
            });
            return newEdges;
        });

        // Update nodes
        setNodes((prevNodes) => {
            const newNodes = graphRef.current.getNodes().map((node) => {
                const nodeId = node.getId();
                const prevNode = prevNodes.find((n) => n.id === nodeId);

                const newNode: Node = {
                    ...prevNode,
                    id: nodeId,
                    type: node.getType(),
                    position: node.getPosition(),
                    data: {
                        ...prevNode?.data,
                        outputsValue: node.getOutputs(),
                        inputsValue: node.getInputs(),
                    },
                };
                return equal(prevNode, newNode) ? prevNode! : newNode;
            });
            return newNodes;
        });
    }

    // Persist graph to localStorage
    useEffect(() => {
        localStorage.setItem("myGraph", JSON.stringify(serialize(graphRef.current)));
    }, [edges, nodes]);

    // -------------------------------
    // Node change handler
    // -------------------------------
    const onNodesChange = (changes: NodeChange[]) => {
        changes.forEach((change) => {
            switch (change.type) {
                case "position":
                    if (change.position) setNodePosition(change.id, change.position);
                    break;
                case "remove":
                    graphRef.current.deleteNode(change.id);
                    update();
                    break;
            }
        });
        _onNodesChange(changes);
    };

    // -------------------------------
    // Edge change handler
    // -------------------------------
    const onEdgesChange = (changes: EdgeChange[]) => {
        changes.forEach((change) => {
            if (change.type === "remove") {
                const [source, target, sourceHandle, targetHandle] = change.id.split("-");
                graphRef.current.deleteEdge(source, target, +sourceHandle, +targetHandle);
                update();
            }
        });
        _onEdgesChange(changes);
    };

    // -------------------------------
    // Reset graph
    // -------------------------------
    const reset = () => {
        graphRef.current = new Graph();
        update();
    };

    // -------------------------------
    // Delete a node
    // -------------------------------
    const deleteNode = (id: string) => {
        graphRef.current.deleteNode(id);
        update();
    };

    // -------------------------------
    // Provide context
    // -------------------------------
    return (
        <SimulatorContext.Provider
            value={{
                nodes,
                edges,
                simulate,
                onNodesChange,
                onEdgesChange,
                addNode,
                addEdge,
                setValue,
                reset,
                deleteNode,
            }}
        >
            {children}
        </SimulatorContext.Provider>
    );
};

// -------------------------------
// Custom hook to use the simulator context
// -------------------------------
// eslint-disable-next-line react-refresh/only-export-components
export const useSimulatorContext = () => {
    const context = useContext(SimulatorContext);
    if (!context) throw new Error("useSimulatorContext must be used within SimulatorProvider");
    return context;
};
