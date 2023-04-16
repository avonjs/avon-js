import { type AvonRequest } from '../Http/Requests';
import { Collection } from 'collect.js';
import type Field from '../Fields/Field';
import { type Model } from '../Models';
import Relation from '../Fields/Relation';
export default class FieldCollection<TItem extends Field = Field> extends Collection<TItem> {
    /**
     * Find a given field by its attribute.
     */
    findFieldByAttribute(attribute: string, defaultValue?: any): TItem | undefined;
    /**
     * Resolve value of fields.
     */
    resolve(resource: Model): FieldCollection<TItem>;
    /**
     * Resolve value of fields for display.
     */
    resolveForDisplay(resource: Model): FieldCollection<TItem>;
    /**
     * Remove non-creation fields from the collection.
     */
    onlyCreateFields(request: AvonRequest): FieldCollection<TItem>;
    /**
     * Remove non-update fields from the collection.
     */
    onlyUpdateFields(request: AvonRequest, resource: Model): FieldCollection<TItem>;
    /**
     * Filter fields for showing on index.
     */
    filterForIndex(request: AvonRequest, resource: Model): FieldCollection<TItem>;
    /**
     * Filter fields for showing on detail.
     */
    filterForDetail(request: AvonRequest, resource: Model): FieldCollection<TItem>;
    /**
     * Reject if the field supports Filterable Field.
     */
    withOnlyFilterableFields(): FieldCollection<Field>;
    /**
     * Reject if the field supports Orderable Field.
     */
    withOnlyOrderableFields(): FieldCollection<Field>;
    /**
     * Reject if the field supports Relatable Field.
     */
    withOnlyRelatableFields(): FieldCollection<Relation>;
    /**
     * Reject if the field is rellatable Field.
     */
    withoutRelatableFields(): FieldCollection<TItem>;
    /**
     * Reject if the field is rellatable Field.
     */
    withoutUnfillableFields(): FieldCollection<TItem>;
    /**
     * Reject if the field is rellatable Field.
     */
    withoutUnresolvableFields(): FieldCollection<TItem>;
    /**
     * Filter elements should be displayed for the given request.
     */
    authorized(request: AvonRequest): FieldCollection<TItem>;
}
//# sourceMappingURL=FieldCollection.d.ts.map