import { type OpenAPIV3 } from 'openapi-types';
import { type ParameterSerializable } from '../Contracts/ParameterSerializable';
import QueryParameter from '../Http/Requests/QueryParameter';
import { type AvonRequest } from '../Http/Requests';
import { type Repository } from '../Repositories';
declare const Ordering_base: {
    new (...args: any[]): {
        seeCallback: import("../Mixins/AuthorizedToSee").SeeCallback;
        authorizedToSee(request: AvonRequest): boolean;
        canSee(callback: import("../Mixins/AuthorizedToSee").SeeCallback): any;
    };
} & typeof QueryParameter;
export default abstract class Ordering extends Ordering_base implements ParameterSerializable {
    /**
     * Get the query parameter key for filter.
     */
    key(): string;
    /**
     * Apply the filter into the given repository.
     */
    abstract apply(request: AvonRequest, repository: Repository, dirction: any): any;
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
//# sourceMappingURL=Ordering.d.ts.map