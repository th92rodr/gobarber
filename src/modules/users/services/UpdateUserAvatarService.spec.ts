import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

describe('Update User Avatar', () => {
  it('should be able to update a user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update a non existing user avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatar.execute({
        userId: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete the old avatar when updating it', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAvatar.execute({
      userId: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
