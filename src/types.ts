export type ItemWithId = {
  id: string;
};

export type ItemDict<T> = {
  [id: string]: T;
};
