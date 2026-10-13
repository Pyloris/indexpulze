import express from 'express';
import { DataController } from '../../controllers/data.controller.js';

const router = express.Router();

router.get('/quotes', DataController.getQuotes);
router.get('/:index/constituents', DataController.getConstituents);
router.get('/:symbol', DataController.getTickerData);

export default router;
