import * as v from 'valibot';
import {
  InvalidJsonError,
  NetworkError,
  NoPnrProvidedError,
  PnrError,
  RequestLimitError,
  TimeoutError,
  UnauthorizedError,
  UnprocessableEntryError,
  ValidationError,
} from './errors.js';
import {
  PnrErrorResponseSchema,
  PnrRequestSchema,
  PnrResponseSchema,
} from './schemas.js';
import type { PnrClientOptions, PnrResponse } from './types.js';

const DEFAULT_BASE_URL = 'https://www.pnrexpert.com';
const DEFAULT_TIMEOUT = 30000;

/**
 * PNR Expert API Client
 *
 * @example
 * ```ts
 * const client = new PnrClient({ token: 'your-api-token' });
 * const result = await client.fetchPnr('RP/LON1A2345...');
 * console.log(result.flights);
 * ```
 */
export class PnrClient {
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly timeout: number;

  constructor(options: PnrClientOptions) {
    if (!options.token) {
      throw new Error('Token is required');
    }
    this.token = options.token;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
    this.timeout = options.timeout ?? DEFAULT_TIMEOUT;
  }

  /**
   * Fetch and parse a PNR string
   *
   * @param pnr - The raw PNR string to parse
   * @returns Parsed PNR response with flights and passengers
   * @throws {ValidationError} If the PNR string is invalid
   * @throws {UnauthorizedError} If the token is invalid or missing
   * @throws {RequestLimitError} If the API quota has been exceeded
   * @throws {InvalidJsonError} If the request body is malformed
   * @throws {NoPnrProvidedError} If no PNR is provided
   * @throws {UnprocessableEntryError} If the PNR cannot be processed
   * @throws {TimeoutError} If the request times out
   * @throws {NetworkError} If a network error occurs
   */
  async fetchPnr(pnr: string): Promise<PnrResponse> {
    // Validate request
    const parseResult = v.safeParse(PnrRequestSchema, { pnr });
    if (!parseResult.success) {
      throw new ValidationError('Invalid PNR request', parseResult.issues);
    }

    const url = this.buildUrl('/api/v1/pnr');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.buildHeaders(),
        body: JSON.stringify({ pnr }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        this.handleErrorResponse(response.status, data);
      }

      // Validate success response
      const responseResult = v.safeParse(PnrResponseSchema, data);
      if (!responseResult.success) {
        throw new ValidationError(
          'Invalid API response format',
          responseResult.issues,
        );
      }

      return responseResult.output;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof PnrError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new TimeoutError();
        }
        throw new NetworkError(error.message);
      }

      throw new NetworkError('Unknown error occurred');
    }
  }

  private handleErrorResponse(status: number, data: unknown): never {
    const errorResult = v.safeParse(PnrErrorResponseSchema, data);
    const errorMessage = errorResult.success
      ? errorResult.output.error
      : 'Unknown error';

    if (status === 401) {
      if (errorMessage.includes('Request Limit')) {
        throw new RequestLimitError(errorMessage);
      }
      throw new UnauthorizedError(errorMessage);
    }

    if (status === 400) {
      throw new InvalidJsonError(errorMessage);
    }

    if (status === 422) {
      if (errorMessage.includes('No PNR')) {
        throw new NoPnrProvidedError(errorMessage);
      }
      throw new UnprocessableEntryError(errorMessage);
    }

    throw new PnrError(errorMessage, status);
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }

  private buildHeaders(): Headers {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${this.token}`);
    return headers;
  }
}
