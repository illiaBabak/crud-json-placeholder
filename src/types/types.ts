export type Post = {
  body: string;
  title: string;
  id: number;
  userId: number;
};

export type User = {
  address: UserAddress;
  company: UserCompany;
  email: string;
  name: string;
  phone: string;
  username: string;
  id: number;
};

export type UserAddress = {
  city: string;
  street: string;
};

export type UserCompany = {
  name: string;
};

export type Album = {
  title: string;
  id: number;
  userId: number;
};

export type AlertProps = {
  text: string;
  type: 'success' | 'error' | 'warning';
  position: 'top' | 'bottom';
};
