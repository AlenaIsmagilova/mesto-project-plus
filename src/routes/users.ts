import { Router } from 'express';
import {
  createUser,
  getUserById,
  getUsers,
  updateOwnAvatar,
  updateOwnProfile,
} from '../controllers/users';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.post('/', createUser);
userRouter.get('/:userId', getUserById);
userRouter.patch('/me', updateOwnProfile);
userRouter.patch('/me/avatar', updateOwnAvatar);

export default userRouter;
