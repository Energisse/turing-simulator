import "reflect-metadata";

/**
 * Symbol key used to store metadata for serializable properties.
 */
const metadataKey = Symbol("serializableProperties");

/**
 * Registry of all serializable classes by their class name.
 */
const classRegistry = new Map<string, unknown>();

/**
 * Metadata information for a serializable property.
 */
export interface SerializablePropertyMetadata {
    /** Actual property name in the class */
    propertyKey: string;
    /** Key to use during serialization */
    key: string;
    /** Property type retrieved via Reflect metadata */
    type: unknown;
}

/**
 * Property decorator to mark a property as serializable.
 * @param key Optional key name to use in serialization (defaults to property name)
 * @returns Property decorator function
 */
export function SerializableProperty(key?: string): PropertyDecorator {
    return (target, propertyKey): void => {
        const classConstructor = target.constructor as {
            [metadataKey]?: SerializablePropertyMetadata[];
        };

        if (!classConstructor[metadataKey]) {
            classConstructor[metadataKey] = [];
        }

        classConstructor[metadataKey]!.push({
            propertyKey: propertyKey.toString(),
            key: key ?? propertyKey.toString(),
            type: Reflect.getMetadata("design:type", target, propertyKey),
        });
    };
}

/**
 * Recursively serializes a value.
 * - Arrays are serialized element-wise
 * - Objects are serialized including a `__class` property
 * - Primitives are returned as-is
 * @param value The value to serialize
 * @returns Serialized value
 */
function serializeValue(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(serializeValue);
    } else if (value && typeof value === "object") {
        return { __class: (value as object).constructor.name, ...serialize(value as object) };
    }
    return value;
}

/**
 * Type for a class constructor.
 * @template T Instance type
 */
type Constructor<T = unknown> = new (...args: unknown[]) => T;

/**
 * Retrieves all serializable properties of a class, including inherited ones.
 * @param cls The class constructor or prototype object
 * @returns Array of serializable property metadata
 */
export function getAllProps(cls: Constructor | object | null): SerializablePropertyMetadata[] {
    const props: SerializablePropertyMetadata[] = [];

    while (cls) {
        const meta = (cls as unknown as Record<symbol, unknown>)[metadataKey] as
            | SerializablePropertyMetadata[]
            | undefined;
        if (meta) {
            props.unshift(...meta);
        }
        cls = Object.getPrototypeOf(cls);
    }

    return props;
}

/**
 * Serializes an instance of a class into a plain object.
 * @param instance The class instance to serialize
 * @returns Plain object representation of the instance
 */
export function serialize<T extends object>(instance: T): Record<string, unknown> {
    const props = getAllProps(instance.constructor as Constructor<T>);
    const result: Record<string, unknown> = {};

    for (const { propertyKey, key } of props) {
        const value = (instance as Record<string, unknown>)[propertyKey as string];
        result[key] = serializeValue(value);
    }

    return result;
}

/**
 * Class decorator to mark a class as serializable.
 * Registers the class in the global class registry.
 * Automatically hooks subclass creation to register them too.
 * @param name Optional custom class name for serialization
 * @returns Class decorator function
 */
export function SerializableClass(name?: string): ClassDecorator {
    return function (constructor) {
        const className = name || constructor.name;
        classRegistry.set(className, constructor);

        const originalExtend = Object.getPrototypeOf(constructor);
        Object.setPrototypeOf(constructor, new Proxy(originalExtend, {
            construct(target, args, newTarget) {
                const instance = Reflect.construct(target, args, newTarget);

                if (!classRegistry.has(newTarget.name)) {
                    classRegistry.set(newTarget.name, newTarget);
                }

                return instance;
            }
        }));
    };
}

/**
 * Recursively deserializes a value.
 * - Objects with `__class` property are deserialized to the registered class
 * - Arrays are deserialized element-wise
 * - Primitives are returned as-is
 * @param value The value to deserialize
 * @returns Deserialized value
 */
export function deserializeValue(value: unknown): unknown {
    if (value && typeof value === "object") {
        const obj = value as Record<string, unknown>;

        if ("__class" in obj && typeof obj.__class === "string" && classRegistry.has(obj.__class)) {
            const cls = classRegistry.get(obj.__class) as Constructor;
            return deserialize(cls, obj);
        }

        if (Array.isArray(value)) {
            return value.map(deserializeValue);
        }
    }

    return value;
}

/**
 * Deserializes a plain object into an instance of a given class.
 * @template T The class instance type
 * @param cls The class constructor
 * @param data The plain object data to deserialize
 * @returns Instance of the class with deserialized properties, or null if no data
 */
export function deserialize<T>(cls: Constructor<T>, data: Record<string, unknown>): T | null {
    if (!data) return null;

    const instance = Object.create(cls.prototype) as T;
    const props = getAllProps(cls);

    for (const { propertyKey, key } of props) {
        const val = data[key];
        (instance as Record<string, unknown>)[propertyKey as string] = deserializeValue(val);
    }

    return instance;
}
