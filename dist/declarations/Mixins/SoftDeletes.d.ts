import { type Mixable } from './Mixable';
import { type Model } from '../Models';
import { type Repository, type Where } from '../Repositories';
export declare enum TrashedStatus {
    DEFAULT = "without",
    WITH = "with",
    ONLY = "only"
}
declare const _default: <TModel extends Model, TBase extends Mixable<Repository<TModel>>>(Parent: TBase) => (abstract new (...args: any[]) => {
    [x: string]: any;
    /**
     * Indicates that query have to include trashed records.
     */
    includeTrashedRecords: boolean;
    /**
     * Indicates that query have limit to the trashed records.
     */
    onlyTrashedRecords: boolean;
    /**
     * Delete model for the given key.
     */
    delete(key: string | number): Promise<void>;
    /**
     * Delete model for the given key.
     */
    forceDelete(key: string | number): Promise<void>;
    /**
     * Restore the delete model for given key.
     */
    restore(key: string | number): Promise<TModel>;
    /**
     * Apply soft-delete constraint.
     */
    applySoftDelete(): this;
    /**
     * Ignore soft-delete constraint.
     */
    withTrashed(): this;
    /**
     * Apply only trashed record constraints.
     */
    onlyTrashed(): this;
    /**
     * Get soft-delete constraint.
     */
    scopeSoftDelete(): Where;
    /**
     * Get only trashed records constraint.
     */
    scopeTrashedRecords(): Where;
    /**
     * Get name of `deleted_at` key.
     */
    getDeletedAtKey(): string;
    /**
     * Get value for `deleted_at` key.
     */
    getDeletedAtValue(): string;
    wheres: Where[];
    orders: import("../Repositories").Order[];
    transaction<T>(callback: () => Promise<T>): Promise<T>;
    where(where: Where | Where[]): any;
    order(order: import("../Repositories").Order | import("../Repositories").Order[]): any;
    find(key: string | number): Promise<TModel | undefined>;
    whereKey(key: string | number): any;
    whereKeys(keys: string[] | number[]): any;
    search(search: string, page?: number | undefined, perPage?: number | undefined): Promise<import("../Repositories").SearchCollection<Model>>;
    all(wheres?: Where[] | undefined): Promise<TModel[]>;
    /**
     * Apply only trashed record constraints.
     */
    first(wheres?: Where[] | undefined): Promise<TModel | undefined>;
    store(model: TModel): Promise<TModel>;
    update(model: TModel): Promise<TModel>;
    model(): TModel;
}) & TBase;
export default _default;
//# sourceMappingURL=SoftDeletes.d.ts.map