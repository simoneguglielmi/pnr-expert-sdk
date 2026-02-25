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
