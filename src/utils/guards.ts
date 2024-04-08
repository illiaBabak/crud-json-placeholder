import { Post, Album, User } from 'src/types/types';

const isObj = (val: unknown): val is object => !!val && typeof val === 'object';

const isString = (val: unknown): val is string => typeof val === 'string';

const isPost = (data: unknown): data is Post => {
  return isObj(data) && 'body' in data && 'title' in data && isString(data.body) && isString(data.title);
};

export const isPostArr = (data: unknown): data is Post[] => {
  return Array.isArray(data) && data.every((el) => isPost(el));
};
const isAlbum = (data: unknown): data is Album => {
  return isObj(data) && 'title' in data && isString(data.title);
};

export const isAlbumArr = (data: unknown): data is Album[] => {
  return Array.isArray(data) && data.every((el) => isAlbum(el));
};

const isUser = (data: unknown): data is User => {
  return (
    isObj(data) &&
    'address' in data &&
    isObj(data.address) &&
    'city' in data.address &&
    isString(data.address.city) &&
    'street' in data.address &&
    isString(data.address.street) &&
    'company' in data &&
    isObj(data.company) &&
    'name' in data.company &&
    isString(data.company.name) &&
    'email' in data &&
    'name' in data &&
    'phone' in data &&
    'username' in data &&
    isString(data.email) &&
    isString(data.name) &&
    isString(data.phone) &&
    isString(data.username)
  );
};

export const isUserArr = (data: unknown): data is User[] => {
  return Array.isArray(data) && data.every((user) => isUser(user));
};
