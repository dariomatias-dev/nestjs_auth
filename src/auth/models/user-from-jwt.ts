import { TokenType } from 'src/enums/token-type.enum';

export interface UserFromJwt {
  id: string;
  token_type?: TokenType;
  email: string;
  roles: string[];
}
