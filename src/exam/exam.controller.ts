import { Body, ClassSerializerInterceptor, Controller, ForbiddenException, Get, Logger, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';
import { ExamService } from './exam.service';
import { CreateExamDto } from './input/create.exam.dto';
import { ListExams } from './input/list.exam';
import { UpdateExamDto } from './input/update.exam.dto';

@Controller('exams')
export class ExamController {
    private readonly logger = new Logger(ExamController.name);
    constructor(
        private readonly examService: ExamService,
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Exam)
        private readonly examsRepository: Repository<Exam>
    ){ }


    // Get exams
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListExams) {
        const exams = await this.examService
        .getExamsWithPatientFilteredPaginated(
            filter,
            {
            total: true,
            currentPage: filter.page,
            limit: 10
            }
        );
        return exams;
    }

    // Get single exam
    @Get(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const exam = await this.examService.getExamWithPatient(id);

        if (!exam) {
            throw new NotFoundException();
        }

        return exam;
    }

    // Create a exam
    @Post()
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
        @Body() input: CreateExamDto
    ) {
        // Get doctor
        const doctor = await this.usersRepository.findOne(input.doctorId);

        // Verify if the user is a doctor
        if(!doctor.profesionalRegisterNumber){
            throw new ForbiddenException();
        }

        // Get patient
        const patient = await this.usersRepository.findOne(input.patientId);
        return await this.examService
            .createExam(input, doctor, patient);
    }

    // Update exam
    @Patch(':id')
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async update(
    @Param('id', ParseIntPipe) id,
    @Body() input: UpdateExamDto,
    @CurrentUser() user: User
    ) {
        const exam = await this.examsRepository.findOne(id);

        if (!exam) {
            throw new NotFoundException();
        }

        if (!user.profesionalRegisterNumber) {
            throw new ForbiddenException(
            null, `You are not authorized to change this exam`
            );
        }

        return await this.examService.updateExam(exam, input);
    }
}
