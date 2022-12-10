import { Router } from 'express';
import { loginUser } from '../controllers/userController.js';
import {
  registerUser,
  updateUser,
  deleteUser,
  getUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id').put(updateUser).delete(deleteUser);
router.route('/me').get(protect, getUser);

export default router;
