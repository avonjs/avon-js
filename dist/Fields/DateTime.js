"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const Field_1 = tslib_1.__importDefault(require("./Field"));
const TextFilter_1 = tslib_1.__importDefault(require("./Filters/TextFilter"));
const Repository_1 = require("../Repositories/Repository");
const moment_1 = tslib_1.__importDefault(require("moment"));
class DateTime extends Field_1.default {
    constructor(attribute, resolveCallback) {
        super(attribute, resolveCallback);
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.date();
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.date();
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.date();
        /**
         * Indicates the date store / retrieve format.
         */
        this.dateFormat = 'YYYY-MM-DD HH:mm:ss';
        this.default(() => {
            return this.isNullable()
                ? this.nullValue()
                : (0, moment_1.default)().format(this.dateFormat);
        });
    }
    /**
     * Mutate the field value for response.
     */
    getMutatedValue(request, value) {
        return (0, moment_1.default)(value).format(this.dateFormat);
    }
    /**
     * Determine field is filterable or not.
     */
    isFilterable() {
        return true;
    }
    /**
     * Determine field is orderable or not.
     */
    isOrderable() {
        return true;
    }
    /**
     * Make the field filter.
     */
    makeFilter(request) {
        return new TextFilter_1.default(this);
    }
    /**
     * Define the default filterable callback.
     */
    defaultFilterableCallback() {
        return (request, repository, value) => {
            repository.where({
                key: this.filterableAttribute(request),
                operator: Repository_1.Operator.eq,
                value: Boolean(value),
            });
        };
    }
    /**
     *
     * Specify store / retrive date format.
     */
    format(dateFormat) {
        this.dateFormat = dateFormat;
        return this;
    }
    /**
     * Get the swagger-ui schema.
     */
    schemas(request) {
        return {
            type: 'string',
            nullable: this.isNullable(),
            default: this.resolveDefaultValue(request),
            format: 'date',
        };
    }
}
exports.default = DateTime;
