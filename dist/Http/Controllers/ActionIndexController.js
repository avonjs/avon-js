"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
const ActionIndexResponse_1 = tslib_1.__importDefault(require("../Responses/ActionIndexResponse"));
class ActionIndexController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const resource = request.resource();
        return new ActionIndexResponse_1.default(resource
            .availableActions(request)
            .map((action) => action.serializeForIndex(request)));
    }
}
exports.default = ActionIndexController;
