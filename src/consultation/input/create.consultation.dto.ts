import { IsDateString, IsString, Length, IsOptional } from "class-validator";

export class CreateConsultationDto {
  @IsString()
  @Length(5, 255)
  name: string;

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