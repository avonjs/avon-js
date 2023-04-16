import { type AvonRequest } from '../Http/Requests';
import type FieldCollection from '../Collections/FieldCollection';
import { type AbstractMixable, type Mixable } from './Mixable';
import { type Model } from '../Models';

export type Callbacks = [Model, Array<() => Promise<any>>];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class FillsFields extends Parent {
    /**
     * Fill a new model instance using the given request.
     */
    public fillForCreation<TModel extends Model>(
      request: AvonRequest,
      model: TModel,
    ): Callbacks {
      return this.fillFields<TModel>(
        request,
        model,
        request
          .newResource(model)
          .creationFields(request)
          .withoutUnfillableFields(),
      );
    }

    /**
     * Fill a new model instance using the given request.
     */
    public fillForUpdate<TModel extends Model>(
      request: AvonRequest,
      model: TModel,
    ): Callbacks {
      return this.fillFields<TModel>(
        request,
        model,
        request
          .newResource(model)
          .updateFields(request)
          .withoutUnfillableFields(),
      );
    }

    /**
     * Fill the given fields for the model.
     */
    public fillFields<TModel extends Model>(
      request: AvonRequest,
      model: TModel,
      fields: FieldCollection,
    ): Callbacks {
      return [
        model,
        fields
          .map((field) => field.fill(request, model))
          .filter((callback: any) => typeof callback === 'function')
          .values()
          .all() as Array<() => Promise<any>>,
      ];
    }
  };
};
