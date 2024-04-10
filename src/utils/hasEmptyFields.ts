import { Album, Post, User } from 'src/types/types';

export const hasEmptyField = (values: User | Album | Post): boolean => {
  return Object.values(values).some((field) =>
    typeof field === 'object' && !Array.isArray(field)
      ? Object.values(field).some((value) => value === '')
      : typeof field === 'string' && field.trim() === ''
  );
};
