import { IsEmail, Length, IsEnum, IsDateString } from "class-validator";
import { SexEnum } from "../user.entity";

export class CreateUserDto {
  @Length(5)
  username: string;
  @Length(8)
  password: string;
  @Length(2)
  firstName: string;
  @Length(2)
  lastName: string;
  @IsEmail()
  email: string;
  @Length(2)
  dni: string;
  @Length(6)
  phone: string;
  @Length(2)
  address: string;
  @IsDateString()
  birthdate: number;
  @IsEnum(SexEnum)
  sex: SexEnum;
}