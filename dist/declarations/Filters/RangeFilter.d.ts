import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import Filter from './Filter';
export default abstract class RangeFilter extends Filter {
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request: AvonRequest): OpenAPIV3.ParameterObject[];
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=RangeFilter.d.ts.map