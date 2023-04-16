import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import Filter from './Filter';
export default abstract class BooleanFilter extends Filter {
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=BooleanFilter.d.ts.map