import { ErrorFormatter, ErrorConstructor, ErrorSummary } from './types.js';

/**
 * Base error class for PNR Expert SDK errors
 */
export class PnrError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'PnrError';
  }
}

/**
 * Error thrown when the API returns an unauthorized response (401)
 */
export class UnauthorizedError extends PnrError {
  constructor(message = 'Unauthorized PE433') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Error thrown when the request limit has been reached (401)
 */
export class RequestLimitError extends PnrError {
  constructor(message = 'Request Limit Reached') {
    super(message, 401);
    this.name = 'RequestLimitError';
  }
}

/**
 * Error thrown when the request body contains invalid JSON (400)
 */
export class InvalidJsonError extends PnrError {
  constructor(
    message = 'Invalid JSON in request body. Make sure your PNR is inside quotes and uses \\n for newlines.',
  ) {
    super(message, 400);
    this.name = 'InvalidJsonError';
  }
}

/**
 * Error thrown when no PNR is provided in the request (422)
 */
export class NoPnrProvidedError extends PnrError {
  constructor(message = 'No PNR Provided') {
    super(message, 422);
    this.name = 'NoPnrProvidedError';
  }
}

/**
 * Error thrown when the entry is unprocessable (422)
 */
export class UnprocessableEntryError extends PnrError {
  constructor(message = 'Unprocessable Entry PE398') {
    super(message, 422);
    this.name = 'UnprocessableEntryError';
  }
}

/**
 * Error thrown when request validation fails
 */
export class ValidationError extends PnrError {
  constructor(
    message: string,
    public readonly issues: unknown[],
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error thrown when the request times out
 */
export class TimeoutError extends PnrError {
  constructor(message = 'Request timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Error thrown for network-related issues
 */
export class NetworkError extends PnrError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

const errorMap = new Map<ErrorConstructor, ErrorFormatter>([
  [
    ValidationError,
    (error) => {
      if (error instanceof ValidationError) {
        return ['Validation error', error.message, error.issues];
      }
      return ['Validation error', 'Unknown validation error'];
    },
  ],
  [UnauthorizedError, (error) => ['Authentication failed', error.message]],
  [RequestLimitError, (error) => ['Rate limit reached', error.message]],
  [InvalidJsonError, (error) => ['Invalid JSON', error.message]],
  [NoPnrProvidedError, (error) => ['No PNR provided', error.message]],
  [UnprocessableEntryError, (error) => ['Cannot process PNR', error.message]],
  [TimeoutError, (error) => ['Request timed out', error.message]],
  [NetworkError, (error) => ['Network error', error.message]],
  [
    PnrError,
    (error) => {
      if (error instanceof PnrError) {
        return ['API error', error.message, { status: error.statusCode }];
      }
      return ['API error', 'Unknown API error', { status: undefined }];
    },
  ],
]);

export function getError(error: unknown): ErrorSummary {
  for (const [ErrorClass, getDetails] of errorMap) {
    if (error instanceof ErrorClass) {
      const [title, ...details] = getDetails(error);
      return { title, details };
    }
  }

  if (error instanceof Error) {
    return { title: 'Unexpected error', details: [error.message] };
  }

  return { title: 'Unknown error', details: [String(error)] };
}
