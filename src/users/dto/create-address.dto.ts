import { IsNotEmpty } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty({ message: 'A rua é obrigatória.' })
  street: string;

  @IsNotEmpty({ message: 'O número é obrigatório.' })
  number: string;

  @IsNotEmpty({ message: 'A cidade é obrigatória.' })
  city: string;

  @IsNotEmpty({ message: 'O estado é obrigatório.' })
  state: string;

  @IsNotEmpty({ message: 'O país é obrigatório.' })
  country: string;

  @IsNotEmpty({ message: 'O bairro é obrigatório.' })
  county: string;

  @IsNotEmpty({ message: 'O CEP é obrigatório.' })
  zipCode: string;
}
