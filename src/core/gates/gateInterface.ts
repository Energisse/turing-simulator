/**
 * Generic interface for all logic gates.
 * Defines the core methods every gate must implement.
 */
export default interface GateInterface {
    /** Returns the unique identifier of the gate */
    getId(): string;

    /** Returns the number of expected inputs */
    getInputsNumber(): number;

    /** Returns the number of expected outputs */
    getOutputsNumber(): number;

    /** Returns the current input values */
    getInputs(): boolean[];

    /** Returns the current output values */
    getOutputs(): boolean[];

    /** Returns the type of gate (e.g., "AND", "NAND", "OR") */
    getType(): string;

    /** Computes the output(s) of the gate */
    compute(): void;

    /** Sets a specific input value at the given handle */
    setInput(handle: number, value: boolean): void;
}
