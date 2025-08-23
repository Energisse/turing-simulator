// InputInterface.ts
/**
 * Interface for input elements (like buttons).
 * Allows external code to set the value of the input.
 */
export default interface InputInterface {
    setValue(value: boolean): void;
}
