"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ability = void 0;
const tslib_1 = require("tslib");
const ForbiddenException_1 = tslib_1.__importDefault(require("../Exceptions/ForbiddenException"));
var Ability;
(function (Ability) {
    Ability["viewAny"] = "viewAny";
    Ability["create"] = "create";
    Ability["update"] = "update";
    Ability["view"] = "view";
    Ability["delete"] = "delete";
    Ability["forceDelete"] = "forceDelete";
    Ability["restore"] = "restore";
    Ability["add"] = "add";
})(Ability = exports.Ability || (exports.Ability = {}));
exports.default = (Parent) => {
    return class Authorizable extends Parent {
        /**
         * Determine if the current user has a given ability or throw exception.
         * @throws {ForbiddenException}
         */
        async authorizeTo(request, ability, args = []) {
            ForbiddenException_1.default.unless(await this.authorizedTo(request, ability, args));
        }
        /**
         * Determine if the current user has a given ability.
         */
        async authorizedTo(request, ability, args = []) {
            const authorizationCallback = this[this.makeAuthorizationCallback(ability)];
            return this.authorizable() && typeof authorizationCallback === 'function'
                ? authorizationCallback.apply(this, [request, args])
                : await Promise.resolve(true);
        }
        /**
         * Determine if need to perform authorization.
         */
        authorizable() {
            return true;
        }
        /**
         * Guess custom authorization callback name for the given ability.
         */
        makeAuthorizationCallback(ability) {
            return `authorizedTo${ability[0].toUpperCase()}${ability.substring(1)}`;
        }
        /**
         * Determine if the current user has ability to `viewAny` a resource.
         */
        authorizedToviewAny(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `view` a resource.
         */
        authorizedToView(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `create` a resource.
         */
        authorizedToCreate(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `update` a resource.
         */
        authorizedToUpdate(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `delete` a resource.
         */
        authorizedToDelete(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `forceDelete` a resource.
         */
        authorizedToForcDelete(request, ability) {
            return true;
        }
        /**
         * Determine if the current user has ability to `restore` a resource.
         */
        authorizedToRestore(request, args = []) {
            return true;
        }
        /**
         * Determine if the current user has ability to `add` a resource to the current resource.
         */
        authorizedToAdd(request, args = []) {
            return true;
        }
    };
};
