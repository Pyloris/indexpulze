import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/:symbol', (req, res) => {
  const { symbol } = req.params;
  const { from, timeframe = '15m' } = req.query;

  try {
    const mockFilePath = path.join(process.cwd(), 'src/mock/ticker-data-any-symbol.json');
    const fileContent = fs.readFileSync(mockFilePath, 'utf-8');
    const mockData = JSON.parse(fileContent).data;

    let filteredData = mockData;
    if (from) {
      const fromTimestamp = Number(from);
      filteredData = mockData.filter(d => d.timestamp >= fromTimestamp);
    }

    res.json({
      symbol,
      timeframe,
      data: filteredData
    });
  } catch (error) {
    console.error('Error reading mock data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;
