import { ItemWithId } from '../types';

export class IdItemCollection<T extends ItemWithId> {
  collection: { [id: string]: T };

  constructor() {
    this.collection = {};
  }

  getItem(id: string): T | undefined {
    return this.collection[id];
  }

  addItem(item: T): void {
    this.collection[item.id] = item;
  }

  asArray(): T[] {
    return Object.values(this.collection);
  }

  isItemIn(item: T): boolean {
    return this.getItem(item.id) !== undefined ? true : false;
  }
}
