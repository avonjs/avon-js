"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Dispatcher_1 = tslib_1.__importDefault(require("./Dispatcher"));
class default_1 {
    constructor(router) {
        this.router = router;
    }
    register() {
        this.resourceRoutes();
    }
    resourceRoutes() {
        // schema
        this.router.get('/schema', Dispatcher_1.default.dispatch('SchemaController'));
        // actions API
        this.router.get('/resources/:resourceName/actions', Dispatcher_1.default.dispatch('ActionIndexController'));
        this.router.post('/resources/:resourceName/actions/:actionName', Dispatcher_1.default.dispatch('ActionStoreController'));
        // Associatable Resources...
        this.router.get('/resources/:resourceName/associatable/:field', Dispatcher_1.default.dispatch('AssociatableController'));
        // resources API
        this.router.get('/resources/:resourceName', Dispatcher_1.default.dispatch('ResourceIndexController'));
        this.router.post('/resources/:resourceName', Dispatcher_1.default.dispatch('ResourceStoreController'));
        this.router.get('/resources/:resourceName/:resourceId', Dispatcher_1.default.dispatch('ResourceDetailController'));
        this.router.put('/resources/:resourceName/:resourceId', Dispatcher_1.default.dispatch('ResourceUpdateController'));
        this.router.delete('/resources/:resourceName/:resourceId', Dispatcher_1.default.dispatch('ResourceDeleteController'));
        this.router.delete('/resources/:resourceName/:resourceId/force', Dispatcher_1.default.dispatch('ResourceForceDeleteController'));
        this.router.put('/resources/:resourceName/:resourceId/restore', Dispatcher_1.default.dispatch('ResourceRestoreController'));
    }
}
exports.default = default_1;
