import { injectable, inject } from 'tsyringe';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  providerId: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    providerId,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    return this.appointmentsRepository.findAllInDayFromProvider({
      providerId,
      day,
      month,
      year,
    });
  }
}

export default ListProviderAppointmentsService;
