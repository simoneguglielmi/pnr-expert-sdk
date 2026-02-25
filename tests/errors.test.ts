import { describe, expect, it } from 'vitest';
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
} from '../src/errors.js';

describe('Errors', () => {
  describe('PnrError', () => {
    it('should create error with message', () => {
      const error = new PnrError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('PnrError');
      expect(error.statusCode).toBeUndefined();
    });

    it('should create error with message and status code', () => {
      const error = new PnrError('Test error', 500);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
    });

    it('should be instance of Error', () => {
      const error = new PnrError('Test error');
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('UnauthorizedError', () => {
    it('should have default message', () => {
      const error = new UnauthorizedError();
      expect(error.message).toBe('Unauthorized PE433');
      expect(error.name).toBe('UnauthorizedError');
      expect(error.statusCode).toBe(401);
    });

    it('should accept custom message', () => {
      const error = new UnauthorizedError('Custom unauthorized');
      expect(error.message).toBe('Custom unauthorized');
    });

    it('should be instance of PnrError', () => {
      const error = new UnauthorizedError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('RequestLimitError', () => {
    it('should have default message', () => {
      const error = new RequestLimitError();
      expect(error.message).toBe('Request Limit Reached');
      expect(error.name).toBe('RequestLimitError');
      expect(error.statusCode).toBe(401);
    });

    it('should accept custom message', () => {
      const error = new RequestLimitError('Quota exceeded');
      expect(error.message).toBe('Quota exceeded');
    });

    it('should be instance of PnrError', () => {
      const error = new RequestLimitError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('InvalidJsonError', () => {
    it('should have default message', () => {
      const error = new InvalidJsonError();
      expect(error.message).toBe(
        'Invalid JSON in request body. Make sure your PNR is inside quotes and uses \\n for newlines.',
      );
      expect(error.name).toBe('InvalidJsonError');
      expect(error.statusCode).toBe(400);
    });

    it('should accept custom message', () => {
      const error = new InvalidJsonError('Malformed JSON');
      expect(error.message).toBe('Malformed JSON');
    });

    it('should be instance of PnrError', () => {
      const error = new InvalidJsonError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('NoPnrProvidedError', () => {
    it('should have default message', () => {
      const error = new NoPnrProvidedError();
      expect(error.message).toBe('No PNR Provided');
      expect(error.name).toBe('NoPnrProvidedError');
      expect(error.statusCode).toBe(422);
    });

    it('should accept custom message', () => {
      const error = new NoPnrProvidedError('PNR field is empty');
      expect(error.message).toBe('PNR field is empty');
    });

    it('should be instance of PnrError', () => {
      const error = new NoPnrProvidedError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('UnprocessableEntryError', () => {
    it('should have default message', () => {
      const error = new UnprocessableEntryError();
      expect(error.message).toBe('Unprocessable Entry PE398');
      expect(error.name).toBe('UnprocessableEntryError');
      expect(error.statusCode).toBe(422);
    });

    it('should accept custom message', () => {
      const error = new UnprocessableEntryError('Cannot parse PNR');
      expect(error.message).toBe('Cannot parse PNR');
    });

    it('should be instance of PnrError', () => {
      const error = new UnprocessableEntryError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('ValidationError', () => {
    it('should create error with message and issues', () => {
      const issues = [{ path: 'pnr', message: 'Required' }];
      const error = new ValidationError('Validation failed', issues);
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error.issues).toEqual(issues);
    });

    it('should be instance of PnrError', () => {
      const error = new ValidationError('Validation failed', []);
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('TimeoutError', () => {
    it('should have default message', () => {
      const error = new TimeoutError();
      expect(error.message).toBe('Request timed out');
      expect(error.name).toBe('TimeoutError');
    });

    it('should accept custom message', () => {
      const error = new TimeoutError('Connection timed out after 30s');
      expect(error.message).toBe('Connection timed out after 30s');
    });

    it('should be instance of PnrError', () => {
      const error = new TimeoutError();
      expect(error).toBeInstanceOf(PnrError);
    });
  });

  describe('NetworkError', () => {
    it('should create error with message', () => {
      const error = new NetworkError('Failed to connect');
      expect(error.message).toBe('Failed to connect');
      expect(error.name).toBe('NetworkError');
    });

    it('should be instance of PnrError', () => {
      const error = new NetworkError('Network unavailable');
      expect(error).toBeInstanceOf(PnrError);
    });
  });
});
