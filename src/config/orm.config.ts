import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { ClinicalSpecialty } from 'src/clinical-specialty/clinical-specialty.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, ClinicalSpecialty],
    synchronize: true,  // Automatically update the database schema. Use only in development envirnment because some changes need data migrations
    dropSchema: Boolean(parseInt(process.env.DB_DROP_SCHEMA))
  })
);