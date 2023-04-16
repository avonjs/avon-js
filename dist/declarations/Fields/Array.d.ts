import { type AvonRequest } from '../Http/Requests';
import Field from './Field';
import { type AnySchema } from 'joi';
import { type Model } from '../Models';
import { type OpenAPIV3 } from 'openapi-types';
export default class Array extends Field {
    /**
     * The validation rules callback for creation and updates.
     */
    protected rulesSchema: AnySchema;
    /**
     * The validation rules callback for creation.
     */
    protected creationRulesSchema: AnySchema;
    /**
     * The validation rules callback for updates.
     */
    protected updateRulesSchema: AnySchema;
    /**
     * Indicates items schema.
     */
    protected itemsSchema: OpenAPIV3.SchemaObject;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttributeFromRequest<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): any[];
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    isOrderable(): boolean;
    /**
     * Specify items schema.
     */
    items(itemsSchema: OpenAPIV3.SchemaObject): this;
    /**
     * Get the value considered as null.
     */
    nullValue(): any;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=Array.d.ts.map