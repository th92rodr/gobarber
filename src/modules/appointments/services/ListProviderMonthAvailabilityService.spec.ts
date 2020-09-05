import 'reflect-metadata';

import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabilityService;

describe('List Provider Month Availability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month availability from a provider', async () => {
    for (let hour = 8; hour <= 17; hour++) {
      await fakeAppointmentsRepository.create({
        providerId: 'user',
        userId: 'user',
        date: new Date(2020, 4, 20, hour, 0, 0),
      });
    }

    for (let hour = 8; hour <= 17; hour++) {
      await fakeAppointmentsRepository.create({
        providerId: 'user',
        userId: 'user',
        date: new Date(2020, 4, 21, hour, 0, 0),
      });
    }

    const availability = await listProviderMonthAvailability.execute({
      providerId: 'user',
      year: 2020,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 20, available: false },
        { day: 21, available: false },
        { day: 22, available: true },
        { day: 23, available: true },
      ]),
    );
  });
});
