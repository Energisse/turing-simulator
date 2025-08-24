import { SerializableClass } from "../decorators/serializable";
import BaseGate from "./baseGate";

/**
 * Concrete NOR gate with 2 inputs and 1 output.
 * Output is the negation of the OR of its inputs.
 */
@SerializableClass()
export default class NorGate extends BaseGate {

    constructor(id: string) {
        // Calls BaseGate constructor: id, type "NOR", 2 inputs, 1 output
        super(id, "NOR", 2, 1);
    }

    /**
     * Implements the logic of the NOR gate.
     * Returns true if NOT(either input is true).
     */
    forward(): boolean {
        return !(this.inputs[0] || this.inputs[1]);
    }
}
