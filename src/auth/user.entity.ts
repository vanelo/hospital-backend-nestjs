import { Expose } from "class-transformer";
import { ClinicalSpecialty } from "src/clinical-specialty/clinical-specialty.entity";
import { Consultation } from "src/consultation/consultation.entity";
import { Exam } from "src/exam/exam.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum SexEnum{
    Other=1,
    Male,
    Female
}

@Entity()
export class User {
    constructor(partial?: Partial<User>) {
        Object.assign(this, partial);
    }

    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column({unique: true})
    @Expose()
    username: string;

    @Column()
    password: string;

    @Column()
    @Expose()
    firstName: string;

    @Column()
    @Expose()
    lastName: string;

    @Column({
        nullable: true
    })
    @Expose()
    dni: string;

    @Column({unique: true})
    @Expose()
    email: string;

    @Column({
        nullable: true
    })
    @Expose()
    phone: string;

    @Column('enum', {
        enum: SexEnum,
        default: SexEnum.Other
    })
    @Expose()
    sex: SexEnum;

    @Column({
        nullable: true
    })
    @Expose()
    birthdate: Date;

    @Column({
        nullable: true
    })
    @Expose()
    address: string;

    @Column({
        nullable: true
    })
    @Expose()
    profesionalRegisterNumber: string;

    @ManyToMany(()=> ClinicalSpecialty, (clinicalSpecialty)=> clinicalSpecialty.users)
    @Expose()
    clinicalSpecialties: ClinicalSpecialty[];

    @OneToMany(() => Consultation, (consultation) => consultation.patient, {
        cascade: true
    })
    @Expose()
    patientConsultations: Consultation[]

    @OneToMany(() => Consultation, (consultation) => consultation.doctor, {
        cascade: true
    })
    @Expose()
    doctorConsultations: User[]

    @OneToMany(() => Exam, (exam) => exam.patient, {
        cascade: true
    })
    @Expose()
    patientExams: Consultation[]

    @OneToMany(() => Exam, (exam) => exam.doctor, {
        cascade: true
    })
    @Expose()
    doctorExams: User[]
}