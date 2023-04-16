import { type AbstractMixable, type Mixable } from './Mixable';
export type Validator = (value: any) => boolean;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Indicates if the field is nullable.
         */
        acceptsNullValues: boolean;
        /**
         * Values which will be replaced to null.
         */
        nullValidator: Validator;
        /**
         * Indicate that the field should be nullable.
         */
        nullable(nullable?: boolean, validator?: Validator): this;
        /**
         * Specify nullable values.
         */
        nullValues(nullValidator: Validator): this;
        /**
         * Determine if the field supports null values.
         */
        isNullable(): boolean;
        /**
         * Determine if the given value is considered a valid null value if the field supports them.
         */
        isValidNullValue(value: any): boolean;
        /**
         * Determine if the given value is considered null.
         */
        valueIsConsideredNull(value: any): boolean;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=Nullable.d.ts.map