import { type MatchesQueryParameters, type AvonRequest } from '../Http/Requests';
import type Filter from '../Filters/Filter';
import { type AbstractMixable, type Mixable } from './Mixable';
import type Repository from '../Repositories/Repository';
import { TrashedStatus } from './SoftDeletes';
import type Ordering from '../Orderings/Ordering';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Search repository for incoming request.
         */
        search(request: AvonRequest, filters?: MatchesQueryParameters<Filter>, orderings?: MatchesQueryParameters<Ordering>, withTrashed?: TrashedStatus): Promise<Repository>;
        /**
         * Initialize the search configuration.
         */
        initializeSearch(request: AvonRequest, filters?: MatchesQueryParameters<Filter>, orderings?: MatchesQueryParameters<Ordering>): Promise<Repository>;
        /**
         * Apply the softe-delete into given query.
         */
        applySoftDeleteConstraint(repository: Repository, withTrashed: TrashedStatus): Repository;
        /**
         * Apply any applicable filters to the repository.
         */
        applyFilters(request: AvonRequest, repository: Repository, filters: MatchesQueryParameters<Filter>): Promise<Repository>;
        /**
         * Apply any applicable orders to the repository.
         */
        applyOrderings(request: AvonRequest, repository: Repository, orderings?: MatchesQueryParameters<Ordering>): Promise<Repository>;
        /**
         * Build a "relatable" query for the given resource.
         *
         * This query determines which instances of the model may be attached to other resources.
         */
        relatableQuery(request: AvonRequest, repository: Repository): Repository;
    };
} & Tbase;
export default _default;
//# sourceMappingURL=PerformsQueries.d.ts.map