import { container } from 'tsyringe';
import { Request, Response } from 'express';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const providerId = request.user.id;
    const { day, month, year } = request.body;

    const listProviderAppointments = container.resolve(
      ListProviderAppointmentsService,
    );

    const appointments = await listProviderAppointments.execute({
      providerId,
      day,
      month,
      year,
    });

    return response.json(appointments);
  }
}

export default ProviderAppointmentsController;
