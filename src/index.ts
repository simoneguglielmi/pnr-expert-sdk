// Client
export { PnrClient } from './client.js';

// Types
export type {
  AircraftType,
  Airport,
  ArrivalLocation,
  Distance,
  Flight,
  FlightDuration,
  Location,
  OperatedBy,
  Passenger,
  PnrClientOptions,
  PnrErrorResponse,
  PnrRequest,
  PnrResponse,
  Seat,
  Status,
  ErrorConstructor,
  ErrorFormatter,
  ErrorSummary,
} from './types.js';

// Schemas (for advanced usage)
export {
  AircraftTypeSchema,
  AirportSchema,
  ArrivalLocationSchema,
  DistanceSchema,
  FlightDurationSchema,
  FlightSchema,
  LocationSchema,
  OperatedBySchema,
  PassengerSchema,
  PnrErrorResponseSchema,
  PnrRequestSchema,
  PnrResponseSchema,
  SeatSchema,
  StatusSchema,
} from './schemas.js';

// Errors
export {
  InvalidJsonError,
  NetworkError,
  NoPnrProvidedError,
  PnrError,
  RequestLimitError,
  TimeoutError,
  UnauthorizedError,
  UnprocessableEntryError,
  ValidationError,
  getError,
} from './errors.js';
