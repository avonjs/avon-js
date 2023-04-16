import { type OpenAPIV3 } from 'openapi-types';
import { type ParameterSerializable } from '../Contracts/ParameterSerializable';
import { type AvonRequest } from '../Http/Requests';
import QueryParameter from '../Http/Requests/QueryParameter';
import type Repository from '../Repositories/Repository';
declare const Filter_base: {
    new (...args: any[]): {
        seeCallback: import("../Mixins/AuthorizedToSee").SeeCallback;
        authorizedToSee(request: AvonRequest): boolean;
        canSee(callback: import("../Mixins/AuthorizedToSee").SeeCallback): any;
    };
} & typeof QueryParameter;
export default abstract class Filter extends Filter_base implements ParameterSerializable {
    /**
     * Get the query parameter key for filter.
     */
    key(): string;
    /**
     * Apply the filter into the given repository.
     */
    abstract apply(request: AvonRequest, repository: Repository, value: any): any;
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request: AvonRequest): OpenAPIV3.ParameterObject[];
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}
export {};
//# sourceMappingURL=Filter.d.ts.map