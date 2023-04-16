"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ActionEvent_1 = tslib_1.__importDefault(require("../Repositories/ActionEvent"));
const Text_1 = tslib_1.__importDefault(require("../Fields/Text"));
const Resource_1 = tslib_1.__importDefault(require("../Resource"));
class ActionEvent extends Resource_1.default {
    /**
     * Get the fields available on the entity.
     */
    fields(request) {
        return [
            new Text_1.default('id').filterable().orderable().exceptOnForms(),
            new Text_1.default('model_type').filterable().orderable(),
            new Text_1.default('model_id').filterable().orderable(),
            new Text_1.default('resource_name').filterable().orderable(),
            new Text_1.default('resource_id').filterable().orderable(),
            new Text_1.default('payload').resolveUsing((value) => JSON.stringify(value)),
            new Text_1.default('changes').resolveUsing((value) => JSON.stringify(value)),
            new Text_1.default('original').resolveUsing((value) => JSON.stringify(value)),
        ];
    }
    /**
     * Get the repository.
     */
    repository() {
        return new (class extends ActionEvent_1.default {
        })();
    }
}
exports.default = ActionEvent;
