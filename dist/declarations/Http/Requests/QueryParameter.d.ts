declare const QueryParameter_base: {
    new (...args: any[]): {
        acceptsNullValues: boolean;
        nullValidator: import("../../Mixins/Nullable").Validator;
        nullable(nullable?: boolean, validator?: import("../../Mixins/Nullable").Validator | undefined): any;
        nullValues(nullValidator: import("../../Mixins/Nullable").Validator): any;
        isNullable(): boolean;
        isValidNullValue(value: any): boolean;
        valueIsConsideredNull(value: any): boolean;
    };
} & {
    new (): {};
};
export default abstract class QueryParameter extends QueryParameter_base {
    /**
     * Get the query parameter key name.
     */
    abstract key(): string;
}
export {};
//# sourceMappingURL=QueryParameter.d.ts.map