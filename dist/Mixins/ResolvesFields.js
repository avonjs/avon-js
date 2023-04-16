"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
const ID_1 = tslib_1.__importDefault(require("../Fields/ID"));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class ResolvesFields extends Parent {
        /**
         * Resolve the index fields.
         */
        indexFields(request, resource) {
            return this.availableFields(request)
                .filterForIndex(request, resource)
                .authorized(request)
                .resolveForDisplay(resource);
        }
        /**
         * Resolve the detail fields.
         */
        detailFields(request, resource) {
            return this.availableFields(request)
                .filterForDetail(request, resource)
                .authorized(request)
                .resolveForDisplay(resource);
        }
        /**
         * Resolve the creation fields.
         */
        creationFields(request) {
            return this.availableFields(request)
                .authorized(request)
                .onlyCreateFields(request)
                .resolve(this.resource);
        }
        /**
         * Resolve the update fields.
         */
        updateFields(request) {
            return this.resolveFields(request).onlyUpdateFields(request, this.resource);
        }
        /**
         * Resolve the association fields.
         */
        associationFields(request) {
            return this.resolveFields(request)
                .filterForIndex(request, this.rsource)
                .withoutUnresolvableFields()
                .withoutRelatableFields();
        }
        /**
         * Resolve the prunable fields.
         */
        // public prunableFields(
        //   request: AvonRequest,
        //   skipSoftDeletes = true,
        // ): FieldCollection<Field> {
        //   return this.availableFieldsOnIndexOrDetail(request)
        //     .filter((field) => {
        //       if (skipSoftDeletes && request.resourceSoftDeletes()) {
        //         return false;
        //       }
        //       return field.isPrunable();
        //     })
        //     .unique('attribute')
        //     .authorized(request)
        //     .resolveForDisplay(this.resource);
        // }
        /**
         * Resolve the filterable fields.
         */
        filterableFields(request) {
            return this.availableFieldsOnIndexOrDetail(request)
                .withOnlyFilterableFields()
                .authorized(request);
        }
        /**
         * Resolve the orderable fields.
         */
        orderableFields(request) {
            return this.availableFieldsOnIndexOrDetail(request)
                .withOnlyOrderableFields()
                .authorized(request);
        }
        /**
         * Get the fields for the given request.
         */
        resolveFields(request) {
            return this.availableFields(request).resolve(this.resource);
        }
        /**
         * Get the fields that are available for the given request.
         */
        availableFields(request) {
            const fieldsMethod = this.fieldsMethod(request);
            return new FieldCollection_1.default(this[fieldsMethod](request));
        }
        /**
         * Get the fields that are available on "index" or "detail" for the given request.
         */
        availableFieldsOnIndexOrDetail(request) {
            return this.buildAvailableFields(request, [
                'fieldsForIndex',
                'fieldsForDetail',
            ]);
        }
        /**
         * Get the fields that are available on "forms" for the given request.
         */
        availableFieldsOnForms(request) {
            return this.buildAvailableFields(request, [
                'fieldsForCreate',
                'fieldsForUpdate',
            ]);
        }
        /**
         * Get the fields that are available for the given request.
         */
        buildAvailableFields(request, methods) {
            return new FieldCollection_1.default([
                ...this.fields(request),
                ...methods.flatMap((method) => this[method](request)),
            ]);
        }
        /**
         * Compute the method to use to get the available fields.
         */
        fieldsMethod(request) {
            if (request.isResourceIndexRequest()) {
                return 'fieldsForIndex';
            }
            if (request.isResourceDetailRequest()) {
                return 'fieldsForDetail';
            }
            if (request.isCreateOrAttachRequest()) {
                return 'fieldsForCreate';
            }
            if (request.isUpdateOrUpdateAttachedRequest()) {
                return 'fieldsForUpdate';
            }
            if (request.isResourceAssociationRequest()) {
                return 'fieldsForAssociation';
            }
            return 'fields';
        }
        /**
         * Get the fields available on the entity.
         */
        fields(request) {
            return [new ID_1.default().filterable().orderable()];
        }
        /**
         * Get the fields available on the entity.
         */
        fieldsForCreate(request) {
            return this.fields(request);
        }
        /**
         * Get the fields available on the entity.
         */
        fieldsForUpdate(request) {
            return this.fields(request);
        }
        /**
         * Get the fields available on the entity.
         */
        fieldsForIndex(request) {
            return this.fields(request);
        }
        /**
         * Get the fields available on the entity.
         */
        fieldsForDetail(request) {
            return this.fields(request);
        }
        /**
         * Get the fields available on the entity.
         */
        fieldsForAssociation(request) {
            return this.fields(request);
        }
    };
};
