import Field, { type ResolveCallback } from './Field';
import { type AvonRequest } from '../Http/Requests';
import { type OpenAPIV3 } from 'openapi-types';
import FieldCollection from '../Collections/FieldCollection';
import { type Rules } from '../Mixins/PerformsValidation';
import { type Model } from '../Models';
export default class Json extends Field {
    /**
     * The object possible keys.
     */
    protected fields: FieldCollection;
    constructor(attribute: string, fields: Field[], resolveCallback?: ResolveCallback);
    /**
     * Get the validation rules for this field.
     */
    getRules(request: AvonRequest): Rules;
    /**
     * Get the creation rules for this field.
     */
    getCreationRules(request: AvonRequest): Rules;
    /**
     * Get the update rules for this field.
     */
    getUpdateRules(request: AvonRequest): Rules;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttributeFromRequest<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): Record<any, any>;
    /**
     * Determine field is filterable or not.
     */
    isFilterable(): boolean;
    /**
     * Determine field is orderable or not.
     */
    isOrderable(): boolean;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=Json.d.ts.map