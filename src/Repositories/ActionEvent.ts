import collect, { type Collection } from 'collect.js';

import Repository, {
  Operator,
  type SearchCollection,
  type Where,
} from './Repository';
import fs from 'fs';
import os from 'os';
import path from 'path';
import Fluent from '../Models/Fluent';
import type Action from '../Actions/Action';
import { type Model } from '../Models';
import { type AvonRequest } from '../Http/Requests';
import Avon from '../Avon';

export type Searchable = (search: string, item: Model) => boolean;

export default abstract class extends Repository<Fluent> {
  /**
   * Initiate repository instance.
   */
  constructor(protected items: Model[] = []) {
    super();
    this.ensureOfDirectory();
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

    return await Promise.resolve({
      count: searched.count(),
      items: searched.slice(perPage * (page - 1), perPage).toArray(),
    });
  }

  /**
   * Find all model's for the given conditions.
   */
  async all(wheres: Where[] = []): Promise<Fluent[]> {
    return await Promise.resolve(this.where(wheres).getCollection().toArray());
  }

  /**
   * Search collection for given query string.
   */
  protected searchCollection(search: string = ''): Collection<Fluent> {
    if (search.length > 0) {
      return this.logs().filter((item: Model) => {
        return this.performSearches(search, item);
      });
    }

    return this.logs();
  }

  /**
   * Perform searches on the given item.
   */
  protected performSearches(search: string, item: Model): boolean {
    return (
      undefined !==
      this.searchables().find((searchable) => {
        return searchable(search, item);
      })
    );
  }

  /**
   * Store multiple model's into the storage.
   */
  async insert(models: Fluent[]): Promise<Fluent[]> {
    // ensure log file exists
    return await Promise.resolve(
      await Promise.all(
        models.map(async (model) => {
          return await this.store(
            model.setAttribute(model.getKeyName(), this.makeIdentifier()),
          );
        }),
      ),
    );
  }

  /**
   * Store given model into the storage.
   */
  async store(model: Fluent): Promise<Fluent> {
    // ensure log file exists
    this.ensureOfFile(this.filepath());
    // append identifier
    model.setAttribute(model.getKeyName(), this.makeIdentifier());
    // store log
    fs.appendFileSync(this.filepath(), os.EOL + model.toJson());

    return await Promise.resolve(model);
  }

  /**
   * Find first model for the given conditions.
   */
  async first(wheres: Where[] = []): Promise<Fluent> {
    this.where(wheres);

    return await Promise.resolve(this.logs().first());
  }

  /**
   * Store given model into the storage.
   */
  batchUpdate(batchId: string, models: Fluent[]): Fluent[] {
    // ensure log file exists
    this.ensureOfFile(this.filepath());
    models.forEach((model) => {
      model.setAttribute(model.getKeyName(), this.makeIdentifier());
    });

    // store log
    fs.appendFileSync(
      this.filepath(),
      os.EOL + models.map((model) => model.toJson()).join(os.EOL),
    );

    return models;
  }

  /**
   * Store given model into the storage.
   */
  async update(model: Fluent): Promise<Fluent> {
    throw new Error('Update action event is not possible.');
  }

  /**
   * Delete model for the given key.
   */
  async delete(key: string | number): Promise<void> {
    throw new Error('Delete action event is not possible.');
  }

  /**
   * Get the stored logs.
   */
  public logs(): Collection<Fluent> {
    const logs = collect(
      fs
        .readdirSync(this.storagePath())
        .flatMap((filename) => this.load(this.filepath(filename))),
    );

    return logs.filter((item: Fluent) => {
      return this.wheres.every((where) => this.checkAgainstWhere(item, where));
    });
  }

  /**
   * Apply the where constraint on the collection item.
   */
  public checkAgainstWhere(item: Fluent, where: Where): boolean {
    const value = Array.isArray(where.value)
      ? where.value
      : String(where.value);
    const resourceValue = String(item.getAttribute(where.key));

    switch (where.operator) {
      case Operator.in:
      case Operator.eq:
        // eslint-disable-next-line no-case-declarations
        const values = Array.isArray(where.value) ? where.value : [where.value];

        return values.some((value) => value === resourceValue);
      case Operator.lte:
        return resourceValue <= value;
      case Operator.gte:
        return resourceValue >= value;
      case Operator.not:
        return resourceValue !== value;
      case Operator.lt:
        return resourceValue < value;
      case Operator.gt:
        return resourceValue > value;
      default:
        return true;
    }
  }

  /**
   * Load loags from the file.
   */
  protected load(filepath: string): Fluent[] {
    return fs
      .readFileSync(filepath)
      .toString()
      .split(os.EOL)
      .map((log) => new Fluent(this.unserialize(log)));
  }

  /**
   * Serialize the log raw.
   */
  public serialize(log: Fluent): string {
    return log.toJson();
  }

  /**
   * Unserialize the log raw.
   */
  public unserialize(log: string): Record<string, any> {
    try {
      return JSON.parse(log);
    } catch (error) {
      return {};
    }
  }

  /**
   * Get the log file name.
   */
  public filepath(filename?: string): string {
    return path.join(this.storagePath(), filename ?? this.filename());
  }

  /**
   * makeIdentifier
   */
  public makeIdentifier(): string | number {
    return new Date().toISOString().substring(0, 10) + ':' + String(Date.now());
  }

  /**
   * Get the log file name.
   */
  public filename(): string {
    return new Date().toISOString().substring(0, 10) + '.log';
  }

  /**
   * logFilePath
   */
  public storagePath(): string {
    return Avon.actionEventLogPath();
  }

  /**
   * Ensure that log directory currently exists.
   */
  protected ensureOfFile(filename: string): void {
    this.ensureOfDirectory();

    if (!fs.existsSync(filename)) {
      fs.closeSync(fs.openSync(filename, 'w'));
    }
  }

  /**
   * Ensure that log directory currently exists.
   */
  protected ensureOfDirectory(): void {
    if (!fs.existsSync(this.storagePath())) {
      fs.mkdirSync(this.storagePath(), { recursive: true });
    }
  }

  /**
   * Create new instance of model.
   */
  model(): Fluent {
    return new (class extends Fluent {})();
  }

  /**
   * Get key name of the item.
   */
  searchables(): Searchable[] {
    return [];
  }

  /**
   * Fill event model for successful resource store.
   */
  public forResourceStore(request: AvonRequest, resource: Model): Fluent {
    return new Fluent({
      ...this.defaultAttributes(request, resource),
      name: 'Create',
      changes: resource.all(),
    });
  }

  /**
   * Fill event model for successful resource update.
   */
  public forResourceUpdate(
    request: AvonRequest,
    resource: Model,
    previous: Model,
  ): Fluent {
    return new Fluent({
      ...this.defaultAttributes(request, resource),
      name: 'Update',
      changes: collect(resource.all()).diffAssoc(collect(previous.all())).all(),
      original: previous.all(),
    });
  }

  /**
   * Fill event model for successful resource destroy.
   */
  public forResourceDelete(request: AvonRequest, resource: Model): Fluent {
    return new Fluent({
      ...this.defaultAttributes(request, resource),
      name: 'Delete',
      changes: resource.all(),
      original: {},
    });
  }

  /**
   * Fill event model for successful resource restore.
   */
  public forResourceRestore(request: AvonRequest, resource: Model): Fluent {
    return new Fluent({
      ...this.defaultAttributes(request, resource),
      name: 'Restore',
      changes: {},
    });
  }

  /**
   * Fill event model for successful action ran.
   */
  public forActionRan(
    request: AvonRequest,
    action: Action,
    resource: Model,
    previous: Model,
  ): Fluent {
    return new Fluent({
      ...this.defaultAttributes(request, resource),
      name: action.name(),
      original: resource.all(),
      changes: collect(resource.all()).diffAssoc(collect(previous.all())).all(),
    });
  }

  /**
   * Get the default attributes for creating a new action event.
   */
  protected defaultAttributes(
    request: AvonRequest,
    resource: Model,
  ): Record<string, any> {
    return {
      payload: request.all(),
      resource_name: request.resource().uriKey(),
      resource_id: resource.getKey(),
      model_type: resource.constructor.name,
      model_id: resource.getKey(),
      changes: {},
      original: {},
      status: 'finished',
    };
  }
}
