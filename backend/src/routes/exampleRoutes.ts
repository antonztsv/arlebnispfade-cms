import { Router } from 'express';
import { getExample, createExample } from '@/controllers/exampleController';

const router = Router();

router.get('/example', getExample);
router.post('/example', createExample);

export default router;
