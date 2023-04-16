import Fluent from '../Models/Fluent';
import Repository, { type SearchCollection, type Where } from './Repository';
import { type Knex } from 'knex';
import { type Model } from '../Models';
export default abstract class KnexRepository extends Repository<Model> {
    /**
     * Search storage for given query string.
     */
    search(search: string, page?: number, perPage?: number): Promise<SearchCollection<Fluent>>;
    /**
     * Perform searches on the given item.
     */
    protected performSearch(query: Knex.QueryBuilder, search: string): Knex.QueryBuilder;
    /**
     * Find all model's for the given conditions.
     */
    all(wheres?: Where[]): Promise<Fluent[]>;
    /**
     * Store given model into the storage.
     */
    store(model: Fluent): Promise<Fluent>;
    /**
     * Find first model for the given conditions.
     */
    first(wheres?: Where[]): Promise<Fluent>;
    /**
     * Store given model into the storage.
     */
    update(model: Fluent): Promise<Fluent>;
    /**
     * Delete model for the given key.
     */
    delete(key: string | number): Promise<void>;
    /**
     * Create new instance of model.
     */
    model(): Model;
    /**
     * Get new query with wheres and orders.
     */
    protected makeQuery(): Knex.QueryBuilder;
    /**
     * Get the base query.
     */
    protected query(): Knex.QueryBuilder;
    /**
     * tableName
     */
    tableName(): string;
    /**
     * Get the kenex connection.
     */
    abstract connection(): Knex;
    /**
     * Get the debuging state.
     */
    debug(): boolean;
}
//# sourceMappingURL=KnexRepository.d.ts.map