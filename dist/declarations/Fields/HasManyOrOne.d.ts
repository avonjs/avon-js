import { type Model } from '../Models';
import { type AvonRequest } from '../Http/Requests';
import { type FilterableCallback } from '../Mixins/Filterable';
import Relation from './Relation';
export default abstract class HasManyOrOne extends Relation {
    /**
     * Indicates related resources have to load.
     */
    loaded: boolean;
    constructor(resource: string, relation?: string);
    /**
     * Get attribute that holde the related model key.
     */
    foreignKeyName(request: AvonRequest): string;
    /**
     * Get attribute that holde the related model key.
     */
    ownerKeyName(request: AvonRequest): string;
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback(): FilterableCallback;
    /**
     * Resolve related value for given resources.
     */
    resolveRelatables(request: AvonRequest, resources: Model[]): Promise<any>;
    /**
     * Get related models for given resources.
     */
    SearchRelatables(request: AvonRequest, resources: Model[]): Promise<Model[]>;
    /**
     * Determine field is fillable or not.
     */
    fillable(): boolean;
}
//# sourceMappingURL=HasManyOrOne.d.ts.map