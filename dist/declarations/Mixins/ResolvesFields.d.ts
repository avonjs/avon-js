import { type AvonRequest } from '../Http/Requests';
import type Field from '../Fields/Field';
import FieldCollection from '../Collections/FieldCollection';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => {
    new (...args: any[]): {
        [x: string]: any;
        /**
         * Resolve the index fields.
         */
        indexFields(request: AvonRequest, resource: Model): FieldCollection;
        /**
         * Resolve the detail fields.
         */
        detailFields(request: AvonRequest, resource: Model): FieldCollection;
        /**
         * Resolve the creation fields.
         */
        creationFields(request: AvonRequest): FieldCollection;
        /**
         * Resolve the update fields.
         */
        updateFields(request: AvonRequest): FieldCollection;
        /**
         * Resolve the association fields.
         */
        associationFields(request: AvonRequest): FieldCollection;
        /**
         * Resolve the prunable fields.
         */
        /**
         * Resolve the filterable fields.
         */
        filterableFields(request: AvonRequest): FieldCollection<Field>;
        /**
         * Resolve the orderable fields.
         */
        orderableFields(request: AvonRequest): FieldCollection<Field>;
        /**
         * Get the fields for the given request.
         */
        resolveFields(request: AvonRequest): FieldCollection;
        /**
         * Get the fields that are available for the given request.
         */
        availableFields(request: AvonRequest): FieldCollection;
        /**
         * Get the fields that are available on "index" or "detail" for the given request.
         */
        availableFieldsOnIndexOrDetail(request: AvonRequest): FieldCollection;
        /**
         * Get the fields that are available on "forms" for the given request.
         */
        availableFieldsOnForms(request: AvonRequest): FieldCollection;
        /**
         * Get the fields that are available for the given request.
         */
        buildAvailableFields(request: AvonRequest, methods: string[]): FieldCollection;
        /**
         * Compute the method to use to get the available fields.
         */
        fieldsMethod(request: AvonRequest): string;
        /**
         * Get the fields available on the entity.
         */
        fields(request: AvonRequest): Field[];
        /**
         * Get the fields available on the entity.
         */
        fieldsForCreate(request: AvonRequest): Field[];
        /**
         * Get the fields available on the entity.
         */
        fieldsForUpdate(request: AvonRequest): Field[];
        /**
         * Get the fields available on the entity.
         */
        fieldsForIndex(request: AvonRequest): Field[];
        /**
         * Get the fields available on the entity.
         */
        fieldsForDetail(request: AvonRequest): Field[];
        /**
         * Get the fields available on the entity.
         */
        fieldsForAssociation(request: AvonRequest): Field[];
    };
} & Tbase;
export default _default;
//# sourceMappingURL=ResolvesFields.d.ts.map