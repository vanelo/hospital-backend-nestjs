import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { paginate, PaginateOptions } from 'src/pagination/paginator';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User, PaginatedUsers } from './user.entity';
import { ListUsers, BirthdateUsersFilter } from './input/list.users';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ){ }

    private getUsersBaseQuery(): SelectQueryBuilder<User> {
        return this.usersRepository
        .createQueryBuilder('u')
        .orderBy('u.id', 'DESC');
    }

    private getUsersFilteredQuery(
        filter?: ListUsers
    ): SelectQueryBuilder<User> {
        let query = this.getUsersBaseQuery();

        if (!filter) {
            return query;
        }

        if (filter.birthdate) {
            if (filter.birthdate == BirthdateUsersFilter.Today) {
                query = query.andWhere(
                `u.birthdate >= CURDATE() AND u.birthdate <= CURDATE() + INTERVAL 1 DAY`
                );
            }

            if (filter.birthdate == BirthdateUsersFilter.Tommorow) {
                query = query.andWhere(
                `u.birthdate >= CURDATE() + INTERVAL 1 DAY AND u.birthdate <= CURDATE() + INTERVAL 2 DAY`
                );
            }

            if (filter.birthdate == BirthdateUsersFilter.ThisWeek) {
                query = query.andWhere('YEARWEEK(u.birthdate, 1) = YEARWEEK(CURDATE(), 1)');
            }

            if (filter.birthdate == BirthdateUsersFilter.NextWeek) {
                query = query.andWhere('YEARWEEK(u.birthdate, 1) = YEARWEEK(CURDATE(), 1) + 1');
            }
        }

        if(filter.id){
            query = query.andWhere(`c.id = ${filter.id}`)
        }

        return query;
    }

    public async getUsersFilteredPaginated(
        filter: ListUsers,
        paginateOptions: PaginateOptions
    ): Promise<PaginatedUsers> {
        return await paginate(
        await this.getUsersFilteredQuery(filter),
        paginateOptions
        );
    }

}
