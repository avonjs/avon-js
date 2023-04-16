"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const joi_1 = tslib_1.__importDefault(require("joi"));
const Text_1 = tslib_1.__importDefault(require("./Text"));
class Email extends Text_1.default {
    constructor() {
        super(...arguments);
        /**
         * The validation rules callback for creation and updates.
         */
        this.rulesSchema = joi_1.default.string().email();
        /**
         * The validation rules callback for creation.
         */
        this.creationRulesSchema = joi_1.default.string().email();
        /**
         * The validation rules callback for updates.
         */
        this.updateRulesSchema = joi_1.default.string().email();
    }
}
exports.default = Email;
