import express from 'express';
import { DataController } from '../../controllers/data.controller.js';

const router = express.Router();

router.get('/quotes', DataController.getQuotes);
router.get('/ticks', DataController.getTicks);
router.get('/:symbol/ticks', DataController.getTicks);
router.get('/:index/constituents', DataController.getConstituents);

// Async volume profile calculation trigger for index + constituents or individual stock
router.post('/:index/volume-profile/trigger', DataController.triggerIndexVolumeProfile);
router.post('/stock/:symbol/volume-profile/trigger', DataController.triggerIndexVolumeProfile);

// Fetch latest volume profile for a symbol or index
router.get('/:symbol/volume-profile', DataController.getVolumeProfile);

router.get('/:symbol', DataController.getTickerData);

export default router;
