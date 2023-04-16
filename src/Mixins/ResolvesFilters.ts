import { type AvonRequest } from '../Http/Requests';
import Filter from '../Filters/Filter';
import { type AbstractMixable, type Mixable } from './Mixable';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class ResolvesFilters extends Parent {
    /**
     * Get the filters that are available for the given request.
     */
    public availableFilters(request: AvonRequest): Filter[] {
      return this.resolveFilters(request)
        .concat(this.resolveFiltersFromFields(request))
        .filter((filter) => filter.authorizedToSee(request));
    }

    /**
     * Get the filters for the given request.
     */
    public resolveFilters(request: AvonRequest): Filter[] {
      return this.filters(request);
    }

    /**
     * Get the filters from filterable fields for the given request.
     */
    public resolveFiltersFromFields(request: AvonRequest): Filter[] {
      return request
        .resource()
        .filterableFields(request)
        .map((field) => field.resolveFilter(request))
        .filter((filter) => filter instanceof Filter)
        .unique((filter: Filter) => filter.key())
        .all() as Filter[];
    }

    /**
     * Get the filters available on the entity.
     */
    public filters(request: AvonRequest): Filter[] {
      return [];
    }
  };
};
