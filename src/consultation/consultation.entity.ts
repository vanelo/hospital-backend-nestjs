import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { PaginationResult } from "src/pagination/paginator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consultation{
    constructor(partial?: Partial<Consultation>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @ManyToOne(() => User, (user) => user.patientConsultations, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    patient: User;

    @ManyToOne(() => User, (user) => user.doctorConsultations, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    doctor: User;

    @Column()
    @Expose()
    name: string;

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
    diagnosis: string;

    @Column({
        nullable: true
    })
    @Expose()
    recomendations: string;
}

export type PaginatedConsultations = PaginationResult<Consultation>;
