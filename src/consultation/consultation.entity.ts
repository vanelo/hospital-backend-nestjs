import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consultation{
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

    @Column()
    @Expose()
    endDate: Date;

    @Column()
    @Expose()
    diagnosis: string;

    @Column()
    @Expose()
    recomendations: string;
}