import { Collection as BaseCollection } from 'collect.js';
export default class Collection<TItem> extends BaseCollection<TItem> {
    /**
     * The get method returns the item at a given key. If the key does not exist, null is returned.
     */
    get<K, V>(path: keyof TItem | K, defaultValue?: ((...any: any[]) => V | TItem) | V | TItem): TItem | null;
    /**
     * The has method determines if one or more keys exists in the collection.
     */
    has<K>(path: keyof TItem | K | Array<keyof TItem>): boolean;
}
//# sourceMappingURL=Collection.d.ts.map