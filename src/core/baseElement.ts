import type BaseElementInterface from "./baseElementInterface";

/**
 * Base class for all circuit/logic elements.
 * Implements the common interface for all elements (logic gates, inputs, outputs, etc.)
 */
export default abstract class BaseElement implements BaseElementInterface {
    // Unique identifier of the node in the graph
    private id: string;

    // Array of input values (e.g., for a logic gate with multiple inputs)
    protected inputs: boolean[] = [];

    // Array of output values (e.g., for a logic gate with multiple outputs)
    protected outputs: boolean[] = [];

    // Type of the element (e.g., "AND", "OR", "INPUT", "OUTPUT", etc.)
    private type: string;

    // Expected number of inputs for this element
    private inputsNumber: number;

    // Expected number of outputs for this element
    private outputsNumber: number;

    /**
     * @param id unique identifier of the element
     * @param type element type (string description)
     * @param inputsNumber number of expected inputs
     * @param outputsNumber number of expected outputs
     */
    constructor(id: string, type: string, inputsNumber: number, outputsNumber: number) {
        this.id = id;
        this.type = type;
        this.inputsNumber = inputsNumber;
        this.outputsNumber = outputsNumber;
    }

    /**
     * Type guard that checks if the current element is of a given class.
     * Useful for narrowing down element types (e.g., node.is(BaseGate)).
     */
    is<T>(type: abstract new (...args: never[]) => T | (new (...args: never[]) => T)): this is T {
        return this instanceof type;
    }

    /** Returns the unique identifier of the element */
    getId(): string {
        return this.id;
    }

    /** Returns the list of current input values */
    getInputs(): boolean[] {
        return this.inputs;
    }

    /** Returns the list of current output values */
    getOutputs(): boolean[] {
        return this.outputs;
    }

    /** Returns the type of the element */
    getType(): string {
        return this.type;
    }

    /** Returns the expected number of inputs for this element */
    getInputsNumber(): number {
        return this.inputsNumber;
    }

    /** Returns the expected number of outputs for this element */
    getOutputsNumber(): number {
        return this.outputsNumber;
    }
}
