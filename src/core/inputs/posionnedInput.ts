// PositionnedInput.ts
import { SerializableClass } from "../decorators/serializable";
import Positionned from "../positionned";
import type BaseInput from "./baseInput";
import type InputInterface from "./inputInterface";

/**
 * Wrapper class that adds position (x, y) to an input element.
 * Delegates input operations to the wrapped BaseInput.
 */
@SerializableClass()
export default class PositionnedInput extends Positionned<BaseInput> implements InputInterface {

    constructor(element: BaseInput, x: number, y: number) {
        super(element, x, y);
    }

    /** Returns the current output value of the input */
    getValue(): boolean {
        return this.element.getOutputs()[0];
    }

    /** Sets the value of the wrapped input element */
    setValue(value: boolean): void {
        this.element.setValue(value);
    }
}
