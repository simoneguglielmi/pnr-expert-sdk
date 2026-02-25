import type * as v from 'valibot';
import type {
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

export type PnrRequest = v.InferOutput<typeof PnrRequestSchema>;
export type PnrResponse = v.InferOutput<typeof PnrResponseSchema>;
export type PnrErrorResponse = v.InferOutput<typeof PnrErrorResponseSchema>;

export type Airport = v.InferOutput<typeof AirportSchema>;
export type Location = v.InferOutput<typeof LocationSchema>;
export type ArrivalLocation = v.InferOutput<typeof ArrivalLocationSchema>;
export type AircraftType = v.InferOutput<typeof AircraftTypeSchema>;
export type Distance = v.InferOutput<typeof DistanceSchema>;
export type FlightDuration = v.InferOutput<typeof FlightDurationSchema>;
export type Status = v.InferOutput<typeof StatusSchema>;
export type OperatedBy = v.InferOutput<typeof OperatedBySchema>;
export type Flight = v.InferOutput<typeof FlightSchema>;
export type Seat = v.InferOutput<typeof SeatSchema>;
export type Passenger = v.InferOutput<typeof PassengerSchema>;

export interface PnrClientOptions {
  /**
   * Bearer token for API authentication
   */
  token: string;
  /**
   * Base URL for the API (defaults to https://www.pnrexpert.com)
   */
  baseUrl?: string;
  /**
   * Request timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;
}
