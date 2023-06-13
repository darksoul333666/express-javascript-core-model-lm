import express from 'express';
import { CreateTemplate, GetTemplatesList } from '../src/controllers/TemplateController.js';

const router = express.Router();

/* GET users listing. */
router.post('/create', CreateTemplate);
router.get('/get', GetTemplatesList);

export default router;
