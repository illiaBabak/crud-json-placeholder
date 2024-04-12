import { Album, Post, User, UserAddress, UserCompany } from 'src/types/types';
import { isNumber, isString, isUserAddress, isUserCompany } from './guards';

export const hasEmptyField = (values: User | Album | Post | UserCompany | UserAddress): boolean => {
  return Object.values(values).some((el) => {
    if (isString(el)) return el.trim() === '';
    else if (isNumber(el)) return el === 0;
    else if (isUserAddress(el) || isUserCompany(el)) return hasEmptyField(el);
  });
};
