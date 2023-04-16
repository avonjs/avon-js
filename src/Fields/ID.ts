import { type ResolveCallback } from './Field';
import Integer from './Integer';

export default class ID extends Integer {
  constructor(attribute?: string, resolveCallback?: ResolveCallback) {
    super(attribute ?? 'id', resolveCallback);
    this.exceptOnForms().orderable().filterable();
  }
}
