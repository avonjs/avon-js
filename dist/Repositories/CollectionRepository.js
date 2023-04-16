"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const collect_js_1 = tslib_1.__importStar(require("collect.js"));
const Fluent_1 = tslib_1.__importDefault(require("../Models/Fluent"));
const Repository_1 = tslib_1.__importStar(require("./Repository"));
const fs_1 = tslib_1.__importDefault(require("fs"));
class CollectionRepository extends Repository_1.default {
    /**
     * Initiate repository instance.
     */
    constructor(items = []) {
        super();
        this.collection = new collect_js_1.Collection(this.prepareItems(items.concat(this.resolveItems())));
    }
    /**
     * Resolve items from the store path.
     */
    resolveItems() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.filepath()).toString()).filter((item) => (0, collect_js_1.default)(item).isNotEmpty());
        }
        catch (error) {
            console.log(error);
            return {};
        }
    }
    /**
     * Prepare given items for collection.
     */
    prepareItems(items) {
        return items.map((item) => {
            return item instanceof Fluent_1.default ? item : new Fluent_1.default(item);
        });
    }
    /**
     * Search storage for given query string.
     */
    async search(search, page = 1, perPage = 15) {
        const searched = this.searchCollection(search);
        return {
            count: searched.count(),
            items: searched.slice(perPage * (page - 1), perPage).toArray(),
        };
    }
    /**
     * Find all model's for the given conditions.
     */
    async all(wheres = []) {
        return this.where(wheres).getCollection().toArray();
    }
    /**
     * Search collection for given query string.
     */
    searchCollection(search = '') {
        const collection = this.getCollection();
        if (search.length > 0) {
            return collection.filter((item) => {
                return this.performSearches(search, item);
            });
        }
        return collection;
    }
    /**
     * Get the collection with applied constraints.
     */
    getCollection() {
        let collection = this.collection.filter((item) => {
            return this.wheres.every((where) => this.checkAgainstWhere(item, where));
        });
        this.orders.forEach((order) => {
            collection = collection[order.direction === Repository_1.Direction.ASC ? 'sortBy' : 'sortByDesc'](order.key);
        });
        return collection;
    }
    /**
     * Apply the where constraint on the collection item.
     */
    checkAgainstWhere(item, where) {
        switch (where.operator) {
            case Repository_1.Operator.in:
            case Repository_1.Operator.eq:
                // eslint-disable-next-line no-case-declarations
                const values = Array.isArray(where.value) ? where.value : [where.value];
                return values.some((value) => String(value) === String(item.getAttribute(where.key)));
            case Repository_1.Operator.lte:
                return item.getAttribute(where.key) <= where.value;
            case Repository_1.Operator.gte:
                return item.getAttribute(where.key) >= where.value;
            case Repository_1.Operator.not:
                return String(item.getAttribute(where.key)) !== String(where.value);
            case Repository_1.Operator.lt:
                return item.getAttribute(where.key) < where.value;
            case Repository_1.Operator.gt:
                return item.getAttribute(where.key) > where.value;
            case Repository_1.Operator.like:
                return new RegExp(where.value.replace(/%/g, '.*')).test(item.getAttribute(where.key));
            default:
                return true;
        }
    }
    /**
     * Perform searches on the given item.
     */
    performSearches(search, item) {
        return (undefined !==
            this.searchables().find((searchable) => {
                return searchable(search, item);
            }));
    }
    /**
     * Store given model into the storage.
     */
    async store(model) {
        this.write(this.collection
            .push(model.setAttribute(model.getKeyName(), model.getKey() ?? this.newId()))
            .all());
        return model;
    }
    /**
     * Find first model for the given conditions.
     */
    async first(wheres = []) {
        this.where(wheres);
        return this.getCollection().first();
    }
    /**
     * Store given model into the storage.
     */
    async update(model) {
        this.write(this.collection
            .map((item) => {
            return String(item.getKey()) === String(model.getKey())
                ? model
                : item;
        })
            .all());
        return model;
    }
    /**
     * Delete model for the given key.
     */
    async delete(key) {
        this.write(this.getCollection()
            .filter((model) => String(model.getKey()) !== String(key))
            .all());
    }
    /**
     * Write given items to storage.
     */
    write(items) {
        fs_1.default.writeFileSync(this.filepath(), JSON.stringify(items.map((item) => item.all())));
    }
    /**
     * Create new instance of model.
     */
    model() {
        return new Fluent_1.default();
    }
    /**
     * Generate new id for storing item.
     */
    newId() {
        return Date.now();
    }
}
exports.default = CollectionRepository;
