import { type AvonRequest } from '../Http/Requests';
import { type AbstractMixable, type Mixable } from './Mixable';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default <Tbase extends Mixable | AbstractMixable = Mixable>(
  Parent: Tbase,
) => {
  return class HasLifecycleMethods extends Parent {
    /**
     * Register a callback to be called before the resource create.
     */
    public beforeCreate(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called after the resource is created.
     */
    public afterCreate(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called before the resource update.
     */
    public beforeUpdate(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called after the resource is updated.
     */
    public afterUpdate(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called before the resource delete.
     */
    public beforeDelete(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called after the resource is destroyed.
     */
    public afterDelete(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called before the resource force-destroyed.
     */
    public beforeForceDelete(request: AvonRequest): void {
      //
    }

    /**
     * Register a callback to be called after the resource is force-destroyed.
     */
    public afterForceDelete(request: AvonRequest): void {
      //
    }
  };
};
