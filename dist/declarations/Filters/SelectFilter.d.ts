import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import Filter from './Filter';
export default abstract class SelectFilter extends Filter {
    /**
     * Get the possible filtering values.
     */
    options(): any[];
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=SelectFilter.d.ts.map