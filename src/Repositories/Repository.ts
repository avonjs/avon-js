import type Model from '../Models/Model';

export enum Operator {
  eq = '=',
  not = '!=',
  lt = '<',
  lte = '<=',
  gt = '>',
  gte = '>=',
  in = 'in',
  like = 'like',
}

export interface Where {
  key: string;
  value: any;
  operator: Operator;
}

export enum Direction {
  ASC = 'asc',
  DESC = 'desc',
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
  public wheres: Where[] = [];

  /**
   * List of applied orderings.
   */
  public orders: Order[] = [];

  /**
   * Run transaction on the storage.
   */
  public async transaction<T>(callback: () => Promise<T>): Promise<T> {
    return await Promise.resolve(callback());
  }

  /**
   * Apply condition('s) to the repository.
   */
  public where(where: Where | Where[]): this {
    const wheres = Array.isArray(where) ? where : [where];

    wheres.forEach((where) => this.wheres.push(where));

    return this;
  }

  /**
   * Apply condition to repository.
   */
  public order(order: Order | Order[]): this {
    const orders = Array.isArray(order) ? order : [order];

    orders.forEach((order) => this.orders.push(order));

    return this;
  }

  /**
   * Find model for the given key.
   */
  async find(key: string | number): Promise<TModel | undefined> {
    return await this.whereKey(key).first();
  }

  /**
   * Apply primary key condition
   */
  public whereKey(key: string | number): this {
    return this.where({
      key: this.model().getKeyName(),
      value: key,
      operator: Operator.eq,
    });
  }

  /**
   * Apply primary key condition
   */
  public whereKeys(keys: string[] | number[]): this {
    return this.where({
      key: this.model().getKeyName(),
      value: keys,
      operator: Operator.in,
    });
  }

  /**
   * Search storage for given query string.
   */
  abstract search(
    search: string,
    page?: number,
    perPage?: number,
  ): Promise<SearchCollection>;

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
  public async forceDelete(key: string | number): Promise<void> {
    await this.delete(key);
  }

  /**
   * Create new instance of model.
   */
  abstract model(): TModel;
}
