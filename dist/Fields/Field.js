"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const AuthorizedToSee_1 = tslib_1.__importDefault(require("../Mixins/AuthorizedToSee"));
const Nullable_1 = tslib_1.__importDefault(require("../Mixins/Nullable"));
const Presentable_1 = tslib_1.__importDefault(require("../Mixins/Presentable"));
const Filterable_1 = tslib_1.__importDefault(require("../Mixins/Filterable"));
const Orderable_1 = tslib_1.__importDefault(require("../Mixins/Orderable"));
const TextFilter_1 = tslib_1.__importDefault(require("./Filters/TextFilter"));
const Repository_1 = require("../Repositories/Repository");
const Ordering_1 = tslib_1.__importDefault(require("./Orderings/Ordering"));
const HasSchema_1 = tslib_1.__importDefault(require("../Mixins/HasSchema"));
class Field extends (0, HasSchema_1.default)((0, Filterable_1.default)((0, Orderable_1.default)((0, Nullable_1.default)((0, Presentable_1.default)((0, AuthorizedToSee_1.default)(class {
})))))) {
    /**
     * Define the default orderable callback.
     */
    defaultOrderingCallback() {
        return (request, repository, direction) => {
            repository.order({
                key: this.orderableAttribute(request),
                direction: Repository_1.Direction.ASC === direction ? Repository_1.Direction.ASC : Repository_1.Direction.DESC,
            });
        };
    }
    constructor(attribute, resolveCallback) {
        super();
        /**
         * The callback to be used to resolve the field's display value.
         */
        this.displayCallback = (value, resource, attribute) => value;
        /**
         * The callback to be used to resolve the field's value.
         */
        this.resolveCallback = (value, resource, attribute) => value;
        /**
         * The callback to be used for the field's default value.
         */
        this.defaultCallback = () => this.nullValue();
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.any();
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.any();
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.any();
        this.attribute = attribute;
        if (resolveCallback !== undefined) {
            this.resolveCallback = resolveCallback;
        }
    }
    /**
     * Resolve the field's value for display.
     */
    resolveForDisplay(resource, attribute) {
        this.resolve(resource, attribute);
    }
    /**
     * Resolve the field's value.
     */
    resolve(resource, attribute) {
        const resolveAttribute = attribute ?? this.attribute;
        this.setValue(this.resolveCallback(this.resolveAttribute(resource, resolveAttribute), resource, resolveAttribute));
    }
    /**
     * Resolve the given attribute from the given resource.
     */
    resolveAttribute(resource, attribute) {
        return resource.getAttribute(attribute);
    }
    /**
     * Set the callback to be used for determining the field's default value.
     */
    default(callback) {
        this.defaultCallback = callback;
        return this;
    }
    /**
     * Resolve the default value for the field.
     */
    resolveDefaultValue(request) {
        if (request.isCreateOrAttachRequest() ||
            request.isActionRequest() ||
            request.isSchemaRequest()) {
            return this.defaultCallback(request);
        }
    }
    /**
     * Define the callback that should be used to display the field's value.
     */
    displayUsing(displayCallback) {
        this.displayCallback = displayCallback;
        return this;
    }
    /**
     * Define the callback that should be used to resolve the field's value.
     */
    resolveUsing(resolveCallback) {
        this.resolveCallback = resolveCallback;
        return this;
    }
    /**
     * Specify a callback that should be used to hydrate the model attribute for the field.
     */
    fillUsing(fillCallback) {
        this.fillCallback = fillCallback;
        return this;
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fill(request, model) {
        return this.fillInto(request, model, this.attribute);
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillForAction(request, model) {
        return this.fill(request, model);
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillInto(request, model, attribute, requestAttribute) {
        return this.fillAttribute(request, requestAttribute ?? this.attribute, model, attribute);
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttribute(request, requestAttribute, model, attribute) {
        if (this.fillCallback !== undefined) {
            return this.fillCallback(request, model, attribute, requestAttribute);
        }
        else {
            return this.fillAttributeFromRequest(request, requestAttribute, model, attribute);
        }
    }
    /**
     * Hydrate the given attribute on the model based on the incoming request.
     */
    fillAttributeFromRequest(request, requestAttribute, model, attribute) {
        if (!request.exists(requestAttribute)) {
            return;
        }
        const value = request.get(requestAttribute);
        model.setAttribute(attribute, this.isValidNullValue(value) ? this.nullValue() : value);
    }
    /**
     * Get the value considered as null.
     */
    nullValue() {
        return null;
    }
    /**
     * Set the value for the field.
     */
    setValue(value) {
        this.value = value;
        return this;
    }
    /**
     * Get the value for the field.
     */
    getValue(request) {
        if (this.value === undefined) {
            this.value = this.resolveDefaultValue(request);
        }
        const value = this.value !== undefined && !this.isValidNullValue(this.value) // ![undefined, this.nullValue()].includes(this.value)
            ? this.getMutatedValue(request, this.value)
            : this.nullValue();
        return value ?? this.nullValue();
    }
    /**
     * Determine if the element should be displayed for the given request.
     */
    authorize(request) {
        return this.authorizedToSee(request);
    }
    /**
     * Set the validation rules for the field.
     */
    rules(rules) {
        this.rulesSchema = rules;
        return this;
    }
    /**
     * Get the validation rules for this field.
     */
    getRules(request) {
        return { [this.attribute]: this.rulesSchema };
    }
    /**
     * Get the creation rules for this field.
     */
    getCreationRules(request) {
        const rules = this.getRules(request);
        return {
            ...rules,
            [this.attribute]: rules[this.attribute].concat(this.creationRulesSchema),
        };
    }
    /**
     * Set the creation validation rules for the field.
     */
    creationRules(rules) {
        this.creationRulesSchema = rules;
        return this;
    }
    /**
     * Get the update rules for this field.
     */
    getUpdateRules(request) {
        const rules = this.getRules(request);
        return {
            ...rules,
            [this.attribute]: rules[this.attribute].concat(this.updateRulesSchema),
        };
    }
    /**
     * Set the creation validation rules for the field.
     */
    updateRules(rules) {
        this.updateRulesSchema = rules;
        return this;
    }
    /**
     * Get the validation attribute for the field.
     */
    getValidationAttribute(request) {
        return this.validationAttribute;
    }
    /**
     * Get field validator.
     */
    validator() {
        return joi_1.default;
    }
    /**
     * Indicate that the field should be nullable.
     */
    nullable(nullable = true, validator) {
        super.nullable(nullable, validator);
        this.rules(joi_1.default.allow(null));
        return this;
    }
    /**
     * Determine if the field is required.
     */
    isRequired(request) {
        if (request.isResourceIndexRequest() ||
            request.isActionRequest() ||
            request.isCreateOrAttachRequest()) {
            return this.isRequiredForCreation(request);
        }
        if (request.isUpdateOrUpdateAttachedRequest()) {
            return this.isRequiredForUpdate(request);
        }
        return false;
    }
    /**
     * Determine if the field is required for creation.
     */
    isRequiredForCreation(request) {
        const rules = this.getCreationRules(request)[this.attribute];
        return rules.$_getFlag('presence') === 'required';
    }
    /**
     * Determine if the field is required for update.
     */
    isRequiredForUpdate(request) {
        const rules = this.getUpdateRules(request)[this.attribute];
        return rules.$_getFlag('presence') === 'required';
    }
    /**
     * Define filterable attribute.
     */
    filterableAttribute(request) {
        return this.attribute;
    }
    /**
     * Define orderable attribute.
     */
    orderableAttribute(request) {
        return this.attribute;
    }
    /**
     * Make the field filter.
     */
    makeFilter(request) {
        return new TextFilter_1.default(this);
    }
    /**
     * Make the field filter.
     */
    makeOrdering(request) {
        return new Ordering_1.default(this);
    }
    /**
     * Determine field is fillable or not.
     */
    fillable() {
        return true;
    }
    /**
     * Determine field is resolvable or not.
     */
    resolvable() {
        return true;
    }
    /**
     * Serialize parameters for schema.
     */
    serializeParameters(request) {
        return [
            {
                name: this.attribute,
                in: 'body',
                schema: this.schema(request),
            },
        ];
    }
    /**
     * Specify the field help text.
     */
    help(helpText) {
        this.helpText = helpText;
        return this;
    }
    /**
     * Specify the field label.
     */
    withName(name) {
        this.name = name;
        return this;
    }
    /**
     * Get the swagger-ui schema.
     */
    schema(request) {
        return {
            type: 'string',
            nullable: this.isNullable(),
            description: this.helpText,
            title: this.name,
            default: this.getValue(request),
        };
    }
}
exports.default = Field;
