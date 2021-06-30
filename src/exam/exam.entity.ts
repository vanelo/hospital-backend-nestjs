import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { PaginationResult } from "src/pagination/paginator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Exam {
    constructor(partial?: Partial<Exam>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @Column()
    @Expose()
    type: string;

    @Column()
    @Expose()
    startDate: Date;

    @Column({
        nullable: true
    })
    @Expose()
    endDate: Date;

    @Column({
        nullable: true
    })
    @Expose()
    results: string;

    @ManyToOne(() => User, (user) => user.patientExams, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    patient: User;

    @ManyToOne(() => User, (user) => user.doctorExams, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    doctor: User;
}

export type PaginatedExams = PaginationResult<Exam>;