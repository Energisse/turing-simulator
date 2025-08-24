import { SerializableClass } from "../decorators/serializable";
import BaseGate from "./baseGate";

/**
 * Concrete OR gate with 2 inputs and 1 output.
 * Output is true if either input is true.
 */

@SerializableClass()
export default class OrGate extends BaseGate {

    constructor(id: string) {
        super(id, "OR", 2, 1);
    }

    forward(): boolean {
        return this.inputs[0] || this.inputs[1];
    }
}
