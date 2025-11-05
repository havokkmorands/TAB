import { ArrayNotEmpty, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from './create-address.dto';


export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres' })
  name: string;

  @IsEmail({}, { message: 'O e-mail informado não é válido' })
  email: string;

  @IsNotEmpty({ message: 'A senha é obrigatório' })
  @MinLength(12, { message: 'A senha deve ter pelo menos 12 caracteres' })
  @MaxLength(64, { message: 'A senha deve ter no máximo 64 caracteres' })
  @Matches(/[A-Z]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula.',
  })
  @Matches(/[a-z]/, {
    message: 'A senha deve conter pelo menos uma letra minúscula.',
  })
  @Matches(/[0-9]/, {
    message: 'A senha deve conter pelo menos um número.',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'A senha deve conter pelo menos um caractere especial.',
  })
  password: string;

  @ArrayNotEmpty({ message: 'É necessário informar pelo menos um endereço.' })
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[];
}
