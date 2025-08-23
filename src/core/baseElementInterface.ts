// Not really an interface, but written as an abstract class because 
// we need to define functions with actual implementations later.
// TypeScript interfaces cannot hold method bodies, while abstract classes can. 

/**
 * Abstract base class that defines the contract for all circuit/logic elements.
 * Any concrete element (input, output, logic gate, etc.) must extend this class
 * and implement all of the following methods.
 */
export default abstract class BaseBaseElement {
    /** Returns the unique identifier of the element */
    abstract getId(): string;

    /** Returns the current input values */
    abstract getInputs(): boolean[];

    /** Returns the current output values */
    abstract getOutputs(): boolean[];

    /** Returns the type of the element (e.g., "AND", "OR", "INPUT", "OUTPUT") */
    abstract getType(): string;

    /** Returns the expected number of inputs for this element */
    abstract getInputsNumber(): number;

    /** Returns the expected number of outputs for this element */
    abstract getOutputsNumber(): number;

    /**
     * Type guard that checks whether this element is an instance of the given class.
     * Useful for narrowing element types (e.g., node.is(BaseGate)).
     */
    abstract is<T>(
        type: abstract new (...args: never[]) => T | (new (...args: never[]) => T)
    ): this is T;
}
