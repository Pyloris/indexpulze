import fs from 'fs/promises';
import path from 'path';
import { catchError } from '../errors/catch-error.js';
import { ApiResponse } from '../utils/api-response.js';

export class DataController {
  static getTickerData = catchError(async (req, res, next) => {
    const { symbol } = req.params;
    const { from, timeframe = '15m' } = req.query;

    const mockFilePath = path.join(process.cwd(), 'src/mock/old-data-upto-ticker-any-symbol.json');
    const fileContent = await fs.readFile(mockFilePath, 'utf-8');
    const mockData = JSON.parse(fileContent).data;

    let filteredData = mockData;
    if (from) {
      const fromTimestamp = Number(from);
      filteredData = mockData.filter((d) => d.timestamp >= fromTimestamp);
    }

    return ApiResponse.success(res, {
      symbol,
      timeframe,
      data: filteredData
    }, "Data retrieved successfully");
  });
}
