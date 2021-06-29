import { Expose } from "class-transformer";
import { ClinicalSpecialty } from "src/clinical-specialty/clinical-specialty.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

export enum SexEnum{
    Other=1,
    Male,
    Female
}

@Entity()
export class User {
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
}