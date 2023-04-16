"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const collect_js_1 = tslib_1.__importDefault(require("collect.js"));
const Repository_1 = tslib_1.__importStar(require("./Repository"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const os_1 = tslib_1.__importDefault(require("os"));
const path_1 = tslib_1.__importDefault(require("path"));
const Fluent_1 = tslib_1.__importDefault(require("../Models/Fluent"));
const Avon_1 = tslib_1.__importDefault(require("../Avon"));
class default_1 extends Repository_1.default {
    /**
     * Initiate repository instance.
     */
    constructor(items = []) {
        super();
        this.items = items;
        this.ensureOfDirectory();
    }
    /**
     * Search storage for given query string.
     */
    async search(search, page = 1, perPage = 15) {
        const searched = this.searchCollection(search);
        return await Promise.resolve({
            count: searched.count(),
            items: searched.slice(perPage * (page - 1), perPage).toArray(),
        });
    }
    /**
     * Find all model's for the given conditions.
     */
    async all(wheres = []) {
        return await Promise.resolve(this.where(wheres).getCollection().toArray());
    }
    /**
     * Search collection for given query string.
     */
    searchCollection(search = '') {
        if (search.length > 0) {
            return this.logs().filter((item) => {
                return this.performSearches(search, item);
            });
        }
        return this.logs();
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
     * Store multiple model's into the storage.
     */
    async insert(models) {
        // ensure log file exists
        return await Promise.resolve(await Promise.all(models.map(async (model) => {
            return await this.store(model.setAttribute(model.getKeyName(), this.makeIdentifier()));
        })));
    }
    /**
     * Store given model into the storage.
     */
    async store(model) {
        // ensure log file exists
        this.ensureOfFile(this.filepath());
        // append identifier
        model.setAttribute(model.getKeyName(), this.makeIdentifier());
        // store log
        fs_1.default.appendFileSync(this.filepath(), os_1.default.EOL + model.toJson());
        return await Promise.resolve(model);
    }
    /**
     * Find first model for the given conditions.
     */
    async first(wheres = []) {
        this.where(wheres);
        return await Promise.resolve(this.logs().first());
    }
    /**
     * Store given model into the storage.
     */
    batchUpdate(batchId, models) {
        // ensure log file exists
        this.ensureOfFile(this.filepath());
        models.forEach((model) => {
            model.setAttribute(model.getKeyName(), this.makeIdentifier());
        });
        // store log
        fs_1.default.appendFileSync(this.filepath(), os_1.default.EOL + models.map((model) => model.toJson()).join(os_1.default.EOL));
        return models;
    }
    /**
     * Store given model into the storage.
     */
    async update(model) {
        throw new Error('Update action event is not possible.');
    }
    /**
     * Delete model for the given key.
     */
    async delete(key) {
        throw new Error('Delete action event is not possible.');
    }
    /**
     * Get the stored logs.
     */
    logs() {
        const logs = (0, collect_js_1.default)(fs_1.default
            .readdirSync(this.storagePath())
            .flatMap((filename) => this.load(this.filepath(filename))));
        return logs.filter((item) => {
            return this.wheres.every((where) => this.checkAgainstWhere(item, where));
        });
    }
    /**
     * Apply the where constraint on the collection item.
     */
    checkAgainstWhere(item, where) {
        const value = Array.isArray(where.value)
            ? where.value
            : String(where.value);
        const resourceValue = String(item.getAttribute(where.key));
        switch (where.operator) {
            case Repository_1.Operator.in:
            case Repository_1.Operator.eq:
                // eslint-disable-next-line no-case-declarations
                const values = Array.isArray(where.value) ? where.value : [where.value];
                return values.some((value) => value === resourceValue);
            case Repository_1.Operator.lte:
                return resourceValue <= value;
            case Repository_1.Operator.gte:
                return resourceValue >= value;
            case Repository_1.Operator.not:
                return resourceValue !== value;
            case Repository_1.Operator.lt:
                return resourceValue < value;
            case Repository_1.Operator.gt:
                return resourceValue > value;
            default:
                return true;
        }
    }
    /**
     * Load loags from the file.
     */
    load(filepath) {
        return fs_1.default
            .readFileSync(filepath)
            .toString()
            .split(os_1.default.EOL)
            .map((log) => new Fluent_1.default(this.unserialize(log)));
    }
    /**
     * Serialize the log raw.
     */
    serialize(log) {
        return log.toJson();
    }
    /**
     * Unserialize the log raw.
     */
    unserialize(log) {
        try {
            return JSON.parse(log);
        }
        catch (error) {
            return {};
        }
    }
    /**
     * Get the log file name.
     */
    filepath(filename) {
        return path_1.default.join(this.storagePath(), filename ?? this.filename());
    }
    /**
     * makeIdentifier
     */
    makeIdentifier() {
        return new Date().toISOString().substring(0, 10) + ':' + String(Date.now());
    }
    /**
     * Get the log file name.
     */
    filename() {
        return new Date().toISOString().substring(0, 10) + '.log';
    }
    /**
     * logFilePath
     */
    storagePath() {
        return Avon_1.default.actionEventLogPath();
    }
    /**
     * Ensure that log directory currently exists.
     */
    ensureOfFile(filename) {
        this.ensureOfDirectory();
        if (!fs_1.default.existsSync(filename)) {
            fs_1.default.closeSync(fs_1.default.openSync(filename, 'w'));
        }
    }
    /**
     * Ensure that log directory currently exists.
     */
    ensureOfDirectory() {
        if (!fs_1.default.existsSync(this.storagePath())) {
            fs_1.default.mkdirSync(this.storagePath(), { recursive: true });
        }
    }
    /**
     * Create new instance of model.
     */
    model() {
        return new (class extends Fluent_1.default {
        })();
    }
    /**
     * Get key name of the item.
     */
    searchables() {
        return [];
    }
    /**
     * Fill event model for successful resource store.
     */
    forResourceStore(request, resource) {
        return new Fluent_1.default({
            ...this.defaultAttributes(request, resource),
            name: 'Create',
            changes: resource.all(),
        });
    }
    /**
     * Fill event model for successful resource update.
     */
    forResourceUpdate(request, resource, previous) {
        return new Fluent_1.default({
            ...this.defaultAttributes(request, resource),
            name: 'Update',
            changes: (0, collect_js_1.default)(resource.all()).diffAssoc((0, collect_js_1.default)(previous.all())).all(),
            original: previous.all(),
        });
    }
    /**
     * Fill event model for successful resource destroy.
     */
    forResourceDelete(request, resource) {
        return new Fluent_1.default({
            ...this.defaultAttributes(request, resource),
            name: 'Delete',
            changes: resource.all(),
            original: {},
        });
    }
    /**
     * Fill event model for successful resource restore.
     */
    forResourceRestore(request, resource) {
        return new Fluent_1.default({
            ...this.defaultAttributes(request, resource),
            name: 'Restore',
            changes: {},
        });
    }
    /**
     * Fill event model for successful action ran.
     */
    forActionRan(request, action, resource, previous) {
        return new Fluent_1.default({
            ...this.defaultAttributes(request, resource),
            name: action.name(),
            original: resource.all(),
            changes: (0, collect_js_1.default)(resource.all()).diffAssoc((0, collect_js_1.default)(previous.all())).all(),
        });
    }
    /**
     * Get the default attributes for creating a new action event.
     */
    defaultAttributes(request, resource) {
        return {
            payload: request.all(),
            resource_name: request.resource().uriKey(),
            resource_id: resource.getKey(),
            model_type: resource.constructor.name,
            model_id: resource.getKey(),
            changes: {},
            original: {},
            status: 'finished',
        };
    }
}
exports.default = default_1;
