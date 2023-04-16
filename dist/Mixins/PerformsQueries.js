"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Repository_1 = require("../Repositories/Repository");
const SoftDeletes_1 = require("./SoftDeletes");
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
exports.default = (Parent) => {
    return class PerformQueries extends Parent {
        /**
         * Search repository for incoming request.
         */
        async search(request, filters = [], orderings = [], withTrashed = SoftDeletes_1.TrashedStatus.DEFAULT) {
            return this.indexQuery(request, this.applySoftDeleteConstraint(await this.initializeSearch(request, filters, orderings), withTrashed));
        }
        /**
         * Initialize the search configuration.
         */
        async initializeSearch(request, filters = [], orderings = []) {
            const repository = this.repository();
            await this.applyFilters(request, repository, filters);
            await this.applyOrderings(request, repository, orderings);
            return repository;
        }
        /**
         * Apply the softe-delete into given query.
         */
        applySoftDeleteConstraint(repository, withTrashed) {
            const callback = {
                [SoftDeletes_1.TrashedStatus.WITH]: 'withTrashed',
                [SoftDeletes_1.TrashedStatus.ONLY]: 'onlyTrashed',
                [SoftDeletes_1.TrashedStatus.DEFAULT]: 'applySoftDelete',
            }[withTrashed];
            return this.softDeletes() === true ? repository[callback]() : repository;
        }
        /**
         * Apply any applicable filters to the repository.
         */
        async applyFilters(request, repository, filters) {
            await Promise.all(filters.map(({ handler, value }) => {
                return handler.apply(request, repository, value);
            }));
            return repository;
        }
        /**
         * Apply any applicable orders to the repository.
         */
        async applyOrderings(request, repository, orderings = []) {
            await Promise.all(orderings.map(({ handler, value }) => {
                return handler.apply(request, repository, value === Repository_1.Direction.DESC ? Repository_1.Direction.DESC : Repository_1.Direction.ASC);
            }));
            return repository;
        }
        /**
         * Build a "relatable" query for the given resource.
         *
         * This query determines which instances of the model may be attached to other resources.
         */
        relatableQuery(request, repository) {
            return repository;
        }
    };
};
