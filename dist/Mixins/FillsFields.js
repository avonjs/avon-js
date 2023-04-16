"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class FillsFields extends Parent {
        /**
         * Fill a new model instance using the given request.
         */
        fillForCreation(request, model) {
            return this.fillFields(request, model, request
                .newResource(model)
                .creationFields(request)
                .withoutUnfillableFields());
        }
        /**
         * Fill a new model instance using the given request.
         */
        fillForUpdate(request, model) {
            return this.fillFields(request, model, request
                .newResource(model)
                .updateFields(request)
                .withoutUnfillableFields());
        }
        /**
         * Fill the given fields for the model.
         */
        fillFields(request, model, fields) {
            return [
                model,
                fields
                    .map((field) => field.fill(request, model))
                    .filter((callback) => typeof callback === 'function')
                    .values()
                    .all(),
            ];
        }
    };
};
