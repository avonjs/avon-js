"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const _1 = require(".");
const ActionNotFoundException_1 = tslib_1.__importDefault(require("../../Exceptions/ActionNotFoundException"));
class ActionRequest extends _1.AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.ActionRequest;
    }
    /**
     * Get the action instance for the request or abort.
     */
    action() {
        const action = this.resource()
            .availableActions(this)
            .find((action) => action.uriKey() === this.route('actionName'));
        ActionNotFoundException_1.default.when(action === undefined);
        return action;
    }
    /**
     * Get the selected models for the action.
     */
    async models() {
        const resourceIds = this.query('resources', []);
        return await this.repository()
            .whereKeys(Array.isArray(resourceIds) ? resourceIds : [resourceIds])
            .all();
    }
}
exports.default = ActionRequest;
