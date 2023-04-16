import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import Relation from './Relation';
import { type OpenAPIV3 } from 'openapi-types';
import { type Rules } from '../Mixins/PerformsValidation';
export default class BelongsTo extends Relation {
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction<TModel extends Model>(request: AvonRequest, model: TModel): any;
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    protected fillAttributeFromRequest<TModel extends Model>(request: AvonRequest, requestAttribute: string, model: TModel, attribute: string): any;
    /**
     * Get related models for given resources.
     */
    SearchRelatables(request: AvonRequest, resources: Model[]): Promise<Model[]>;
    /**
     * Determine field is resolvable or not.
     */
    resolvable(): boolean;
    /**
     * Determine if the underlying file should be pruned when the resource is deleted.
     */
    isPrunable(): boolean;
    /**
     * Get the validation rules for this field.
     */
    getRules(request: AvonRequest): Rules;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=BelongsTo.d.ts.map