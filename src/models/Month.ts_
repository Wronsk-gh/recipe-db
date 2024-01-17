import { MonthsDb } from '../db-types';

export class Month {
  monthsDb: MonthsDb;
  id: string;
  name: string;

  constructor(id: string, monthsDb: MonthsDb) {
    this.id = id;
    this.monthsDb = monthsDb;
    this.name = monthsDb[id].name;
  }
}
