import { Album, AlbumResponse } from 'src/types/albums';
import { Post, PostResponse } from 'src/types/posts';
import { User, UserResponse } from 'src/types/users';

const isObj = (val: unknown): val is object => !!val && typeof val === 'object';

const isString = (val: unknown): val is string => typeof val === 'string';

const isPost = (data: unknown): data is Post => {
  return isObj(data) && 'body' in data && 'title' in data && isString(data.body) && isString(data.title);
};

const isPostArr = (data: unknown): data is Post[] => {
  return Array.isArray(data) && data.every((el) => isPost(el));
};

export const isPostResponse = (data: unknown): data is PostResponse => {
  return isObj(data) && 'data' in data && isPostArr(data.data);
};

const isAlbum = (data: unknown): data is Album => {
  return isObj(data) && 'title' in data && isString(data.title);
};

const isAlbumArr = (data: unknown): data is Album[] => {
  return Array.isArray(data) && data.every((el) => isAlbum(el));
};

export const isAlbumResponse = (data: unknown): data is AlbumResponse => {
  return isObj(data) && 'data' in data && isAlbumArr(data.data);
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

const isUserArr = (data: unknown): data is User[] => {
  return Array.isArray(data) && data.every((user) => isUser(user));
};

export const isUserResponse = (data: unknown): data is UserResponse => {
  return isObj(data) && 'data' in data && isUserArr(data.data);
};
