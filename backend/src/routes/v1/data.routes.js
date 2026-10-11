import express from 'express';
import { DataController } from '../../controllers/data.controller.js';

const router = express.Router();

router.get('/:symbol', DataController.getTickerData);

export default router;
