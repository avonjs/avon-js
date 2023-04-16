import collect from 'collect.js';
import ModelNotFoundException from '../Exceptions/ModelNotFoundException';
import { type Mixable } from './Mixable';
import { type Model } from '../Models';
import { type Repository, Operator, type Where } from '../Repositories';

export enum TrashedStatus {
  DEFAULT = 'without',
  WITH = 'with',
  ONLY = 'only',
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <
  TModel extends Model,
  TBase extends Mixable<Repository<TModel>>,
>(
  Parent: TBase,
) => {
  abstract class SoftDeletes extends Parent {
    /**
     * Indicates that query have to include trashed records.
     */
    public includeTrashedRecords = false;

    /**
     * Indicates that query have limit to the trashed records.
     */
    public onlyTrashedRecords = false;

    /**
     * Delete model for the given key.
     */
    async delete(key: string | number): Promise<void> {
      const model = await this.find(key);

      if (model === undefined) {
        return;
      }

      model.setAttribute(this.getDeletedAtKey(), this.getDeletedAtValue());

      await this.update(model);
    }

    /**
     * Delete model for the given key.
     */
    async forceDelete(key: string | number): Promise<void> {
      // @ts-expect-error ...
      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await super.delete(key);
    }

    /**
     * Restore the delete model for given key.
     */
    async restore(key: string | number): Promise<TModel> {
      const model = await this.onlyTrashed().find(key);

      ModelNotFoundException.when(model === undefined);

      (model as TModel).setAttribute(this.getDeletedAtKey(), null);

      return await this.update(model as TModel);
    }

    /**
     * Apply soft-delete constraint.
     */
    public applySoftDelete(): this {
      return this.where(this.scopeSoftDelete());
    }

    /**
     * Ignore soft-delete constraint.
     */
    public withTrashed(): this {
      const constraint = collect(this.scopeSoftDelete());

      this.wheres = this.wheres.filter((value) => {
        return constraint.diffAssoc(collect(value)).isNotEmpty();
      });

      return this;
    }

    /**
     * Apply only trashed record constraints.
     */
    public onlyTrashed(): this {
      this.where(this.withTrashed().scopeTrashedRecords());

      return this;
    }

    /**
     * Get soft-delete constraint.
     */
    public scopeSoftDelete(): Where {
      return {
        key: this.getDeletedAtKey(),
        value: null,
        operator: Operator.eq,
      };
    }

    /**
     * Get only trashed records constraint.
     */
    public scopeTrashedRecords(): Where {
      return {
        key: this.getDeletedAtKey(),
        value: this.getDeletedAtValue(),
        operator: Operator.in,
      };
    }

    /**
     * Get name of `deleted_at` key.
     */
    public getDeletedAtKey(): string {
      return 'deleted_at';
    }

    /**
     * Get value for `deleted_at` key.
     */
    public getDeletedAtValue(): string {
      return new Date().toDateString();
    }
  }

  return SoftDeletes;
};
