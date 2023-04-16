import { type OpenAPIV3 } from 'openapi-types';
import { type Model } from '../../Models';
import { type AvonRequest } from '../../Http/Requests';
import type Repository from '../../Repositories/Repository';
import Filter from './Filter';
export default class NumberFilter extends Filter {
    /**
     * Apply the filter into the given repository.
     */
    apply(request: AvonRequest, repository: Repository<Model>, values: {
        min?: number;
        max?: number;
    }): Promise<any>;
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request: AvonRequest): OpenAPIV3.ParameterObject[];
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=NumberFilter.d.ts.map