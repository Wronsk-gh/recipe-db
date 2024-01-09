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

  removeItem(id: string): void {
    delete this.collection[id];
  }

  asArray(): T[] {
    return Object.values(this.collection);
  }

  IdsAsArray(): string[] {
    return Object.keys(this.collection);
  }

  isItemIn(item: T): boolean {
    return this.getItem(item.id) !== undefined ? true : false;
  }

  isIdIn(id: string): boolean {
    return this.getItem(id) !== undefined ? true : false;
  }

  hasSameIdsList(otherCollection: IdItemCollection<T>): boolean {
    // Create an ordered array of all keys for each collection
    const a = Object.keys(this.collection).sort();
    const b = Object.keys(otherCollection.collection).sort();

    // Compare those arrays
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
