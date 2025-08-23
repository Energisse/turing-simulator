import type GateInterface from "./gateInterface";

/**
 * Interface for all gates
 * Extends the generic GateInterface and adds methods specific to gates
 */
export default interface BaseGateInterface extends GateInterface {
    setInput(handle: number, value: boolean): void;
    compute(): void;
    reset(): void;
}
