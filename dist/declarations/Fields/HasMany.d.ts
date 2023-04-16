import { type Model } from '../Models';
import { type AvonRequest } from '../Http/Requests';
import HasManyOrOne from './HasManyOrOne';
export default class HasMany extends HasManyOrOne {
    constructor(resource: string, relation?: string);
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fill<TModel extends Model>(request: AvonRequest, model: TModel): any;
    /**
     * Get the value considered as null.
     */
    nullValue(): any;
}
//# sourceMappingURL=HasMany.d.ts.map