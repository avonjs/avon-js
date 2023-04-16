export default class Exception extends Error {
    constructor(message?: string, ...args: readonly unknown[]);
    /**
     * Throw the Exception.
     */
    static throw(message?: string, ...args: readonly unknown[]): void;
    /**
     * Generate an Exception if the given condition is satisfied.
     */
    static when(condition: boolean, message?: string, ...args: readonly unknown[]): void;
    /**
     * Generate an Exception if the given condition is not satisfied.
     */
    static unless(condition: boolean, message?: string, ...args: readonly unknown[]): void;
}
//# sourceMappingURL=Exception.d.ts.map