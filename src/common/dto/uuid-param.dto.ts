import { IsUUID } from 'class-validator';

export class UUIDParamDto {
  @IsUUID('4')
  id: string;
}
