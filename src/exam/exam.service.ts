import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Exam, PaginatedExams } from './exam.entity';
import { CreateExamDto } from './input/create.exam.dto';
import { ListExams, StartDateExamsFilter } from './input/list.exam';
import { UpdateExamDto } from './input/update.exam.dto';

@Injectable()
export class ExamService {
    private readonly logger = new Logger(ExamService.name);

    constructor(
        @InjectRepository(Exam)
        private readonly examsRepository: Repository<Exam>
    ){}
    
    private getExamsBaseQuery(): SelectQueryBuilder<Exam> {
        return this.examsRepository
        .createQueryBuilder('e')
        .orderBy('e.id', 'DESC');
    }

    private getExamsWithPatientFilteredQuery(
        filter?: ListExams
    ): SelectQueryBuilder<Exam> {
        let query = this.getExamsBaseQuery();

        if (!filter) {
            return query;
        }

        if (filter.startDate) {
            if (filter.startDate == StartDateExamsFilter.Today) {
                query = query.andWhere(
                `e.startDate >= CURDATE() AND e.startDate <= CURDATE() + INTERVAL 1 DAY`
                );
            }

            if (filter.startDate == StartDateExamsFilter.Tommorow) {
                query = query.andWhere(
                `e.startDate >= CURDATE() + INTERVAL 1 DAY AND e.startDate <= CURDATE() + INTERVAL 2 DAY`
                );
            }

            if (filter.startDate == StartDateExamsFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(e.startDate, 1) = YEARWEEK(CURDATE(), 1)');
            }

            if (filter.startDate == StartDateExamsFilter.NextWeek) {
                query = query.andWhere('YEARWEEK(e.startDate, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
        }

        if(filter.patientId){
            query = query.andWhere(`e.patientId = ${filter.patientId}`)
        }

        if(filter.doctorId){
            query = query.andWhere(`e.doctorId = ${filter.doctorId}`)
        }

        return query;
    }

    public async getExamsWithPatientFilteredPaginated(
        filter: ListExams,
        paginateOptions: PaginateOptions
    ): Promise<PaginatedExams> {
        return await paginate(
        await this.getExamsWithPatientFilteredQuery(filter),
        paginateOptions
        );
    }

    public async getExamWithPatient(
        id: number
    ): Promise<Exam | undefined> {
        const query = this.getExamsBaseQuery()
        .andWhere('e.id = :id', { id });

        this.logger.debug(query.getSql());

        return await query.getOne();
    }

    public async createExam(
        input: CreateExamDto, doctor: User, patient: User
    ): Promise<Exam> {
        return await this.examsRepository.save(
            new Exam({
                ...input,
                doctor: doctor,
                patient: patient,
                startDate: new Date(input.startDate),
                endDate: input.endDate ? new Date(input.endDate) : undefined
            })
        );
    }

    public async updateExam(
        exam: Exam, input: UpdateExamDto
    ): Promise<Exam> {
        return await this.examsRepository.save(
            new Exam({
                ...exam,
                ...input,
                startDate: input.startDate ? new Date(input.startDate) : exam.startDate,
                endDate: input.endDate ? new Date(input.endDate) : exam.endDate
            })
        );
    }
}
