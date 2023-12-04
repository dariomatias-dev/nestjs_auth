import { TokenType } from 'src/enums/token-type.enum';

export interface UserFromJwt {
  id: string;
  tokenType?: TokenType;
  email: string;
  roles: string[];
}
