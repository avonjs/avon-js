"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const FieldCollection_1 = tslib_1.__importDefault(require("../Collections/FieldCollection"));
const ValidationException_1 = tslib_1.__importDefault(require("../Exceptions/ValidationException"));
const Response_1 = tslib_1.__importDefault(require("../Http/Responses/Response"));
const AuthorizedToSee_1 = tslib_1.__importDefault(require("../Mixins/AuthorizedToSee"));
const Fluent_1 = tslib_1.__importDefault(require("../Models/Fluent"));
const SuccessfulResponse_1 = tslib_1.__importDefault(require("../Http/Responses/SuccessfulResponse"));
const HasSchema_1 = tslib_1.__importDefault(require("../Mixins/HasSchema"));
class Action extends (0, HasSchema_1.default)((0, AuthorizedToSee_1.default)(class {
})) {
    constructor() {
        super(...arguments);
        /**
         * Indicates if the action can be run without any models.
         */
        this.standaloneAction = false;
    }
    /**
     * Execute the action for the given request.
     */
    async handleRequest(request) {
        const fields = this.resolveFields(request);
        const models = (this.isStandalone() ? [] : await request.models()).filter((model) => this.authorizedToRun(request, model));
        const changes = models.map((original) => {
            return {
                original,
                previous: new Fluent_1.default(Object.assign({}, original.all())),
            };
        });
        const results = await this.handle(fields, models);
        const actionReposiory = request.resource().actionRepository(request);
        await actionReposiory.insert(changes.map(({ original, previous }) => {
            return actionReposiory.forActionRan(request, this, original, previous);
        }));
        return results instanceof Response_1.default ? results : this.respondSuccess();
    }
    /**
     * Resolve the creation fields.
     */
    resolveFields(request) {
        const model = new Fluent_1.default();
        this.availableFields(request).authorized(request).resolve(model);
        return model;
    }
    /**
     * Determine if the action is executable for the given request.
     */
    authorizedToRun(request, model) {
        return this.runCallback != null
            ? // eslint-disable-next-line no-useless-call
                this.runCallback.apply(this, [request, model])
            : true;
    }
    /**
     * Validate an action for incoming request.
     *
     * @throws {ValidationException}
     */
    async validate(request) {
        await this.validator(request)
            .validateAsync(request.all(), { abortEarly: false, allowUnknown: true })
            .then((value) => {
            this.afterValidation(request, value);
        })
            .catch((error) => {
            ValidationException_1.default.throw(error);
        });
    }
    /**
     * Create a validator instance for a resource creation request.
     */
    validator(request) {
        return joi_1.default.object(this.rules(request));
    }
    /**
     * Get the validation rules for a resource creation request.
     */
    rules(request) {
        return this.formatRules(request, this.availableFields(request)
            .mapWithKeys((field) => {
            return field.getCreationRules(request);
        })
            .all());
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
     * Get the fields that are available for the given request.
     */
    availableFields(request) {
        return new FieldCollection_1.default(this.fields(request));
    }
    /**
     * Get the fields available on the action.
     */
    fields(request) {
        return [];
    }
    /**
     * Set the callback to be run to authorize running the action.
     */
    canRun(callback) {
        this.runCallback = callback;
        return this;
    }
    /**
     * Get the displayable name of the action.
     */
    name() {
        return this.constructor.name;
    }
    /**
     * Get the URI key for the action.
     */
    uriKey() {
        return this.name().replace(/[A-Z]/g, (matched, offset) => (offset > 0 ? '-' : '') + matched.toLowerCase());
    }
    /**
     * Mark the action as a standalone action.
     *
     * @return this
     */
    standalone() {
        this.standaloneAction = true;
        return this;
    }
    /**
     * Determine if the action is a standalone action.
     *
     * @return bool
     */
    isStandalone() {
        return this.standaloneAction;
    }
    /**
     * Prepare the action for JSON serialization.
     */
    serializeForIndex(request) {
        return {
            uriKey: this.uriKey(),
            isStandalone: this.isStandalone(),
            fields: this.availableFields(request)
                .mapWithKeys((field) => [field.attribute, field])
                .all(),
        };
    }
    /**
     * Get successful response.
     */
    respondSuccess() {
        return new SuccessfulResponse_1.default();
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    default: 'Your action ran successfully.',
                },
            },
        };
    }
}
exports.default = Action;
