import { Router } from "express";
import multer from "multer";

import CreateUserService from "../services/CreateUser.service";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import uploadConfig from "../config/upload";
import UpdateUserAvatarService from "../services/UpdateUserAvatar.service";

const usersRouter = Router();

const upload = multer(uploadConfig);

usersRouter.post("/", async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  delete user.password;

  return response.json(user);
});

usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      userID: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(user);
  }
);

export default usersRouter;
