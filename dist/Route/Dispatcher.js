"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ActionIndexController_1 = tslib_1.__importDefault(require("../Http/Controllers/ActionIndexController"));
const ActionRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ActionRequest"));
const ActionStoreController_1 = tslib_1.__importDefault(require("../Http/Controllers/ActionStoreController"));
const AssociatableController_1 = tslib_1.__importDefault(require("../Http/Controllers/AssociatableController"));
const AssociatableRequest_1 = tslib_1.__importDefault(require("../Http/Requests/AssociatableRequest"));
const ResourceDeleteController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceDeleteController"));
const ResourceDeleteRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceDeleteRequest"));
const ResourceDetailController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceDetailController"));
const ResourceDetailRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceDetailRequest"));
const ResourceForceDeleteController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceForceDeleteController"));
const ResourceForceDeleteRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceForceDeleteRequest"));
const ResourceIndexController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceIndexController"));
const ResourceIndexRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceIndexRequest"));
const ResourceRestoreController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceRestoreController"));
const ResourceRestoreRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceRestoreRequest"));
const ResourceStoreController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceStoreController"));
const ResourceCreateOrAttachRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceCreateOrAttachRequest"));
const ResourceUpdateController_1 = tslib_1.__importDefault(require("../Http/Controllers/ResourceUpdateController"));
const ResourceUpdateOrUpdateAttachedRequest_1 = tslib_1.__importDefault(require("../Http/Requests/ResourceUpdateOrUpdateAttachedRequest"));
const ResponsableException_1 = tslib_1.__importDefault(require("../Exceptions/ResponsableException"));
const SchemaController_1 = tslib_1.__importDefault(require("../Http/Controllers/SchemaController"));
const SchemaRequest_1 = tslib_1.__importDefault(require("../Http/Requests/SchemaRequest"));
const __1 = require("..");
const controllers = {
    ResourceIndexController: {
        controller: () => new ResourceIndexController_1.default(),
        request: (request) => new ResourceIndexRequest_1.default(request),
    },
    ResourceStoreController: {
        controller: () => new ResourceStoreController_1.default(),
        request: (request) => new ResourceCreateOrAttachRequest_1.default(request),
    },
    ResourceDetailController: {
        controller: () => new ResourceDetailController_1.default(),
        request: (request) => new ResourceDetailRequest_1.default(request),
    },
    ResourceUpdateController: {
        controller: () => new ResourceUpdateController_1.default(),
        request: (request) => new ResourceUpdateOrUpdateAttachedRequest_1.default(request),
    },
    ResourceDeleteController: {
        controller: () => new ResourceDeleteController_1.default(),
        request: (request) => new ResourceDeleteRequest_1.default(request),
    },
    ResourceForceDeleteController: {
        controller: () => new ResourceForceDeleteController_1.default(),
        request: (request) => new ResourceForceDeleteRequest_1.default(request),
    },
    ResourceRestoreController: {
        controller: () => new ResourceRestoreController_1.default(),
        request: (request) => new ResourceRestoreRequest_1.default(request),
    },
    ActionIndexController: {
        controller: () => new ActionIndexController_1.default(),
        request: (request) => new ActionRequest_1.default(request),
    },
    ActionStoreController: {
        controller: () => new ActionStoreController_1.default(),
        request: (request) => new ActionRequest_1.default(request),
    },
    AssociatableController: {
        controller: () => new AssociatableController_1.default(),
        request: (request) => new AssociatableRequest_1.default(request),
    },
    SchemaController: {
        controller: () => new SchemaController_1.default(),
        request: (request) => new SchemaRequest_1.default(request),
    },
};
class Dispatcher {
    /**
     * Disptach incoming request to correspond controller.
     */
    static dispatch(handler) {
        const [controller, method] = [...handler.split('@'), '__invoke'];
        if (controllers[controller] === undefined) {
            throw Error(`MyError: Controller ${controller} not found`);
        }
        const controllerInstance = controllers[controller].controller();
        if (typeof controllerInstance[method] !== 'function') {
            throw Error(`MyError: Invalid route handler ${controller}@${method}`);
        }
        return (req, res) => {
            const request = controllers[controller].request(req);
            controllerInstance[method](request)
                .then((response) => {
                res
                    .status(response.getStatusCode())
                    .set(response.getHeaders())
                    .send(response.content());
            })
                .catch((error) => {
                if (error instanceof ResponsableException_1.default) {
                    const response = error.toResponse(request);
                    res
                        .status(response.getStatusCode())
                        .set(response.getHeaders())
                        .send(response.content());
                }
                else {
                    __1.Avon.handleError(error);
                    res
                        .status(500)
                        .send({ message: error.message, name: 'InternalServerError' });
                }
            });
        };
    }
}
exports.default = Dispatcher;
