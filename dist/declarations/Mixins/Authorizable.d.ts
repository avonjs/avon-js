import { type AbstractMixable, type Mixable } from './Mixable';
export declare enum Ability {
    viewAny = "viewAny",
    create = "create",
    update = "update",
    view = "view",
    delete = "delete",
    forceDelete = "forceDelete",
    restore = "restore",
    add = "add"
}
declare const _default: <Tbase extends Mixable<Record<any, any>> | AbstractMixable<Record<any, any>> = Mixable<Record<any, any>>>(Parent: Tbase) => Tbase;
export default _default;
//# sourceMappingURL=Authorizable.d.ts.map