import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Consultation, PaginatedConsultations } from './consultation.entity';
import { ListConsultations, StartAtConsultationsFilter } from './input/list.consultations';

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

        if (filter.startAt) {
        if (filter.startAt == StartAtConsultationsFilter.Today) {
            query = query.andWhere(
            `c.startAtDate >= CURDATE() AND c.startAtDate <= CURDATE() + INTERVAL 1 DAY`
            );
        }

        if (filter.startAt == StartAtConsultationsFilter.Tommorow) {
            query = query.andWhere(
            `c.startAtDate >= CURDATE() + INTERVAL 1 DAY AND c.startAtDate <= CURDATE() + INTERVAL 2 DAY`
            );
        }

        if (filter.startAt == StartAtConsultationsFilter.ThisWeek) {
            query = query.andWhere('YEARWEEK(c.startAtDate, 1) = YEARWEEK(CURDATE(), 1)');
        }

        if (filter.startAt == StartAtConsultationsFilter.NextWeek) {
            query = query.andWhere('YEARWEEK(e.startAt, 1) = YEARWEEK(CURDATE(), 1) + 1');
        }
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
}
