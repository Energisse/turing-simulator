import React, { createContext, useContext, useRef, useEffect } from "react";
import { useNodesState, useEdgesState, type Connection, type NodeChange, type EdgeChange, type Node, type Edge } from "@xyflow/react";
import NandGate from "./core/gates/nandGate";
import BaseGate from "./core/gates/baseGate";
import Graph from "./core/graph";
import { PositionnedGate } from "./core/gates/positionnedGate";
import NotGate from "./core/gates/notGate";
import Button from "./core/inputs/button";
import type BaseElement from "./core/baseElement";
import type Positionned from "./core/positionned";
import PositionnedInput from "./core/inputs/posionnedInput";
import BaseInput from "./core/inputs/baseInput";
import OrGate from "./core/gates/orGate";
import NorGate from "./core/gates/norGate";
import XorGate from "./core/gates/xorGate";
import AndGate from "./core/gates/andGate";
import { deserialize, serialize } from "./core/decorators/serializable";

type SimulatorContextType = {
    nodes: ReturnType<typeof useNodesState>[0];
    edges: ReturnType<typeof useEdgesState>[0];
    addNode: (type: string, position: { x: number; y: number }) => void;
    addEdge: (connection: Connection) => void;
    onNodesChange: ReturnType<typeof useNodesState>[2];
    onEdgesChange: ReturnType<typeof useEdgesState>[2];
    simulate: () => void;
    setValue: (id: string, value: boolean) => void;
    reset: () => void;
    deleteNode: (id: string) => void;
};

const SimulatorContext = createContext<SimulatorContextType | undefined>(undefined);

const gatesMap: Record<string, new (id: string) => BaseElement> = {
    NAND: NandGate,
    NOT: NotGate,
    BUTTON: Button,
    OR: OrGate,
    NOR: NorGate,
    XOR: XorGate,
    AND: AndGate
};

export const SimulatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [nodes, setNodes, _onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, _onEdgesChange] = useEdgesState<Edge>([]);

    const graphRef = useRef<Graph<Positionned>>(deserialize(Graph<Positionned>, JSON.parse(localStorage.getItem("myGraph")!)) || new Graph<Positionned>());

    useEffect(() => {
        update();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const simulate = () => {
        graphRef.current.simulate();
    }

    const addNode = (type: string, position: { x: number; y: number }) => {
        if (!gatesMap[type]) return;

        const gate = new gatesMap[type](Date.now().toString());
        let newGate: Positionned;
        if (gate instanceof BaseGate) {
            newGate = new PositionnedGate(gate, position);
        }
        else if (gate instanceof BaseInput) {
            newGate = new PositionnedInput(gate, position.x, position.y);
        }
        else {
            return
        }

        graphRef.current.addNode(newGate);

        update();
    }

    const addEdge = (connection: Connection) => {
        if (!connection.source || !connection.target || !connection.targetHandle || !connection.sourceHandle) return;
        graphRef.current.addEdge(connection.source, connection.target, +connection.sourceHandle.split("#")[1], +connection.targetHandle.split("#")[1]);

        update();
    }

    const setValue = (id: string, value: boolean) => {
        const button = graphRef.current.getNode(id);
        if (button instanceof PositionnedInput) {
            button.setValue(value);
        }

        update();
    }

    const setNodePosition = (id: string, position: { x: number; y: number }) => {
        const node = graphRef.current.getNode(id);
        if (node) {
            node.setPosition(position.x, position.y);
        }

        // update();
    }

    function update() {
        simulate();
        setEdges(graphRef.current.getEdges().map(edge => ({
            id: `${edge.source}-${edge.target}-${edge.sourceHandle}-${edge.targetHandle}`,
            type: "smoothstep",
            source: edge.source,
            target: edge.target,
            sourceHandle: `source#${edge.sourceHandle}`,
            targetHandle: `target#${edge.targetHandle}`
        })));

        setNodes(graphRef.current.getNodes().map(node => ({
            id: node.getId(),
            type: node.getType(),
            position: node.getPosition(),
            data: {
                outputsValue: node.getOutputs(),
                inputsValue: node.getInputs()
            }
        })));
    }

    useEffect(() => {
        localStorage.setItem("myGraph", JSON.stringify(serialize(graphRef.current)));
    }, [edges, nodes]);


    const onNodesChange = (changes: NodeChange[]) => {
        changes.forEach((change) => {
            switch (change.type) {
                case 'position': {
                    const { id, position } = change;
                    if (position) setNodePosition(id, position);
                    break;
                }
                case 'remove':
                    graphRef.current.deleteNode(change.id);
            }
        });
        _onNodesChange(changes);
    }

    const onEdgesChange = (changes: EdgeChange[]) => {
        changes.forEach((change) => {
            switch (change.type) {
                case 'remove': {
                    const { id } = change;
                    const [source, target, sourceHandle, targetHandle] = id.split("-");
                    graphRef.current.deleteEdge(source, target, +sourceHandle, +targetHandle);
                    break;
                }

            }
        });
        _onEdgesChange(changes);
    }

    const reset = () => {
        graphRef.current = new Graph();
        update();
    }

    const deleteNode = (id: string) => {
        graphRef.current.deleteNode(id);
        update();
    }

    return (
        <SimulatorContext.Provider value={{ nodes, edges, simulate, onNodesChange, onEdgesChange, addNode, addEdge, setValue, reset, deleteNode }}>
            {children}
        </SimulatorContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSimulatorContext = () => {
    const context = useContext(SimulatorContext);
    if (!context) throw new Error("useSimulatorContext must be used within SimulatorProvider");
    return context;
};
