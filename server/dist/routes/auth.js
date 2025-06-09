import { Router } from 'express';
const router = Router();
router.post('/register', (_req, res) => res.send('register stub'));
router.post('/login', (_req, res) => res.send('login stub'));
export default router;
