"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Controller_1 = tslib_1.__importDefault(require("./Controller"));
class ActionStoreController extends Controller_1.default {
    /**
     * Default route handler
     */
    async __invoke(request) {
        const action = request.action();
        // validate required fileds
        await action.validate(request);
        // run action
        return await action.handleRequest(request);
    }
}
exports.default = ActionStoreController;
