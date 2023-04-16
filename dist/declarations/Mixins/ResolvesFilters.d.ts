import { type AvonRequest } from '../Http/Requests';
import Filter from '../Filters/Filter';
import { type AbstractMixable, type Mixable } from './Mixable';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        /**
         * Get the filters that are available for the given request.
         */
        availableFilters(request: AvonRequest): Filter[];
        /**
         * Get the filters for the given request.
         */
        resolveFilters(request: AvonRequest): Filter[];
        /**
         * Get the filters from filterable fields for the given request.
         */
        resolveFiltersFromFields(request: AvonRequest): Filter[];
        /**
         * Get the filters available on the entity.
         */
        filters(request: AvonRequest): Filter[];
    };
} & Tbase;
export default _default;
//# sourceMappingURL=ResolvesFilters.d.ts.map