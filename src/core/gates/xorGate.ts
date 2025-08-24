import { SerializableClass } from "../decorators/serializable";
import BaseGate from "./baseGate";

/**
 * Concrete XOR gate with 2 inputs and 1 output.
 * Output is true if inputs are different.
 */
@SerializableClass()
export default class XorGate extends BaseGate {

    constructor(id: string) {
        super(id, "XOR", 2, 1);
    }

    forward(): boolean {
        return this.inputs[0] !== this.inputs[1];
    }
}
