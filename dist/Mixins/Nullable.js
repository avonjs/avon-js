"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class Nullable extends Parent {
        constructor() {
            super(...arguments);
            /**
             * Indicates if the field is nullable.
             */
            this.acceptsNullValues = false;
            /**
             * Values which will be replaced to null.
             */
            this.nullValidator = (value) => {
                return ['', undefined, NaN, null].includes(value);
            };
        }
        /**
         * Indicate that the field should be nullable.
         */
        nullable(nullable = true, validator) {
            this.acceptsNullValues = nullable;
            if (validator !== undefined) {
                this.nullValues(validator);
            }
            return this;
        }
        /**
         * Specify nullable values.
         */
        nullValues(nullValidator) {
            this.nullValidator = nullValidator;
            return this;
        }
        /**
         * Determine if the field supports null values.
         */
        isNullable() {
            return this.acceptsNullValues;
        }
        /**
         * Determine if the given value is considered a valid null value if the field supports them.
         */
        isValidNullValue(value) {
            return this.isNullable() && this.valueIsConsideredNull(value);
        }
        /**
         * Determine if the given value is considered null.
         */
        valueIsConsideredNull(value) {
            return this.nullValidator(value);
        }
    };
};
