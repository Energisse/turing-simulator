import type BaseElementInterface from "./baseElementInterface";

/**
 * Wrapper class that adds a position (x, y) to any element.
 * Delegates all BaseElementInterface methods to the wrapped element.
 */
export default abstract class Positionned<T extends BaseElementInterface = BaseElementInterface> implements BaseElementInterface {
    // Position of the element in 2D space
    protected position: { x: number; y: number };

    // The actual element being wrapped
    protected element: T;

    /**
     * @param element the element to wrap
     * @param x initial x-coordinate
     * @param y initial y-coordinate
     */
    constructor(element: T, x: number, y: number) {
        this.position = { x, y };
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
        return this.position;
    }

    /** Update the position */
    setPosition(x: number, y: number): void {
        this.position = { x, y };
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
