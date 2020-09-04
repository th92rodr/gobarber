import { getRepository, Repository, Not } from 'typeorm';

import User from '../entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({
      where: { email },
    });
  }

  public async findAllProviders({
    exceptUserId,
  }: IFindAllProvidersDTO): Promise<User[]> {
    if (exceptUserId) {
      return this.ormRepository.find({
        where: {
          id: Not(exceptUserId),
        },
      });
    } else {
      return this.ormRepository.find();
    }
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);
    return this.ormRepository.save(user);
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UsersRepository;
