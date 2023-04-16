"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    /**
     * Default route handler
     */
    async __invoke(request) {
        throw new Error(`Inovked controller ${this.constructor.name}`);
    }
}
exports.default = Controller;
