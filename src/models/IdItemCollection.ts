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

  iter(): IterableIterator<T> {
    return Object.values(this.collection).values();
  }

  isItemIn(item: T): boolean {
    return this.getItem(item.id) !== undefined ? true : false;
  }
}
