import BaseInput from "./baseInput";

/**
 * Represents a simple button input with 0 inputs and 1 output.
 * Output is boolean, initially false.
 */
export default class Button extends BaseInput {

    constructor(id: string) {
        super(id, "BUTTON", 0, 1, false);
    }
}
