import { type OpenAPIV3 } from 'openapi-types';
import { type Mixable, type AbstractMixable } from './Mixable';
import { type AvonRequest } from '../Http/Requests';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => (abstract new (...args: any[]) => {
    /**
     * Get the swagger-ui schema.
     */
    schema(request: AvonRequest): OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject;
}) & Tbase;
export default _default;
//# sourceMappingURL=HasSchema.d.ts.map