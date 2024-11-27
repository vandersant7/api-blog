import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';
import { Repository } from 'typeorm';
import { User } from '../user.interface';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  createUser(user: User): Observable<User> {
    return this.authService.hashPassword(user.password).pipe(
      switchMap((passwordHash: string) => {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.username = user.username;
        newUser.email = user.email;
        newUser.password = passwordHash;

        return from(this.userRepository.save(newUser)).pipe(
          map((user: User) => {
            const { password, ...result } = user;
            return result;
          }),
          catchError((err) => throwError(err)),
        );
      }),
    );
    //return from(this.userRepository.save(user));
  }

  findUser(id: number): Observable<User> {
    return from(
      this.userRepository.findOne({
        where: { id },
      }),
    );
  }

  findAll(): Observable<User[]> {
    return from(this.userRepository.find());
  }

  deleteUser(id: number): Observable<any> {
    return from(this.userRepository.delete(id));
  }

  updateUser(id: number, user: User): Observable<any> {
    return from(this.userRepository.update(id, user));
  }
}
