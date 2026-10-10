import express from 'express';
import { getTickerData } from '../../controllers/data.controller.js';

const router = express.Router();

router.get('/:symbol', getTickerData);

export default router;
