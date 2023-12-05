export class UserEntity {
  id: string;
  name: string;
  age: number;
  roles: string[];
  email: string;
  password: string;
  tokens?: Tokens;
  createdAt: Date;
  updatedAt: Date;
}

class Tokens {
  id: string;
  accessToken: string;
  refreshToken: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
