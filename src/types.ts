import type * as v from "valibot";
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
	TransitTimeSchema,
} from "./schemas.js";

export type PnrRequest = v.InferOutput<typeof PnrRequestSchema>;
export type PnrApiResponse = v.InferOutput<typeof PnrResponseSchema>;
export type PnrResponse = Omit<PnrApiResponse, "success"> & {
	success: boolean;
};
export type PnrErrorResponse = v.InferOutput<typeof PnrErrorResponseSchema>;

export type Airport = v.InferOutput<typeof AirportSchema>;
export type Location = v.InferOutput<typeof LocationSchema>;
export type ArrivalLocation = v.InferOutput<typeof ArrivalLocationSchema>;
export type AircraftType = v.InferOutput<typeof AircraftTypeSchema>;
export type Distance = v.InferOutput<typeof DistanceSchema>;
export type FlightDuration = v.InferOutput<typeof FlightDurationSchema>;
export type TransitTime = v.InferOutput<typeof TransitTimeSchema>;
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

export type ErrorSummary = {
	title: string;
	details: unknown[];
};

export type ErrorConstructor<T extends Error = Error> = new (
	...args: unknown[]
) => T;
export type ErrorFormatter<T extends Error = Error> = (
	error: T,
) => [string, ...unknown[]];
