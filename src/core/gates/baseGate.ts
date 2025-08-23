import BaseElement from "../baseElement";
import type BaseGateInterface from "./baseGateInterface";

/**
 * Abstract base class for all logic gates.
 * Implements the basic input/output handling.
 * Each concrete gate must implement `forward()` which defines its logic.
 */
export default abstract class BaseGate extends BaseElement implements BaseGateInterface {

    // Each gate must define its logic here
    protected abstract forward(): boolean;

    /**
     * Sets the value for a specific input handle
     * @param handle input index
     * @param value boolean value
     */
    setInput(handle: number, value: boolean): void {
        this.inputs[handle] = value;
    }

    /**
     * Computes the outputs of the gate by calling forward()
     * and storing the result(s) in this.outputs array
     */
    compute(): void {
        const result = this.forward();
        this.outputs = Array.isArray(result) ? result : [result];
    }

    /**
     * Resets the gate by clearing all inputs and outputs
     */
    reset() {
        this.outputs = [];
        this.inputs = [];
    }
}
