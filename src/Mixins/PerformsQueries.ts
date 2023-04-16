import {
  type MatchesQueryParameters,
  type AvonRequest,
} from '../Http/Requests';
import type Filter from '../Filters/Filter';
import { type AbstractMixable, type Mixable } from './Mixable';
import type Repository from '../Repositories/Repository';
import { Direction } from '../Repositories/Repository';
import { TrashedStatus } from './SoftDeletes';
import type Ordering from '../Orderings/Ordering';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class PerformQueries extends Parent {
    [x: string]: any;

    /**
     * Search repository for incoming request.
     */
    public async search(
      request: AvonRequest,
      filters: MatchesQueryParameters<Filter> = [],
      orderings: MatchesQueryParameters<Ordering> = [],
      withTrashed: TrashedStatus = TrashedStatus.DEFAULT,
    ): Promise<Repository> {
      return this.indexQuery(
        request,
        this.applySoftDeleteConstraint(
          await this.initializeSearch(request, filters, orderings),
          withTrashed,
        ),
      );
    }

    /**
     * Initialize the search configuration.
     */
    public async initializeSearch(
      request: AvonRequest,
      filters: MatchesQueryParameters<Filter> = [],
      orderings: MatchesQueryParameters<Ordering> = [],
    ): Promise<Repository> {
      const repository = this.repository();

      await this.applyFilters(request, repository, filters);
      await this.applyOrderings(request, repository, orderings);

      return repository;
    }

    /**
     * Apply the softe-delete into given query.
     */
    public applySoftDeleteConstraint(
      repository: Repository,
      withTrashed: TrashedStatus,
    ): Repository {
      const callback = {
        [TrashedStatus.WITH]: 'withTrashed',
        [TrashedStatus.ONLY]: 'onlyTrashed',
        [TrashedStatus.DEFAULT]: 'applySoftDelete',
      }[withTrashed];

      return this.softDeletes() === true ? repository[callback]() : repository;
    }

    /**
     * Apply any applicable filters to the repository.
     */
    public async applyFilters(
      request: AvonRequest,
      repository: Repository,
      filters: MatchesQueryParameters<Filter>,
    ): Promise<Repository> {
      await Promise.all(
        filters.map(({ handler, value }) => {
          return handler.apply(request, repository, value);
        }),
      );
      return repository;
    }

    /**
     * Apply any applicable orders to the repository.
     */
    public async applyOrderings(
      request: AvonRequest,
      repository: Repository,
      orderings: MatchesQueryParameters<Ordering> = [],
    ): Promise<Repository> {
      await Promise.all(
        orderings.map(({ handler, value }) => {
          return handler.apply(
            request,
            repository,
            value === Direction.DESC ? Direction.DESC : Direction.ASC,
          );
        }),
      );
      return repository;
    }

    /**
     * Build a "relatable" query for the given resource.
     *
     * This query determines which instances of the model may be attached to other resources.
     */
    public relatableQuery(
      request: AvonRequest,
      repository: Repository,
    ): Repository {
      return repository;
    }
  };
};
