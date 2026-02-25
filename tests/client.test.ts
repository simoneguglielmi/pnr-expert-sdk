import { describe, expect, it, vi } from 'vitest';
import { PnrClient } from '../src/client.js';
import {
  InvalidJsonError,
  NetworkError,
  NoPnrProvidedError,
  RequestLimitError,
  TimeoutError,
  UnauthorizedError,
  UnprocessableEntryError,
  ValidationError,
} from '../src/errors.js';
import { mockSuccessResponse, samplePnr } from './mocks/pnr.js';

describe('PnrClient', () => {
  describe('constructor', () => {
    it('should create client with required token', () => {
      const client = new PnrClient({ token: 'test-token' });
      expect(client).toBeInstanceOf(PnrClient);
    });

    it('should throw error when token is missing', () => {
      expect(() => new PnrClient({ token: '' })).toThrow('Token is required');
    });

    it('should accept custom baseUrl', () => {
      const client = new PnrClient({
        token: 'test-token',
        baseUrl: 'https://custom.api.com',
      });
      expect(client).toBeInstanceOf(PnrClient);
    });

    it('should accept custom timeout', () => {
      const client = new PnrClient({
        token: 'test-token',
        timeout: 5000,
      });
      expect(client).toBeInstanceOf(PnrClient);
    });
  });

  describe('fetchPnr', () => {
    it('should successfully fetch and parse PNR', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });
      const result = await client.fetchPnr(samplePnr);

      expect(result.success).toBe('true');
      expect(result.flights).toHaveLength(1);
      expect(result.passengers).toHaveLength(2);
      expect(result.flights[0].flightNumber).toBe('BA282');
      expect(result.passengers[0].name).toBe('SMITH/JOHNMR');
    });

    it('should send correct headers', async () => {
      const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      } as Response);

      const client = new PnrClient({ token: 'my-secret-token' });
      await client.fetchPnr(samplePnr);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://www.pnrexpert.com/api/v1/pnr',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ pnr: samplePnr }),
        }),
      );

      const callArgs = mockFetch.mock.lastCall;
      const headers = callArgs?.[1]?.headers as Headers;
      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Authorization')).toBe('Bearer my-secret-token');
    });

    it('should use custom baseUrl', async () => {
      const mockFetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      } as Response);

      const client = new PnrClient({
        token: 'test-token',
        baseUrl: 'https://custom.api.com',
      });
      await client.fetchPnr(samplePnr);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom.api.com/api/v1/pnr',
        expect.any(Object),
      );
    });

    it('should throw ValidationError for empty PNR', async () => {
      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr('')).rejects.toThrow(ValidationError);
      await expect(client.fetchPnr('')).rejects.toThrow('Invalid PNR request');
    });

    it('should throw UnauthorizedError for 401 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized PE433' }),
      } as Response);

      const client = new PnrClient({ token: 'invalid-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        UnauthorizedError,
      );
    });

    it('should throw RequestLimitError when quota exceeded', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Request Limit Reached' }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        RequestLimitError,
      );
    });

    it('should throw InvalidJsonError for 400 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            error:
              'Invalid JSON in request body. Make sure your PNR is inside quotes and uses \\n for newlines.',
          }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        InvalidJsonError,
      );
    });

    it('should throw NoPnrProvidedError for 422 with no PNR message', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: 'No PNR Provided' }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        NoPnrProvidedError,
      );
    });

    it('should throw UnprocessableEntryError for 422 response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ error: 'Unprocessable Entry PE398' }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        UnprocessableEntryError,
      );
    });

    it('should throw TimeoutError when request times out', async () => {
      vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
      });

      const client = new PnrClient({ token: 'test-token', timeout: 100 });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(TimeoutError);
    });

    it('should throw NetworkError for network failures', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(
        new Error('Network failure'),
      );

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(NetworkError);
      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        'Network failure',
      );
    });

    it('should throw ValidationError for invalid API response format', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ invalid: 'response' }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(ValidationError);
      await expect(client.fetchPnr(samplePnr)).rejects.toThrow(
        'Invalid API response format',
      );
    });

    it('should handle unknown error status codes', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Internal Server Error' }),
      } as Response);

      const client = new PnrClient({ token: 'test-token' });

      const error = await client.fetchPnr(samplePnr).catch((e) => e);
      expect(error.message).toBe('Internal Server Error');
      expect(error.statusCode).toBe(500);
    });
  });
});
