import 'dotenv/config';
import { describe, it, expect, beforeAll } from 'vitest';
import { PnrClient } from '../src/client.js';
import type { PnrResponse } from '../src/types.js';

describe('PNR Expert SDK Integration Tests', () => {
  let apiKey: string | undefined;
  let client: PnrClient;
  const errorMessage =
    'API_KEY environment variable is required for integration tests. Please create a .env file with API_KEY=your-api-key';

  beforeAll(() => {
    // Check for API_KEY environment variable
    apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error(errorMessage);
    }

    // Initialize the client with the API key
    client = new PnrClient({ token: apiKey });
  });

  it('should fetch PNR and return valid response', async () => {
    const pnrString = '1 EN8251Q 20APR 1 TRNMUC SS2  0955  1105  /DCEN /E';

    const response: PnrResponse = await client.fetchPnr(pnrString);

    expect(response).toBeDefined();
    expect(typeof response.success).toBe('boolean');
    expect(response.data).toBeDefined();
    expect(response.remaining).toBeDefined();
    expect(Array.isArray(response.data.passengers)).toBe(true);
    expect(Array.isArray(response.data.flights)).toBe(true);
  }, 60000);
});
