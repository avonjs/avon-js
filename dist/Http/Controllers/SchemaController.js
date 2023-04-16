"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Avon_1 = tslib_1.__importDefault(require("../../Avon"));
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const SchemaResponse_1 = tslib_1.__importDefault(require("../Responses/SchemaResponse"));
class SchemaController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        return new SchemaResponse_1.default(Avon_1.default.schema(request));
    }
}
exports.default = SchemaController;
