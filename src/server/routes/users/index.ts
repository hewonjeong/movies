import { postUser, getUser, getAllUser } from './users.ctrl';
import { Router } from 'express';

const router = Router();

router.post('/', postUser);
router.get('/:userId', getUser);
router.get('/', getAllUser);

export default router;
