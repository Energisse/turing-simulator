import { SerializableMixin, SerializableProperty } from "./decorators/serializable";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = object> = new (...args: any[]) => T;

// Define the interface that the mixin adds
export interface PositionableInterface {
    readonly x: number;  // Accessible en lecture seule
    readonly y: number;  // Accessible en lecture seule

    setPosition(x: number, y: number): void;
    getPosition(): { x: number; y: number };
}

// Define the constructor signature for the returned class
type PositionableConstructor<TBase extends Constructor> = new (
    x: number,
    y: number,
    ...args: ConstructorParameters<TBase>
) => InstanceType<TBase> & PositionableInterface;

export abstract class Mixin {
    @SerializableMixin()
    static Positionable<TBase extends Constructor>(
        Base: TBase
    ): PositionableConstructor<TBase> {
        class PositionableClass extends Base implements PositionableInterface {
            @SerializableProperty()
            public readonly x: number;
            @SerializableProperty()
            public readonly y: number;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            constructor(...args: any[]) {
                // Extract x and y from the beginning of args
                const [x, y, ...baseArgs] = args;
                super(...baseArgs);
                this.x = x;
                this.y = y;
            }

            setPosition(x: number, y: number): void {
                Object.assign(this, { x, y });
            }

            getPosition(): { x: number; y: number } {
                return { x: this.x, y: this.y };
            }
        }

        return PositionableClass as unknown as PositionableConstructor<TBase>;
    }
}
