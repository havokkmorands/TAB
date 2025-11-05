import { IsNotEmpty } from 'class-validator';

export class CreatePermisionDto {
  @IsNotEmpty({ message: 'O funcionario é obrigatório.' })
  userId: string;
  @IsNotEmpty({ message: 'O cargo é obrigatório.' })
  roleId: string;
  @IsNotEmpty({ message: 'O gerente é obrigatório.' })
  assignedBy: string;
  @IsNotEmpty({ message: 'A descrição é obrigatória.' })
  description: string;
}
