import { IsNotEmpty, MIN_LENGTH, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name: string;
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;
}
