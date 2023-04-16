"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const ValidationException_1 = tslib_1.__importDefault(require("../Exceptions/ValidationException"));
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class PerformsValidation extends Parent {
        /**
         * Validate a resource creation request.
         *
         * @throws ValidationException
         */
        async validateForCreation(request) {
            await this.validatorForCreation(request)
                .validateAsync(request.all(), { abortEarly: false })
                .then((value) => this.afterCreationValidation(request, value))
                .catch((error) => {
                ValidationException_1.default.throw(error);
            });
        }
        /**
         * Create a validator instance for a resource creation request.
         */
        validatorForCreation(request) {
            return joi_1.default.object(this.rulesForCreation(request));
        }
        /**
         * Get the validation rules for a resource creation request.
         */
        rulesForCreation(request) {
            return this.formatRules(request, this.prepareRuelsForValidator(request
                .newResource()
                .creationFields(request)
                .flatMap((field) => field.getCreationRules(request))
                .all()));
        }
        /**
         * Validate a resource update request.
         *
         * @throws \Illuminate\Validation\ValidationException
         */
        async validateForUpdate(request) {
            await this.validatorForUpdate(request)
                .validateAsync(request.all(), { abortEarly: false })
                .then((value) => this.afterUpdateValidation(request, value))
                .catch((error) => {
                ValidationException_1.default.throw(error);
            });
        }
        /**
         * Create a validator instance for a resource update request.
         */
        validatorForUpdate(request) {
            return joi_1.default.object(this.rulesForUpdate(request));
        }
        /**
         * Get the validation rules for a resource update request.
         */
        rulesForUpdate(request) {
            return this.formatRules(request, this.prepareRuelsForValidator(request
                .newResource()
                .creationFields(request)
                .map((field) => field.getUpdateRules(request))
                .all()));
        }
        /**
         * Preapare given rules for validator.
         */
        prepareRuelsForValidator(rules) {
            return (0, collect_js_1.default)(rules)
                .flatMap((rules) => Object.keys(rules).map((key) => [key, rules[key]]))
                .mapWithKeys((rules) => rules)
                .all();
        }
        /**
         * Perform any final formatting of the given validation rules.
         */
        formatRules(request, rules) {
            return rules;
        }
        /**
         * Handle any post-validation processing.
         */
        afterValidation(request, validator) {
            //
        }
        /**
         * Handle any post-creation validation processing.
         */
        afterCreationValidation(request, validator) {
            //
        }
        /**
         * Handle any post-update validation processing.
         */
        afterUpdateValidation(request, validator) {
            //
        }
    };
};
