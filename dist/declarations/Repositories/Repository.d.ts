import type Model from '../Models/Model';
export declare enum Operator {
    eq = "=",
    not = "!=",
    lt = "<",
    lte = "<=",
    gt = ">",
    gte = ">=",
    in = "in",
    like = "like"
}
export interface Where {
    key: string;
    value: any;
    operator: Operator;
}
export declare enum Direction {
    ASC = "asc",
    DESC = "desc"
}
export interface Order {
    key: string;
    direction: Direction;
}
export interface SearchCollection<TModel extends Model = Model> {
    items: TModel[];
    count: number;
}
export default abstract class Repository<TModel extends Model = Model> {
    [x: string]: any;
    /**
     * List of applied conditions.
     */
    wheres: Where[];
    /**
     * List of applied orderings.
     */
    orders: Order[];
    /**
     * Run transaction on the storage.
     */
    transaction<T>(callback: () => Promise<T>): Promise<T>;
    /**
     * Apply condition('s) to the repository.
     */
    where(where: Where | Where[]): this;
    /**
     * Apply condition to repository.
     */
    order(order: Order | Order[]): this;
    /**
     * Find model for the given key.
     */
    find(key: string | number): Promise<TModel | undefined>;
    /**
     * Apply primary key condition
     */
    whereKey(key: string | number): this;
    /**
     * Apply primary key condition
     */
    whereKeys(keys: string[] | number[]): this;
    /**
     * Search storage for given query string.
     */
    abstract search(search: string, page?: number, perPage?: number): Promise<SearchCollection>;
    /**
     * Find all model's for the given conditions.
     */
    abstract all(wheres?: Where[]): Promise<TModel[]>;
    /**
     * Find first model for the given conditions.
     */
    abstract first(wheres?: Where[]): Promise<TModel | undefined>;
    /**
     * Store given model into the storage.
     */
    abstract store(model: TModel): Promise<TModel>;
    /**
     * Update the given model in storage.
     */
    abstract update(model: TModel): Promise<TModel>;
    /**
     * Delete model for the given key.
     */
    abstract delete(key: string | number): Promise<void>;
    /**
     * Delete model for the given key.
     */
    forceDelete(key: string | number): Promise<void>;
    /**
     * Create new instance of model.
     */
    abstract model(): TModel;
}
//# sourceMappingURL=Repository.d.ts.map