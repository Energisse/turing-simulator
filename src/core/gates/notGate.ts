import BaseGate from "./baseGate";

/**
 * Concrete NOT gate with 1 input and 1 output.
 * Output is the negation of the input.
 */
export default class NotGate extends BaseGate {

    constructor(id: string) {
        super(id, "NOT", 1, 1);
    }

    forward(): boolean {
        return !this.inputs[0];
    }
}
