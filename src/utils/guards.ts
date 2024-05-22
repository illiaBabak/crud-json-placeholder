import { Post, Album, User, UserAddress, UserCompany, Comment } from 'src/types/types';

export const isObj = (val: unknown): val is object => !!val && typeof val === 'object';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isPost = (data: unknown): data is Post => {
  return (
    isObj(data) &&
    'body' in data &&
    'title' in data &&
    'id' in data &&
    'userId' in data &&
    isString(data.body) &&
    isString(data.title) &&
    isNumber(data.id) &&
    isNumber(data.userId)
  );
};

export const isPostArr = (data: unknown): data is Post[] => {
  return Array.isArray(data) && data.every((el) => isPost(el));
};

export const isAlbum = (data: unknown): data is Album => {
  return (
    isObj(data) &&
    'title' in data &&
    isString(data.title) &&
    'id' in data &&
    'userId' in data &&
    isNumber(data.id) &&
    isNumber(data.userId)
  );
};

export const isAlbumArr = (data: unknown): data is Album[] => {
  return Array.isArray(data) && data.every((el) => isAlbum(el));
};

export const isUserAddress = (data: unknown): data is UserAddress => {
  return isObj(data) && 'city' in data && 'street' in data && isString(data.city) && isString(data.street);
};

export const isUserCompany = (data: unknown): data is UserCompany => {
  return isObj(data) && 'name' in data && isString(data.name);
};

export const isUser = (data: unknown): data is User => {
  return (
    isObj(data) &&
    'address' in data &&
    isUserAddress(data.address) &&
    'company' in data &&
    isUserCompany(data.company) &&
    'email' in data &&
    'name' in data &&
    'phone' in data &&
    'username' in data &&
    'id' in data &&
    isString(data.email) &&
    isString(data.name) &&
    isString(data.phone) &&
    isString(data.username) &&
    isNumber(data.id)
  );
};

export const isUserArr = (data: unknown): data is User[] => {
  return Array.isArray(data) && data.every((user) => isUser(user));
};

export const isComment = (data: unknown): data is Comment => {
  return (
    isObj(data) &&
    'body' in data &&
    'email' in data &&
    'id' in data &&
    'name' in data &&
    'postId' in data &&
    isString(data.body) &&
    isString(data.email) &&
    isNumber(data.id) &&
    isString(data.name) &&
    isNumber(data.postId)
  );
};

export const isCommentArr = (data: unknown): data is Comment[] => {
  return Array.isArray(data) && data.every((el) => isComment(el));
};

export const isStringsMap = (data: unknown): data is Record<string, unknown> =>
  isObj(data) && Object.keys(data).every((key) => isString(key));
