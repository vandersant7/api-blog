import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../user.interface';
import { Observable } from 'rxjs';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: User): Observable<User> {
    return this.userService.createUser(user);
  }

  @Get(':id')
  findUser(@Param() params) {
    return this.userService.findUser(params.id);
  }

  @Get('/')
  findAllUser(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Observable<User> {
    return this.userService.deleteUser(Number(id));
  }

  @Put(':id')
  updateUser(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateUser(Number(id), user);
  }
}
