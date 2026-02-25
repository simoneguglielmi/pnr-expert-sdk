import * as v from 'valibot';

// Request Schema
export const PnrRequestSchema = v.object({
  pnr: v.pipe(v.string(), v.minLength(1, 'PNR cannot be empty')),
});

// Airport Schema
export const AirportSchema = v.object({
  id: v.number(),
  airportName: v.string(),
  cityName: v.string(),
  countryName: v.string(),
  airportCode: v.string(),
  latitude: v.string(),
  longitude: v.string(),
  timezone: v.string(),
  type: v.string(),
  multi_terminal: v.nullable(v.string()),
});

// Departure/Arrival Location Schema
export const LocationSchema = v.object({
  ...AirportSchema.entries,
  time: v.string(),
  terminal: v.string(),
});

export const ArrivalLocationSchema = v.object({
  ...LocationSchema.entries,
  dayOffset: v.number(),
});

// Aircraft Type Schema
export const AircraftTypeSchema = v.object({
  name: v.string(),
  code: v.nullable(v.string()),
});

// Distance Schema
export const DistanceSchema = v.object({
  miles: v.number(),
  km: v.number(),
});

// Flight Duration Schema
export const FlightDurationSchema = v.object({
  years: v.number(),
  months: v.number(),
  days: v.number(),
  hours: v.number(),
  minutes: v.number(),
  seconds: v.number(),
});

// Booking Status Schema
export const StatusSchema = v.object({
  code: v.string(),
  name: v.string(),
});

// Operated By Schema
export const OperatedBySchema = v.object({
  airlineName: v.nullable(v.string()),
  iataCode: v.nullable(v.string()),
  flightNo: v.nullable(v.string()),
});

// Flight Schema
export const FlightSchema = v.object({
  departingFrom: LocationSchema,
  arrivingAt: ArrivalLocationSchema,
  aircraftType: AircraftTypeSchema,
  distance: DistanceSchema,
  flightDuration: FlightDurationSchema,
  status: StatusSchema,
  operatedBy: OperatedBySchema,
  techStop: v.nullable(v.string()),
  airlineLocator: v.string(),
  carbonEmissions: v.number(),
  paxNo: v.number(),
  bookingClass: v.string(),
  flightNumber: v.string(),
  airlineLogo: v.string(),
  iataCode: v.string(),
  airlineName: v.string(),
  j: v.string(),
  cabin: v.string(),
  transitTime: v.nullable(v.string()),
});

// Seat Assignment Schema
export const SeatSchema = v.object({
  segment: v.string(),
  seat: v.string(),
});

// Passenger Schema
export const PassengerSchema = v.object({
  name: v.string(),
  type: v.string(),
  dob: v.nullable(v.string()),
  ticketNo: v.string(),
  seatNumbers: v.array(SeatSchema),
});

// Success Response Schema
export const PnrResponseSchema = v.object({
  success: v.string(),
  flights: v.array(FlightSchema),
  passengers: v.array(PassengerSchema),
  status: v.number(),
  error: v.boolean(),
  remaining: v.number(),
});

// Error Response Schema
export const PnrErrorResponseSchema = v.object({
  error: v.string(),
});
