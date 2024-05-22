import { isString, isStringsMap } from './guards';

export const hasEmptyField = (values: Record<string, unknown>): boolean =>
  Object.values(values).some((el) => {
    if (isString(el)) return el.trim() === '';
    else if (isStringsMap(el)) return hasEmptyField(el);
  });
