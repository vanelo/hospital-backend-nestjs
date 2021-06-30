import { Body, ForbiddenException, NotFoundException, Param, ParseIntPipe, Patch, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { AuthService } from 'src/auth/auth.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Consultation } from './consultation.entity';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from './input/create.consultation.dto';
import { ListConsultations } from './input/list.consultations';
import { UpdateConsultationDto } from './input/update.consultation.dto';

@Controller('consultations')
export class ConsultationController {
    private readonly logger = new Logger(ConsultationController.name);
    constructor(
        private readonly consultationService: ConsultationService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
         @InjectRepository(Consultation)
        private readonly consultationsRepository: Repository<Consultation>
    ){ }


    // Get consultations
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListConsultations) {
        const consultations = await this.consultationService
        .getConsultationsWithPatientFilteredPaginated(
            filter,
            {
            total: true,
            currentPage: filter.page,
            limit: 10
            }
        );
        return consultations;
    }

    // Get single consultation
    @Get(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const consultation = await this.consultationService.getConsultationWithPatient(id);

        if (!consultation) {
            throw new NotFoundException();
        }

        return consultation;
    }

    // Create a consultation
    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
        @Body() input: CreateConsultationDto
    ) {
        // Get doctor
        const doctor = await this.usersRepository.findOne(input.doctorId);

        // Verify if the user is a doctor
        if(!doctor.profesionalRegisterNumber){
            throw new ForbiddenException();
        }

        // Get patient
        const patient = await this.usersRepository.findOne(input.patientId);
        return await this.consultationService
            .createConsultation(input, doctor, patient);
    }

    // Update consultation
    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateConsultationDto,
    @CurrentUser() user: User
    ) {
        const consultation = await this.consultationsRepository.findOne(id);

        if (!consultation) {
            throw new NotFoundException();
        }

        if (!user.profesionalRegisterNumber) {
            throw new ForbiddenException(
            null, `You are not authorized to change this consultation`
            );
        }

        return await this.consultationService.updateConsultation(consultation, input);
    }
}
