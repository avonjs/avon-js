import { type Collection } from 'collect.js';
import Repository, { type SearchCollection, type Where } from './Repository';
import Fluent from '../Models/Fluent';
import type Action from '../Actions/Action';
import { type Model } from '../Models';
import { type AvonRequest } from '../Http/Requests';
export type Searchable = (search: string, item: Model) => boolean;
export default abstract class extends Repository<Fluent> {
    protected items: Model[];
    /**
     * Initiate repository instance.
     */
    constructor(items?: Model[]);
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
     * Perform searches on the given item.
     */
    protected performSearches(search: string, item: Model): boolean;
    /**
     * Store multiple model's into the storage.
     */
    insert(models: Fluent[]): Promise<Fluent[]>;
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
    batchUpdate(batchId: string, models: Fluent[]): Fluent[];
    /**
     * Store given model into the storage.
     */
    update(model: Fluent): Promise<Fluent>;
    /**
     * Delete model for the given key.
     */
    delete(key: string | number): Promise<void>;
    /**
     * Get the stored logs.
     */
    logs(): Collection<Fluent>;
    /**
     * Apply the where constraint on the collection item.
     */
    checkAgainstWhere(item: Fluent, where: Where): boolean;
    /**
     * Load loags from the file.
     */
    protected load(filepath: string): Fluent[];
    /**
     * Serialize the log raw.
     */
    serialize(log: Fluent): string;
    /**
     * Unserialize the log raw.
     */
    unserialize(log: string): Record<string, any>;
    /**
     * Get the log file name.
     */
    filepath(filename?: string): string;
    /**
     * makeIdentifier
     */
    makeIdentifier(): string | number;
    /**
     * Get the log file name.
     */
    filename(): string;
    /**
     * logFilePath
     */
    storagePath(): string;
    /**
     * Ensure that log directory currently exists.
     */
    protected ensureOfFile(filename: string): void;
    /**
     * Ensure that log directory currently exists.
     */
    protected ensureOfDirectory(): void;
    /**
     * Create new instance of model.
     */
    model(): Fluent;
    /**
     * Get key name of the item.
     */
    searchables(): Searchable[];
    /**
     * Fill event model for successful resource store.
     */
    forResourceStore(request: AvonRequest, resource: Model): Fluent;
    /**
     * Fill event model for successful resource update.
     */
    forResourceUpdate(request: AvonRequest, resource: Model, previous: Model): Fluent;
    /**
     * Fill event model for successful resource destroy.
     */
    forResourceDelete(request: AvonRequest, resource: Model): Fluent;
    /**
     * Fill event model for successful resource restore.
     */
    forResourceRestore(request: AvonRequest, resource: Model): Fluent;
    /**
     * Fill event model for successful action ran.
     */
    forActionRan(request: AvonRequest, action: Action, resource: Model, previous: Model): Fluent;
    /**
     * Get the default attributes for creating a new action event.
     */
    protected defaultAttributes(request: AvonRequest, resource: Model): Record<string, any>;
}
//# sourceMappingURL=ActionEvent.d.ts.map