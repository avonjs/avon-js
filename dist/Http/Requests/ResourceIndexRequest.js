"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const QueryParser_1 = tslib_1.__importDefault(require("./QueryParser"));
const _1 = require(".");
const SoftDeletes_1 = require("../../Mixins/SoftDeletes");
class ResourceIndexRequest extends _1.AvonRequest {
    /**
     * Indicates type of the request instance.
     */
    type() {
        return _1.RequestTypes.ResourceIndexRequest;
    }
    /**
     * Get the paginator instance for the index request.
     */
    async searchIndex() {
        const repository = await this.resource().search(this, this.filters(), this.orderings(), this.trashed());
        const { items, count } = await repository.search(this.string('search', ''), this.currentPage(), this.perPage());
        await Promise.all(this.resource()
            .indexFields(this, this.model())
            .withOnlyRelatableFields()
            .map(async (field) => await field.resolveRelatables(this, items)));
        return {
            count,
            resources: await Promise.all(items.map(async (item) => {
                return await this.newResource(item).serializeForIndex(this);
            })),
        };
    }
    /**
     * Get the page number.
     */
    currentPage() {
        return this.number('page', 1);
    }
    /**
     * Get per page.
     */
    perPage() {
        const perPageOptions = this.resource().perPageOptions();
        const perPage = this.number('perPage');
        return perPageOptions.includes(perPage) ? perPage : perPageOptions[0];
    }
    /**
     * Get the filters for the request.
     */
    filters() {
        return new QueryParser_1.default(this.query('filters', []), this.availableFilters()).matches();
    }
    /**
     * Get all of the possibly available filters for the request.
     */
    availableFilters() {
        return this.resource().availableFilters(this);
    }
    /**
     * Check if filter found in request.
     */
    hasFilter(key) {
        return this.query(key, undefined) !== undefined;
    }
    /**
     * Get the orderings for the request.
     */
    orderings() {
        return new QueryParser_1.default(this.query('orders', []), this.availableOrderings()).matches();
    }
    /**
     * Get all of the possibly available orderings for the request.
     */
    availableOrderings() {
        return this.resource().availableOrderings(this);
    }
    trashed() {
        return this.query('trashed') ?? SoftDeletes_1.TrashedStatus.DEFAULT;
    }
}
exports.default = ResourceIndexRequest;
