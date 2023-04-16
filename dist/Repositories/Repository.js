"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Operator = void 0;
var Operator;
(function (Operator) {
    Operator["eq"] = "=";
    Operator["not"] = "!=";
    Operator["lt"] = "<";
    Operator["lte"] = "<=";
    Operator["gt"] = ">";
    Operator["gte"] = ">=";
    Operator["in"] = "in";
    Operator["like"] = "like";
})(Operator = exports.Operator || (exports.Operator = {}));
var Direction;
(function (Direction) {
    Direction["ASC"] = "asc";
    Direction["DESC"] = "desc";
})(Direction = exports.Direction || (exports.Direction = {}));
class Repository {
    constructor() {
        /**
         * List of applied conditions.
         */
        this.wheres = [];
        /**
         * List of applied orderings.
         */
        this.orders = [];
    }
    /**
     * Run transaction on the storage.
     */
    async transaction(callback) {
        return await Promise.resolve(callback());
    }
    /**
     * Apply condition('s) to the repository.
     */
    where(where) {
        const wheres = Array.isArray(where) ? where : [where];
        wheres.forEach((where) => this.wheres.push(where));
        return this;
    }
    /**
     * Apply condition to repository.
     */
    order(order) {
        const orders = Array.isArray(order) ? order : [order];
        orders.forEach((order) => this.orders.push(order));
        return this;
    }
    /**
     * Find model for the given key.
     */
    async find(key) {
        return await this.whereKey(key).first();
    }
    /**
     * Apply primary key condition
     */
    whereKey(key) {
        return this.where({
            key: this.model().getKeyName(),
            value: key,
            operator: Operator.eq,
        });
    }
    /**
     * Apply primary key condition
     */
    whereKeys(keys) {
        return this.where({
            key: this.model().getKeyName(),
            value: keys,
            operator: Operator.in,
        });
    }
    /**
     * Delete model for the given key.
     */
    async forceDelete(key) {
        await this.delete(key);
    }
}
exports.default = Repository;
