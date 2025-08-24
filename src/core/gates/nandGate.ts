import { SerializableClass } from "../decorators/serializable";
import BaseGate from "./baseGate";

/**
 * Concrete NAND gate with 2 inputs and 1 output.
 * Output is the negation of the AND of its inputs.
 */
@SerializableClass()
export default class NandGate extends BaseGate {
    constructor(id: string) {
        // Calls BaseGate constructor: id, type "NAND", 2 inputs, 1 output
        super(id, "NAND", 2, 1);
    }

    /**
     * Implements the logic of the NAND gate.
     * Returns true if NOT(both inputs are true).
     */
    forward(): boolean {
        return !(this.inputs[0] && this.inputs[1]);
    }
}
