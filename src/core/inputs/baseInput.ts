import { SerializableClass } from "../decorators/serializable";
import BaseElement from "../baseElement";
import type InputInterface from "./inputInterface";

/**
 * Represents an input node in the circuit.
 * Outputs its initial value, which can be updated with setValue().
 */
@SerializableClass()
export default class BaseInput extends BaseElement implements InputInterface {

    /**
     * @param id unique identifier
     * @param type type string (e.g., "INPUT")
     * @param inputsNumber usually 0 for input nodes
     * @param outputsNumber usually 1 for input nodes
     * @param value initial boolean value
     */
    constructor(id: string, type: string, inputsNumber: number, outputsNumber: number, value: boolean) {
        super(id, type, inputsNumber, outputsNumber);
        this.outputs[0] = value;
    }

    /** Set the output value of the input node */
    setValue(value: boolean): void {
        this.outputs[0] = value;
    }
}
