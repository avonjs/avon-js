import { type AbstractMixable, type Mixable } from './Mixable';

export type Validator = (value: any) => boolean;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class Nullable extends Parent {
    /**
     * Indicates if the field is nullable.
     */
    public acceptsNullValues = false;

    /**
     * Values which will be replaced to null.
     */
    public nullValidator: Validator = (value: any) => {
      return ['', undefined, NaN, null].includes(value);
    };

    /**
     * Indicate that the field should be nullable.
     */
    public nullable(nullable: boolean = true, validator?: Validator): this {
      this.acceptsNullValues = nullable;

      if (validator !== undefined) {
        this.nullValues(validator);
      }

      return this;
    }

    /**
     * Specify nullable values.
     */
    public nullValues(nullValidator: Validator): this {
      this.nullValidator = nullValidator;

      return this;
    }

    /**
     * Determine if the field supports null values.
     */
    public isNullable(): boolean {
      return this.acceptsNullValues;
    }

    /**
     * Determine if the given value is considered a valid null value if the field supports them.
     */
    public isValidNullValue(value: any): boolean {
      return this.isNullable() && this.valueIsConsideredNull(value);
    }

    /**
     * Determine if the given value is considered null.
     */
    public valueIsConsideredNull(value: any): boolean {
      return this.nullValidator(value);
    }
  };
};
