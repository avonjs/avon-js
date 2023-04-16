import { type OpenAPIV3 } from 'openapi-types';
import { type AvonRequest } from '../Http/Requests';
import HasManyOrOne from './HasManyOrOne';
export default class HasOne extends HasManyOrOne {
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request: AvonRequest, value: any): any;
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
//# sourceMappingURL=HasOne.d.ts.map