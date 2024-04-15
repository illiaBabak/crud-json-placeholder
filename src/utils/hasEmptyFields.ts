import { Album, Post, User, UserAddress, UserCompany } from 'src/types/types';
import { isNumber, isString, isUserAddress, isUserCompany } from './guards';

export const hasEmptyField = (values: User | Album | Post | UserCompany | UserAddress): boolean => {
  return Object.values(values).some((el) => {
    if (isString(el)) return el.trim() === '';
    else if (isUserAddress(el) || (isUserCompany(el) && !isNumber(el))) return hasEmptyField(el);
  });
};
