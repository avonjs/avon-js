import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
export interface ParameterSerializable {
    /**
     * Serialize parameters for schema.
     */
    serializeParameters: (request: AvonRequest) => OpenAPIV3.ParameterObject[];
}
//# sourceMappingURL=ParameterSerializable.d.ts.map