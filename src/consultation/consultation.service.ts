import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/auth/user.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Consultation, PaginatedConsultations } from './consultation.entity';
import { CreateConsultationDto } from './input/create.consultation.dto';
import { ListConsultations, StartDateConsultationsFilter } from './input/list.consultations';
import { UpdateConsultationDto } from './input/update.consultation.dto';

@Injectable()
export class ConsultationService {
    private readonly logger = new Logger(ConsultationService.name);

    constructor(
        @InjectRepository(Consultation)
        private readonly consultationsRepository: Repository<Consultation>
    ){ }

    private getConsultationsBaseQuery(): SelectQueryBuilder<Consultation> {
        return this.consultationsRepository
        .createQueryBuilder('c')
        .orderBy('c.id', 'DESC');
    }

    private getConsultationsWithPatientFilteredQuery(
        filter?: ListConsultations
    ): SelectQueryBuilder<Consultation> {
        let query = this.getConsultationsBaseQuery();

        if (!filter) {
            return query;
        }

        if (filter.startDate) {
            if (filter.startDate == StartDateConsultationsFilter.Today) {
                query = query.andWhere(
                `c.startAtDate >= CURDATE() AND c.startAtDate <= CURDATE() + INTERVAL 1 DAY`
                );
            }

            if (filter.startDate == StartDateConsultationsFilter.Tommorow) {
                query = query.andWhere(
                `c.startDate >= CURDATE() + INTERVAL 1 DAY AND c.startDate <= CURDATE() + INTERVAL 2 DAY`
                );
            }

            if (filter.startDate == StartDateConsultationsFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(c.startDate, 1) = YEARWEEK(CURDATE(), 1)');
            }

            if (filter.startDate == StartDateConsultationsFilter.NextWeek) {
                query = query.andWhere('YEARWEEK(e.startDate, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
        }

        if(filter.patientId){
            query = query.andWhere(`c.patientId = ${filter.patientId}`)
        }

        if(filter.doctorId){
            query = query.andWhere(`c.doctorId = ${filter.doctorId}`)
        }

        return query;
    }

    public async getConsultationsWithPatientFilteredPaginated(
        filter: ListConsultations,
        paginateOptions: PaginateOptions
    ): Promise<PaginatedConsultations> {
        return await paginate(
        await this.getConsultationsWithPatientFilteredQuery(filter),
        paginateOptions
        );
    }

    public async getConsultationWithPatient(
        id: number
    ): Promise<Consultation | undefined> {
        const query = this.getConsultationsBaseQuery()
        .andWhere('c.id = :id', { id });

        this.logger.debug(query.getSql());

        return await query.getOne();
    }

    public async createConsultation(
        input: CreateConsultationDto, doctor: User, patient: User
    ): Promise<Consultation> {
        return await this.consultationsRepository.save(
            new Consultation({
                ...input,
                doctor: doctor,
                patient: patient,
                startDate: new Date(input.startDate),
                endDate: input.endDate ? new Date(input.endDate) : undefined
            })
        );
    }

    public async updateConsultation(
        consultation: Consultation, input: UpdateConsultationDto
    ): Promise<Consultation> {
        return await this.consultationsRepository.save(
            new Consultation({
                ...consultation,
                ...input,
                startDate: input.startDate ? new Date(input.startDate) : consultation.startDate,
                endDate: input.endDate ? new Date(input.endDate) : consultation.endDate
            })
        );
    }
}
