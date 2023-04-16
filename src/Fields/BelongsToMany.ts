import { Operator } from '../Repositories/Repository';

import Avon from '../Avon';
import { type AvonRequest } from '../Http/Requests';
import type Field from './Field';
import { type Model } from '../Models';
import Relation from './Relation';
import { guessForeignKey } from './ResourceRelationshipGuesser';
import { slugify } from '../helpers';
import collect from 'collect.js';
import Joi from 'joi';
import { type Rules } from '../Mixins/PerformsValidation';
import { type Resource } from '..';
import { RuntimeException } from '../Exceptions';

export type PivotFieldCallback = (request: AvonRequest) => Field[];

export default class BelongsToMany extends Relation {
  /**
   * The pivot resource instance
   */
  public pivotResource: Resource;

  /**
   * The foreign key of the related model.
   * The attribute name that holds the parent model key.
   */
  protected resourceForeignKey?: string;

  /**
   * The associated key on the related model.
   * Defaults to primary key of related model.
   */
  protected resourceOwnerKey?: string;

  /**
   * Indicates fields uses to update pivot table.
   */
  protected pivotFields: PivotFieldCallback = (request: AvonRequest) => [];

  constructor(resource: string, pivot: string, attribute?: string) {
    super(resource);

    const pivotResource = Avon.resourceForKey(pivot);

    RuntimeException.when(
      pivotResource === undefined,
      `Invalid pivot:${pivot} preapared for realtion ${resource}`,
    );

    this.pivotResource = pivotResource as Resource;
    this.attribute =
      attribute ?? slugify(this.pivotResource.constructor.name, '_');

    this.nullable(true, (value) => !Array.isArray(value) || value.length === 0);
  }

  /**
   * Determine pivot fields.
   */
  public pivots(callback: PivotFieldCallback): this {
    this.pivotFields = callback;

    return this;
  }

  /**
   * Get the validation rules for this field.
   */
  public getRules(request: AvonRequest): Rules {
    const rules = super.getRules(request);
    const pivotFields = this.pivotFields(request);
    const pivotRules = this.pivotResource.prepareRuelsForValidator(
      pivotFields.map((field) => field.getRules(request)),
    );

    return {
      ...rules,
      [this.attribute]: rules[this.attribute].concat(
        pivotFields.length === 0
          ? Joi.array()
              .items(Joi.string(), Joi.number())
              .external(this.existenceRule(request))
          : Joi.array().items(
              Joi.object(pivotRules).append({
                key: Joi.alternatives(Joi.string(), Joi.number()).external(
                  this.existenceRule(request),
                ),
              }),
            ),
      ),
    };
  }

  /**
   * Get Joi rule to validate resource existance.
   */
  protected existenceRule(
    request: AvonRequest,
  ): Joi.ExternalValidationFunction {
    return async (value, helpers) => {
      const relateds = await this.relatedResource
        .repository()
        .where({
          key: this.ownerKeyName(request),
          operator: Operator.eq,
          value,
        })
        .first();

      if (relateds === undefined) {
        return helpers.error('any.invalid');
      }
    };
  }

  /**
   * Hydrate the given attribute on the model based on the incoming request.
   */
  public fillForAction<TModel extends Model>(
    request: AvonRequest,
    model: TModel,
  ): any {}

  /**
   * Hydrate the given attribute on the model based on the incoming request.
   */
  protected fillAttributeFromRequest<TModel extends Model>(
    request: AvonRequest,
    requestAttribute: string,
    model: TModel,
    attribute: string,
  ): any {
    if (!request.exists(requestAttribute)) {
      return;
    }

    return async () => {
      // first we clear old attachments
      await this.clearAttachments(request, model);
      // then fill with new attachemnts
      const repository = this.pivotResource.repository();

      await Promise.all(
        this.prepareRelations(request, requestAttribute).map(async (pivot) => {
          pivot.setAttribute(
            this.resourceForeignKeyName(request),
            model.getAttribute(this.resourceOwnerKeyName(request)),
          );

          return await repository.store(pivot);
        }),
      );
    };
  }

  /**
   * Detach all related models.
   */
  protected async clearAttachments(
    request: AvonRequest,
    model: Model,
  ): Promise<any> {
    const repository = this.pivotResource.repository();
    const attachments = await repository
      .where({
        key: this.foreignKeyName(request),
        value: model.getAttribute(this.ownerKeyName(request)),
        operator: Operator.eq,
      })
      .all();

    await Promise.all(
      attachments.map(async (attached) => {
        // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
        return await repository.forceDelete(attached.getKey());
      }),
    );
  }

  /**
   * Set related model foreign key.
   */
  public setResourceForeignKey(resourceForeignKey: string): this {
    this.resourceForeignKey = resourceForeignKey;

    return this;
  }

  /**
   * Get attribute that holde the related model key.
   */
  public resourceForeignKeyName(request: AvonRequest): string {
    return this.resourceForeignKey ?? guessForeignKey(request.resource());
  }

  /**
   * Set the related model owner key.
   */
  public setResourceOwnerKey(resourceOwnerKey: string): this {
    this.resourceOwnerKey = resourceOwnerKey;

    return this;
  }

  /**
   * Get attribute that holde the related model key.
   */
  public resourceOwnerKeyName(request: AvonRequest): string {
    return this.resourceOwnerKey ?? request.model().getKeyName();
  }

  /**
   * preappio
   */
  public prepareRelations(
    request: AvonRequest,
    requestAttribute: string,
  ): Model[] {
    const pivotFields = this.pivotFields(request);
    const values = collect(request.array(requestAttribute));

    return values
      .map((related, index: number) => {
        const model = this.pivotResource.repository().model();

        model.setAttribute(
          this.foreignKeyName(request),
          pivotFields.length > 0 ? related.key : related,
        );

        pivotFields.forEach((field) => {
          field.fillInto(
            request,
            model,
            field.attribute,
            `${requestAttribute}.${index}.${field.attribute}`,
          );
        });

        return model;
      })
      .all();
  }

  /**
   * Resolve related value for given resources.
   */
  async resolveRelatables(
    request: AvonRequest,
    resources: Model[],
  ): Promise<any> {
    const relatables = await this.SearchRelatables(request, resources);
    const foreignKeyName = this.resourceForeignKeyName(request);
    const ownerKeyName = this.resourceOwnerKeyName(request);

    resources.forEach((resource) => {
      resource.setAttribute(
        this.attribute,
        relatables.filter((relatable) => {
          const pivot = relatable.getAttribute('pivot');

          return (
            String(pivot[foreignKeyName]) ===
            String(resource.getAttribute(ownerKeyName))
          );
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
    const foreignKey = this.foreignKeyName(request);
    const ownerKey = this.ownerKeyName(request);
    const pivots = await this.pivotResource
      .repository()
      .where({
        key: this.resourceForeignKeyName(request),
        value: resources
          .map((resource) => {
            return resource.getAttribute(this.resourceOwnerKeyName(request));
          })
          .filter((value) => value),
        operator: Operator.in,
      })
      .all();

    const relateds = await this.relatedResource
      .repository()
      .where({
        key: ownerKey,
        value: pivots.map((pivot) => pivot.getAttribute(foreignKey)),
        operator: Operator.in,
      })
      .all();

    relateds.forEach((related) => {
      related.setAttribute(
        'pivot',
        pivots.find((pivot) => {
          return (
            String(pivot.getAttribute(foreignKey)) ===
            String(related.getAttribute(ownerKey))
          );
        }),
      );
    });

    return relateds;
  }

  /**
   * Get the value considered as null.
   */
  public nullValue(): any {
    return [];
  }

  /**
   * Determine field is filterable or not.
   */
  public isFilterable(): boolean {
    return false;
  }
}
