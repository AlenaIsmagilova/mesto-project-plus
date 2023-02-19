import { Router } from 'express';
import getUsers, {
  getUserById,
  updateOwnAvatar,
  updateOwnProfile,
} from '../controllers/users';
import updateProfileValidator from '../validators/updateProfileValidator';
import updateAvatarValidator from '../validators/updateAvatarValidator';
import authValidator from '../validators/authValidator';

const userRouter = Router();
userRouter.get('/', authValidator, getUsers);
userRouter.get('/me', authValidator, getUserById);
userRouter.patch('/me', updateProfileValidator, updateOwnProfile);
userRouter.patch('/me/avatar', updateAvatarValidator, updateOwnAvatar);

export default userRouter;
