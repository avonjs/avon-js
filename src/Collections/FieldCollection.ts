import { type AvonRequest } from '../Http/Requests';
import { Collection } from 'collect.js';
import type Field from '../Fields/Field';
import { type Model } from '../Models';
import Relation from '../Fields/Relation';

export default class FieldCollection<
  TItem extends Field = Field,
> extends Collection<TItem> {
  /**
   * Find a given field by its attribute.
   */
  public findFieldByAttribute(
    attribute: string,
    defaultValue?: any,
  ): TItem | undefined {
    return this.first<TItem>(
      (field) => field.attribute === attribute,
      defaultValue,
    );
  }

  /**
   * Resolve value of fields.
   */
  public resolve(resource: Model): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.each((field) => field.resolve(resource)),
    );
  }

  /**
   * Resolve value of fields for display.
   */
  public resolveForDisplay(resource: Model): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.each((field) => field.resolveForDisplay(resource)),
    );
  }

  /**
   * Remove non-creation fields from the collection.
   */
  public onlyCreateFields(request: AvonRequest): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.isShownOnCreation(request)),
    );
  }

  /**
   * Remove non-update fields from the collection.
   */
  public onlyUpdateFields(
    request: AvonRequest,
    resource: Model,
  ): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.isShownOnUpdate(request, resource)),
    );
  }

  /**
   * Filter fields for showing on index.
   */
  public filterForIndex(
    request: AvonRequest,
    resource: Model,
  ): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.isShownOnIndex(request, resource)).values(),
    );
  }

  /**
   * Filter fields for showing on detail.
   */
  public filterForDetail(
    request: AvonRequest,
    resource: Model,
  ): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.isShownOnDetail(request, resource)).values(),
    );
  }

  /**
   * Reject if the field supports Filterable Field.
   */
  public withOnlyFilterableFields(): FieldCollection<Field> {
    return new FieldCollection<Field>(
      this.filter((field) => field.isFilterable()).values(),
    );
  }

  /**
   * Reject if the field supports Orderable Field.
   */
  public withOnlyOrderableFields(): FieldCollection<Field> {
    return new FieldCollection<Field>(
      this.filter((field) => field.isOrderable()).values(),
    );
  }

  /**
   * Reject if the field supports Relatable Field.
   */
  public withOnlyRelatableFields(): FieldCollection<Relation> {
    return new FieldCollection<Relation>(
      this.filter(
        (field) => field instanceof Relation && field.isLoaded(),
      ).values(),
    );
  }

  /**
   * Reject if the field is rellatable Field.
   */
  public withoutRelatableFields(): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.reject((field) => field instanceof Relation).values(),
    );
  }

  /**
   * Reject if the field is rellatable Field.
   */
  public withoutUnfillableFields(): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.fillable()).values(),
    );
  }

  /**
   * Reject if the field is rellatable Field.
   */
  public withoutUnresolvableFields(): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.resolvable()).values(),
    );
  }

  /**
   * Filter elements should be displayed for the given request.
   */
  public authorized(request: AvonRequest): FieldCollection<TItem> {
    return new FieldCollection<TItem>(
      this.filter((field) => field.authorize(request)).values(),
    );
  }
}
