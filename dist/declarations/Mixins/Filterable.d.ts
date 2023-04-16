import type Filter from '../Filters/Filter';
import { type AvonRequest } from '../Http/Requests';
import { type Model } from '../Models';
import { type Repository } from '../Repositories';
import { type AbstractMixable, type Mixable } from './Mixable';
export type FilterableCallback = (request: AvonRequest, repository: Repository<Model>, value: any) => void;
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => (abstract new (...args: any[]) => {
    /**
     * The callback to be used for the field's default value.
     */
    filterableCallback?: FilterableCallback | undefined;
    /**
     * Apply the filter to the given query.
     */
    applyFilter(request: AvonRequest, repository: Repository<Model>, value: any): Promise<any>;
    /**
     * Make the field filter.
     */
    resolveFilter(request: AvonRequest): Filter | undefined;
    /**
     * The callback used to determine if the field is filterable.
     */
    filterable(callback?: FilterableCallback): this;
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback(): FilterableCallback;
    /**
     * Make the field filter.
     */
    makeFilter(request: AvonRequest): Filter;
    /**
     * Define filterable attribute.
     */
    filterableAttribute(request: AvonRequest): string;
}) & Tbase;
export default _default;
//# sourceMappingURL=Filterable.d.ts.map