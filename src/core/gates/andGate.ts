import { SerializableClass } from "../decorators/serializable";
import BaseGate from "./baseGate";

/**
 * Concrete AND gate with 2 inputs and 1 output.
 */
@SerializableClass()
export default class AndGate extends BaseGate {

    /**
     * @param id unique identifier of this gate
     */
    constructor(id: string) {
        // Calls BaseGate constructor: id, type "AND", 2 inputs, 1 output
        super(id, "AND", 2, 1);
    }

    /**
     * Implements the logic of the AND gate.
     * Returns true if both inputs are true.
     */
    forward(): boolean {
        return this.inputs[0] && this.inputs[1];
    }
}