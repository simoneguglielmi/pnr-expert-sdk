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
    const pnrString = `1 EK 98B 07APR 2 FCODXB*SS2 1545 2330 /DCEK /E
2 EK 318B 08APR 3 DXBNRT*SS2 0240 1735 /DCEK /E
3 EK 317K 25APR 6 KIXDXB*SS2 2345 0515 26APR 7 /DCEK /E
4 EK 97K 26APR 7 DXBFCO*SS2 0910 1325 /DCEK /E`;

    const response: PnrResponse = await client.fetchPnr(pnrString);

    expect(response).toBeDefined();
    expect(typeof response.success).toBe('boolean');
    expect(response.data).toBeDefined();
    expect(response.remaining).toBeDefined();
    expect(Array.isArray(response.data.passengers)).toBe(true);
    expect(Array.isArray(response.data.flights)).toBe(true);
  }, 60000);
});
