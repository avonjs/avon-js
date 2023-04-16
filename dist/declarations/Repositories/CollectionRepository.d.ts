import { Collection } from 'collect.js';
import Fluent from '../Models/Fluent';
import Repository, { type SearchCollection, type Where } from './Repository';
export type Searchable = (search: string, item: Fluent) => boolean;
export default abstract class CollectionRepository extends Repository<Fluent> {
    /**
     * Collection of the items.
     */
    protected collection: Collection<Fluent>;
    /**
     * Initiate repository instance.
     */
    constructor(items?: any[]);
    /**
     * Resolve items from the store path.
     */
    protected resolveItems(): Record<string | number, any>;
    /**
     * Prepare given items for collection.
     */
    protected prepareItems(items: any[]): Fluent[];
    /**
     * Search storage for given query string.
     */
    search(search: string, page?: number, perPage?: number): Promise<SearchCollection<Fluent>>;
    /**
     * Find all model's for the given conditions.
     */
    all(wheres?: Where[]): Promise<Fluent[]>;
    /**
     * Search collection for given query string.
     */
    protected searchCollection(search?: string): Collection<Fluent>;
    /**
     * Get the collection with applied constraints.
     */
    protected getCollection(): Collection<Fluent>;
    /**
     * Apply the where constraint on the collection item.
     */
    protected checkAgainstWhere(item: Fluent, where: Where): boolean;
    /**
     * Perform searches on the given item.
     */
    protected performSearches(search: string, item: Fluent): boolean;
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
     * Write given items to storage.
     */
    protected write(items: Fluent[]): any;
    /**
     * Create new instance of model.
     */
    model(): Fluent;
    /**
     * Generate new id for storing item.
     */
    newId(): string | number;
    /**
     * Get key name of the item.
     */
    abstract searchables(): Searchable[];
    /**
     * Get path of the stored files.
     */
    abstract filepath(): string;
}
//# sourceMappingURL=CollectionRepository.d.ts.map