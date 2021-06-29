import { Expose } from "class-transformer";
import { User } from "src/auth/user.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClinicalSpecialty{
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;

    @Column()
    @Expose()
    name: string;

    @ManyToMany(
        () => User, (user) => user.clinicalSpecialties, { cascade: true }
    )
    @JoinTable()
    users: User[];
}