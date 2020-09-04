import { container } from 'tsyringe';
import { parseISO } from 'date-fns';
import { Request, Response } from 'express';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { provider_id, date } = request.body;

    const parsedDate = parseISO(date);

    const createAppointment = container.resolve(CreateAppointmentService);

    const appointment = await createAppointment.execute({
      providerId: provider_id,
      userId,
      date: parsedDate,
    });

    return response.json(appointment);
  }
}

export default AppointmentsController;
