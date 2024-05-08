export const searchPredicate = (fields: string[], searchVal: string): boolean =>
  fields.some((field) => field.toLocaleLowerCase().includes(searchVal.toLocaleLowerCase()));
