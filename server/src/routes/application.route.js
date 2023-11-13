import { Router } from 'express';
import { createApplication } from '../controllers/application.controller.js';

const router = Router();

router.post('/', createApplication);

export { router };
