import collect, { Collection } from 'collect.js';
import Fluent from '../Models/Fluent';
import Repository, {
  Direction,
  Operator,
  type SearchCollection,
  type Order,
  type Where,
} from './Repository';
import fs from 'fs';

export type Searchable = (search: string, item: Fluent) => boolean;

export default abstract class CollectionRepository extends Repository<Fluent> {
  /**
   * Collection of the items.
   */
  protected collection: Collection<Fluent>;

  /**
   * Initiate repository instance.
   */
  constructor(items: any[] = []) {
    super();
    this.collection = new Collection<Fluent>(
      this.prepareItems(items.concat(this.resolveItems())),
    );
  }

  /**
   * Resolve items from the store path.
   */
  protected resolveItems(): Record<string | number, any> {
    try {
      return JSON.parse(fs.readFileSync(this.filepath()).toString()).filter(
        (item: any) => collect(item).isNotEmpty(),
      );
    } catch (error) {
      console.log(error);

      return {};
    }
  }

  /**
   * Prepare given items for collection.
   */
  protected prepareItems(items: any[]): Fluent[] {
    return items.map((item) => {
      return item instanceof Fluent ? item : new Fluent(item);
    });
  }

  /**
   * Search storage for given query string.
   */
  async search(
    search: string,
    page: number = 1,
    perPage: number = 15,
  ): Promise<SearchCollection<Fluent>> {
    const searched = this.searchCollection(search);

    return {
      count: searched.count(),
      items: searched.slice(perPage * (page - 1), perPage).toArray(),
    };
  }

  /**
   * Find all model's for the given conditions.
   */
  async all(wheres: Where[] = []): Promise<Fluent[]> {
    return this.where(wheres).getCollection().toArray();
  }

  /**
   * Search collection for given query string.
   */
  protected searchCollection(search: string = ''): Collection<Fluent> {
    const collection = this.getCollection();

    if (search.length > 0) {
      return collection.filter((item: Fluent) => {
        return this.performSearches(search, item);
      });
    }

    return collection;
  }

  /**
   * Get the collection with applied constraints.
   */
  protected getCollection(): Collection<Fluent> {
    let collection = this.collection.filter((item) => {
      return this.wheres.every((where) => this.checkAgainstWhere(item, where));
    });

    this.orders.forEach((order: Order) => {
      collection = collection[
        order.direction === Direction.ASC ? 'sortBy' : 'sortByDesc'
      ](order.key);
    });

    return collection;
  }

  /**
   * Apply the where constraint on the collection item.
   */
  protected checkAgainstWhere(item: Fluent, where: Where): boolean {
    switch (where.operator) {
      case Operator.in:
      case Operator.eq:
        // eslint-disable-next-line no-case-declarations
        const values = Array.isArray(where.value) ? where.value : [where.value];

        return values.some(
          (value) => String(value) === String(item.getAttribute(where.key)),
        );
      case Operator.lte:
        return item.getAttribute(where.key) <= where.value;
      case Operator.gte:
        return item.getAttribute(where.key) >= where.value;
      case Operator.not:
        return String(item.getAttribute(where.key)) !== String(where.value);
      case Operator.lt:
        return item.getAttribute(where.key) < where.value;
      case Operator.gt:
        return item.getAttribute(where.key) > where.value;
      case Operator.like:
        return new RegExp(where.value.replace(/%/g, '.*')).test(
          item.getAttribute(where.key),
        );
      default:
        return true;
    }
  }

  /**
   * Perform searches on the given item.
   */
  protected performSearches(search: string, item: Fluent): boolean {
    return (
      undefined !==
      this.searchables().find((searchable) => {
        return searchable(search, item);
      })
    );
  }

  /**
   * Store given model into the storage.
   */
  async store(model: Fluent): Promise<Fluent> {
    this.write(
      this.collection
        .push(
          model.setAttribute(
            model.getKeyName(),
            model.getKey() ?? this.newId(),
          ),
        )
        .all(),
    );

    return model;
  }

  /**
   * Find first model for the given conditions.
   */
  async first(wheres: Where[] = []): Promise<Fluent> {
    this.where(wheres);

    return this.getCollection().first();
  }

  /**
   * Store given model into the storage.
   */
  async update(model: Fluent): Promise<Fluent> {
    this.write(
      this.collection
        .map((item) => {
          return String(item.getKey()) === String(model.getKey())
            ? model
            : item;
        })
        .all(),
    );

    return model;
  }

  /**
   * Delete model for the given key.
   */
  async delete(key: string | number): Promise<void> {
    this.write(
      this.getCollection()
        .filter((model) => String(model.getKey()) !== String(key))
        .all(),
    );
  }

  /**
   * Write given items to storage.
   */
  protected write(items: Fluent[]): any {
    fs.writeFileSync(
      this.filepath(),
      JSON.stringify(items.map((item) => item.all())),
    );
  }

  /**
   * Create new instance of model.
   */
  model(): Fluent {
    return new Fluent();
  }

  /**
   * Generate new id for storing item.
   */
  public newId(): string | number {
    return Date.now();
  }

  /**
   * Get key name of the item.
   */
  abstract searchables(): Searchable[];

  /**
   * Get path of the stored files.
   */
  abstract filepath(): string;
}
