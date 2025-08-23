import Positionned from "../positionned";
import BaseGate from "./baseGate";
import type BaseGateInterface from "./baseGateInterface";

/**
 * Wrapper class that adds a position to any gate.
 * Delegates all gate operations to the inner BaseGate.
 */
export class PositionnedGate extends Positionned<BaseGate> implements BaseGateInterface {

    constructor(gate: BaseGate, position: { x: number; y: number }) {
        super(gate, position.x, position.y);
        this.position = position;
    }

    /** Reset the gate */
    reset(): void {
        this.element.reset();
    }

    /** Set a specific input value */
    setInput(handle: number, value: boolean): void {
        this.element.setInput(handle, value);
    }

    /** Return the number of inputs */
    getInputsNumber(): number {
        return this.element.getInputs().length;
    }

    /** Return the number of outputs */
    getOutputsNumber(): number {
        return this.element.getOutputs().length;
    }

    /** Compute the gate's output */
    compute() {
        this.element.compute();
    }
}
