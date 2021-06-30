import { IsDateString, IsString, Length, IsOptional } from "class-validator";

export class CreateExamDto {
  @IsString()
  @Length(5, 255)
  name: string;

  @IsString()
  @Length(5, 255)
  type: string;

  @Length(1)
  patientId: number;

  @Length(1)
  doctorId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;
}