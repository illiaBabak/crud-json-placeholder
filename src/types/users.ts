export type User = {
  address: {
    city: string;
    street: string;
  };

  company: {
    name: string;
  };

  email: string;
  name: string;
  phone: string;
  username: string;
};

export type UserResponse = {
    data: User[];
}