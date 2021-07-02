import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthGuardJwt } from "./auth-guard.jwt";
import { AuthService } from "./auth.service";
import { UserService } from "./users.service";
import { CreateUserDto } from "./input/create.user.dto";
import { SexEnum, User } from "./user.entity";
import { ListUsers, BirthdateUsersFilter } from './input/list.users';

@Controller('users')
export class UsersController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const passwordHash = await this.authService.hashPassword(createUserDto.password);
    const user = new User({
      ...createUserDto,
      password: passwordHash,
      birthdate: new Date(createUserDto.birthdate)
    });

    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });

    if (existingUser) {
      throw new BadRequestException(['username or email is already taken']);
    }

    // user.username = createUserDto.username;
    // user.password = await this.authService.hashPassword(createUserDto.password);
    // user.email = createUserDto.email;
    // user.firstName = createUserDto.firstName;
    // user.lastName = createUserDto.lastName;

    return {
      ...(await this.userRepository.save(user)),
      token: this.authService.getTokenForUser(user)
    }
  }


    // Get users
    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(AuthGuardJwt)
    @UseInterceptors(ClassSerializerInterceptor)
    async findAll(@Query() filter: ListUsers) {
        const users = await this.userService
        .getUsersFilteredPaginated(
            filter,
            {
            total: true,
            currentPage: filter.page,
            limit: 10
            }
        );
        return users;
    }
}