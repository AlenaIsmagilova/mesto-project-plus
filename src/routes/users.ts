import { Router } from 'express';
import getUsers, {
  getUserById,
  updateOwnAvatar,
  updateOwnProfile,
} from '../controllers/users';
import updateProfileValidator from '../validators/updateProfileValidator';
import updateAvatarValidator from '../validators/updateAvatarValidator';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.get('/me', getUserById);
userRouter.patch('/me', updateProfileValidator, updateOwnProfile);
userRouter.patch('/me/avatar', updateAvatarValidator, updateOwnAvatar);

export default userRouter;
