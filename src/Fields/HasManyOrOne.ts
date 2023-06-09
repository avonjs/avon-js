import { type Model } from '../Models';
import { Operator } from '../Repositories/Repository';
import type Repository from '../Repositories/Repository';
import { guessForeignKey } from './ResourceRelationshipGuesser';

import { type AvonRequest } from '../Http/Requests';
import { type FilterableCallback } from '../Mixins/Filterable';
import Relation from './Relation';

export default abstract class HasManyOrOne extends Relation {
  /**
   * Indicates related resources have to load.
   */
  public loaded: boolean = true;

  constructor(resource: string, relation?: string) {
    super(resource, relation);
    this.foreignKey = '';
    this.ownerKey = '';
  }

  /**
   * Get attribute that holde the related model key.
   */
  public foreignKeyName(request: AvonRequest): string {
    return String(this.foreignKey).length > 0
      ? this.foreignKey
      : guessForeignKey(request.resource());
  }

  /**
   * Get attribute that holde the related model key.
   */
  public ownerKeyName(request: AvonRequest): string {
    return String(this.ownerKey).length > 0
      ? this.ownerKey
      : request.model().getKeyName();
  }

  /**
   * Define the default filterable callback.
   */
  public defaultFilterableCallback(): FilterableCallback {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    return async (
      request: AvonRequest,
      repository: Repository<Model>,
      value: any,
    ) => {
      const realteds = await this.relatedResource
        .repository()
        .whereKeys(Array.isArray(value) ? value : [value])
        .all();

      repository.where({
        key: this.ownerKeyName(request),
        value: realteds.map((model) => {
          return model.getAttribute(this.foreignKeyName(request));
        }),
        operator: Operator.in,
      });
    };
  }

  /**
   * Resolve related value for given resources.
   */
  async resolveRelatables(
    request: AvonRequest,
    resources: Model[],
  ): Promise<any> {
    const relatables = await this.SearchRelatables(request, resources);

    resources.forEach((resource) => {
      resource.setAttribute(
        this.attribute,
        relatables.filter((relatable) => {
          const relatableKey = String(
            relatable.getAttribute(this.foreignKeyName(request)),
          );
          const resourceKey = String(
            resource.getAttribute(this.ownerKeyName(request)),
          );

          return relatableKey === resourceKey;
        }),
      );
    });
  }

  /**
   * Get related models for given resources.
   */
  public async SearchRelatables(
    request: AvonRequest,
    resources: Model[],
  ): Promise<Model[]> {
    return await this.relatedResource
      .repository()
      .where({
        key: this.foreignKeyName(request),
        value: resources
          .map((resource) => {
            return resource.getAttribute(this.ownerKeyName(request));
          })
          .filter((value) => value),
        operator: Operator.in,
      })
      .all();
  }

  /**
   * Determine field is fillable or not.
   */
  public fillable(): boolean {
    return false;
  }
}
