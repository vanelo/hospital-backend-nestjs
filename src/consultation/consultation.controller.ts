import { NotFoundException, Param, ParseIntPipe, UseGuards, UsePipes } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { Controller, Get, Query, Logger } from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { ConsultationService } from './consultation.service';
import { ListConsultations } from './input/list.consultations';

@Controller('consultations')
export class ConsultationController {
    private readonly logger = new Logger(ConsultationController.name);
    constructor(
        private readonly consultationService: ConsultationService
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
            limit: 2
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
}
