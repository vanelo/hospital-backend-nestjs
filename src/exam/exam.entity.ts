import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Exam {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: number;

    @Column()
    @Expose()
    type: string;

    @Column()
    @Expose()
    starDate: Date;

    @Column()
    @Expose()
    endDate: Date;

    @Column()
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