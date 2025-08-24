import { SerializableProperty } from "./decorators/serializable";
import BaseElementInterface from "./baseElementInterface";

/**
 * Wrapper class that adds a position (x, y) to any element.
 * Delegates all BaseElementInterface methods to the wrapped element.
 */
export default abstract class Positionned<T extends BaseElementInterface = BaseElementInterface> extends BaseElementInterface {
    // X-coordinate of the element
    @SerializableProperty()
    protected x: number;

    // Y-coordinate of the element
    @SerializableProperty()
    protected y: number;

    // The actual element being wrapped
    @SerializableProperty()
    protected element: T;

    /**
     * @param element the element to wrap
     * @param x initial x-coordinate
     * @param y initial y-coordinate
     */
    constructor(element: T, x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.element = element;
    }

    /** Return the unique ID of the wrapped element */
    getId(): string {
        return this.element.getId();
    }

    /** Return the type of the wrapped element */
    getType(): string {
        return this.element.getType();
    }

    /** Return the input values of the wrapped element */
    getInputs(): boolean[] {
        return this.element.getInputs();
    }

    /** Return the output values of the wrapped element */
    getOutputs(): boolean[] {
        return this.element.getOutputs();
    }

    /** Return the current position */
    getPosition(): { x: number; y: number } {
        return { x: this.x, y: this.y };
    }

    /** Update the position */
    setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    /** Return the number of inputs expected by the wrapped element */
    getInputsNumber(): number {
        return this.element.getInputsNumber();
    }

    /** Return the number of outputs expected by the wrapped element */
    getOutputsNumber(): number {
        return this.element.getOutputsNumber();
    }

    /**
     * Type guard: checks if the wrapped element is an instance of a given class
     * Useful for narrowing element types (e.g., node.is(BaseGate))
     */
    is<U>(type: abstract new (...args: never[]) => U | (new (...args: never[]) => U)): this is U {
        return this.element instanceof type;
    }
}
