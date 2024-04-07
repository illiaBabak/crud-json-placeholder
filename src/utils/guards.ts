import { Album, AlbumResponse } from 'src/types/albums';
import { Post, PostResponse } from 'src/types/posts';
import { User, UserResponse } from 'src/types/users';

const isPost = (data: unknown): data is Post => {
  return (
    !!data &&
    typeof data === 'object' &&
    'body' in data &&
    'title' in data &&
    typeof data.body === 'string' &&
    typeof data.title === 'string'
  );
};

const isPostArr = (data: unknown): data is Post[] => {
  return Array.isArray(data) && data.every((el) => isPost(el));
};

export const isPostResponse = (data: unknown): data is PostResponse => {
  return !!data && typeof data === 'object' && 'data' in data && isPostArr(data.data);
};

const isAlbum = (data: unknown): data is Album => {
  return !!data && typeof data === 'object' && 'title' in data && typeof data.title === 'string';
};

const isAlbumArr = (data: unknown): data is Album[] => {
  return Array.isArray(data) && data.every((el) => isAlbum(el));
};

export const isAlbumResponse = (data: unknown): data is AlbumResponse => {
  return !!data && typeof data === 'object' && 'data' in data && isAlbumArr(data.data);
};

const isUser = (data: unknown): data is User => {
  return (
    !!data &&
    typeof data === 'object' &&
    'address' in data &&
    !!data.address &&
    typeof data.address === 'object' &&
    'city' in data.address &&
    typeof data.address.city === 'string' &&
    'street' in data.address &&
    typeof data.address.street === 'string' &&
    'company' in data &&
    !!data.company &&
    typeof data.company === 'object' &&
    'name' in data.company &&
    typeof data.company.name === 'string' &&
    'email' in data &&
    'name' in data &&
    'phone' in data &&
    'username' in data &&
    typeof data.email === 'string' &&
    typeof data.name === 'string' &&
    typeof data.phone === 'string' &&
    typeof data.username === 'string'
  );
};

const isUserArr = (data: unknown): data is User[] => {
  return Array.isArray(data) && data.every((user) => isUser(user));
};

export const isUserResponse = (data: unknown): data is UserResponse => {
  return !!data && typeof data === 'object' && 'data' in data && isUserArr(data.data);
};
