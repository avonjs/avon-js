import Joi from 'joi';
import { type OpenAPIV3 } from 'openapi-types';
import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import { type FilterableCallback } from '../Mixins/Filterable';
import Field, { type DefaultCallback } from './Field';
export default class Integer extends Field {
    /**
     * The callback to be used for the field's default value.
     */
    defaultCallback: DefaultCallback;
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: Joi.NumberSchema<number>;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: Joi.NumberSchema<number>;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: Joi.NumberSchema<number>;
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): number | undefined;
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    isOrderable(): boolean;
    /**
     * Make the field filter.
     */
    makeFilter(request: AvonRequest): Filter;
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback(): FilterableCallback;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=Integer.d.ts.map