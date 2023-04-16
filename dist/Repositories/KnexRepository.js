"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Fluent_1 = tslib_1.__importDefault(require("../Models/Fluent"));
const Repository_1 = tslib_1.__importStar(require("./Repository"));
const helpers_1 = require("../helpers");
const pluralize_1 = require("pluralize");
class KnexRepository extends Repository_1.default {
    /**
     * Search storage for given query string.
     */
    async search(search, page = 1, perPage = 15) {
        const query = this.performSearch(this.makeQuery(), search);
        const offset = (page - 1) * perPage > 0 ? (page - 1) * perPage : 0;
        const count = await query
            .clone()
            .debug(true)
            .count(`${this.model().getKeyName()} as count`)
            .first();
        const data = await query.limit(perPage).offset(offset).select('*');
        return {
            ...count,
            items: data.map((client) => new Fluent_1.default(client)),
        };
    }
    /**
     * Perform searches on the given item.
     */
    performSearch(query, search) {
        return query;
    }
    /**
     * Find all model's for the given conditions.
     */
    async all(wheres = []) {
        const data = await this.where(wheres).makeQuery().select('*');
        return data.map((item) => new Fluent_1.default(item));
    }
    /**
     * Store given model into the storage.
     */
    async store(model) {
        const insertedIds = await this.query().insert(model.all());
        return await this.whereKey(insertedIds[0]).first();
    }
    /**
     * Find first model for the given conditions.
     */
    async first(wheres = []) {
        return new Fluent_1.default(await this.where(wheres).makeQuery().first());
    }
    /**
     * Store given model into the storage.
     */
    async update(model) {
        const data = model.all();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete data[model.getKeyName()];
        await this.query().where(model.getKeyName(), model.getKey()).update(data);
        return await Promise.resolve(model);
    }
    /**
     * Delete model for the given key.
     */
    async delete(key) {
        await this.whereKey(key).makeQuery().delete();
    }
    /**
     * Create new instance of model.
     */
    model() {
        return new Fluent_1.default();
    }
    /**
     * Get new query with wheres and orders.
     */
    makeQuery() {
        const query = this.query();
        this.wheres.forEach((where) => {
            void query.where(where.key, where.operator, where.value);
        });
        void query.orderBy(this.orders.map((order) => {
            return {
                column: order.key,
                order: order.direction === Repository_1.Direction.DESC ? 'desc' : 'asc',
            };
        }));
        return query;
    }
    /**
     * Get the base query.
     */
    query() {
        return this.connection().table(this.tableName()).debug(this.debug());
    }
    /**
     * tableName
     */
    tableName() {
        return (0, pluralize_1.plural)((0, pluralize_1.singular)((0, helpers_1.slugify)(this.constructor.name, '_')));
    }
    /**
     * Get the debuging state.
     */
    debug() {
        return false;
    }
}
exports.default = KnexRepository;
