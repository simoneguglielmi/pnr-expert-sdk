import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import {
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
} from '../src/schemas.js';

describe('Schemas', () => {
  describe('PnrRequestSchema', () => {
    it('should validate valid PNR request', () => {
      const result = v.safeParse(PnrRequestSchema, { pnr: 'RP/LON1A2345...' });
      expect(result.success).toBe(true);
    });

    it('should reject empty PNR', () => {
      const result = v.safeParse(PnrRequestSchema, { pnr: '' });
      expect(result.success).toBe(false);
    });

    it('should reject missing PNR field', () => {
      const result = v.safeParse(PnrRequestSchema, {});
      expect(result.success).toBe(false);
    });
  });

  describe('AirportSchema', () => {
    const validAirport = {
      id: 1,
      airportName: 'Los Angeles International Airport',
      cityName: 'Los Angeles',
      countryName: 'United States',
      airportCode: 'LAX',
      latitude: '33.9425',
      longitude: '-118.4081',
      timezone: 'America/Los_Angeles',
      type: 'airport',
      multi_terminal: 'TBIT',
    };

    it('should validate valid airport', () => {
      const result = v.safeParse(AirportSchema, validAirport);
      expect(result.success).toBe(true);
    });

    it('should accept null multi_terminal', () => {
      const result = v.safeParse(AirportSchema, {
        ...validAirport,
        multi_terminal: null,
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing required fields', () => {
      const result = v.safeParse(AirportSchema, { id: 1 });
      expect(result.success).toBe(false);
    });

    it('should reject airport code with invalid length', () => {
      const result = v.safeParse(AirportSchema, {
        ...validAirport,
        airportCode: 'LA',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('LocationSchema', () => {
    const validLocation = {
      id: 1,
      airportName: 'Los Angeles International Airport',
      cityName: 'Los Angeles',
      countryName: 'United States',
      airportCode: 'LAX',
      latitude: '33.9425',
      longitude: '-118.4081',
      timezone: 'America/Los_Angeles',
      type: 'airport',
      multi_terminal: null,
      time: '2025-09-16T15:40:00-07:00',
      terminal: 'B',
    };

    it('should validate valid location', () => {
      const result = v.safeParse(LocationSchema, validLocation);
      expect(result.success).toBe(true);
    });

    it('should reject missing time', () => {
      const { time, ...withoutTime } = validLocation;
      const result = v.safeParse(LocationSchema, withoutTime);
      expect(result.success).toBe(false);
    });
  });

  describe('ArrivalLocationSchema', () => {
    const validArrivalLocation = {
      id: 2,
      airportName: 'London Heathrow Airport',
      cityName: 'London',
      countryName: 'United Kingdom',
      airportCode: 'LHR',
      latitude: '51.4700',
      longitude: '-0.4543',
      timezone: 'Europe/London',
      type: 'airport',
      multi_terminal: '5',
      time: '2025-09-17T10:05:00+01:00',
      terminal: '5',
      dayOffset: 1,
    };

    it('should validate valid arrival location', () => {
      const result = v.safeParse(ArrivalLocationSchema, validArrivalLocation);
      expect(result.success).toBe(true);
    });

    it('should reject missing dayOffset', () => {
      const { dayOffset, ...withoutDayOffset } = validArrivalLocation;
      const result = v.safeParse(ArrivalLocationSchema, withoutDayOffset);
      expect(result.success).toBe(false);
    });
  });

  describe('AircraftTypeSchema', () => {
    it('should validate with code', () => {
      const result = v.safeParse(AircraftTypeSchema, {
        name: 'Boeing 777-300ER',
        code: '77W',
      });
      expect(result.success).toBe(true);
    });

    it('should accept null code', () => {
      const result = v.safeParse(AircraftTypeSchema, {
        name: 'Unknown Aircraft',
        code: null,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('DistanceSchema', () => {
    it('should validate valid distance', () => {
      const result = v.safeParse(DistanceSchema, {
        miles: 5456,
        km: 8781,
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-numeric values', () => {
      const result = v.safeParse(DistanceSchema, {
        miles: '5456',
        km: '8781',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('FlightDurationSchema', () => {
    it('should validate valid duration', () => {
      const result = v.safeParse(FlightDurationSchema, {
        years: 0,
        months: 0,
        days: 0,
        hours: 10,
        minutes: 25,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('TransitTimeSchema', () => {
    it('should validate valid transit time', () => {
      const result = v.safeParse(TransitTimeSchema, {
        hours: 3,
        minutes: 10,
      });
      expect(result.success).toBe(true);
    });

    it('should reject non-numeric values', () => {
      const result = v.safeParse(TransitTimeSchema, {
        hours: '3',
        minutes: 10,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('StatusSchema', () => {
    it('should validate valid status', () => {
      const result = v.safeParse(StatusSchema, {
        code: 'SS',
        name: 'Seat Sold',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('OperatedBySchema', () => {
    it('should validate with all null values', () => {
      const result = v.safeParse(OperatedBySchema, {
        airlineName: null,
        iataCode: null,
        flightNo: null,
      });
      expect(result.success).toBe(true);
    });

    it('should validate with actual values', () => {
      const result = v.safeParse(OperatedBySchema, {
        airlineName: 'American Airlines',
        iataCode: 'AA',
        flightNo: 'AA1234',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid IATA code length', () => {
      const result = v.safeParse(OperatedBySchema, {
        airlineName: 'American Airlines',
        iataCode: 'A',
        flightNo: 'AA1234',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('SeatSchema', () => {
    it('should validate valid seat', () => {
      const result = v.safeParse(SeatSchema, {
        segment: 'LAXLHR',
        seat: '12A',
      });
      expect(result.success).toBe(true);
    });
  });

  describe('PassengerSchema', () => {
    it('should validate valid passenger', () => {
      const result = v.safeParse(PassengerSchema, {
        name: 'SMITH/JOHNMR',
        type: 'ADT',
        dob: null,
        ticketNo: '1252345678901',
        seatNumbers: [{ segment: 'LAXLHR', seat: '12A' }],
      });
      expect(result.success).toBe(true);
    });

    it('should validate passenger with empty seats', () => {
      const result = v.safeParse(PassengerSchema, {
        name: 'SMITH/JOHNMR',
        type: 'ADT',
        dob: '1990-01-15',
        ticketNo: '1252345678901',
        seatNumbers: [],
      });
      expect(result.success).toBe(true);
    });
  });

  describe('FlightSchema', () => {
    const validFlight = {
      departingFrom: {
        id: 1,
        airportName: 'Los Angeles International Airport',
        cityName: 'Los Angeles',
        countryName: 'United States',
        airportCode: 'LAX',
        latitude: '33.9425',
        longitude: '-118.4081',
        timezone: 'America/Los_Angeles',
        type: 'airport',
        multi_terminal: null,
        time: '2025-09-16T15:40:00-07:00',
        terminal: 'B',
      },
      arrivingAt: {
        id: 2,
        airportName: 'London Heathrow Airport',
        cityName: 'London',
        countryName: 'United Kingdom',
        airportCode: 'LHR',
        latitude: '51.4700',
        longitude: '-0.4543',
        timezone: 'Europe/London',
        type: 'airport',
        multi_terminal: '5',
        time: '2025-09-17T10:05:00+01:00',
        terminal: '5',
        dayOffset: 1,
      },
      aircraftType: { name: 'Boeing 777-300ER', code: '77W' },
      distance: { miles: 5456, km: 8781 },
      flightDuration: {
        years: 0,
        months: 0,
        days: 0,
        hours: 10,
        minutes: 25,
      },
      status: { code: 'SS', name: 'Seat Sold' },
      operatedBy: { airlineName: null, iataCode: null, flightNo: null },
      techStop: null,
      airlineLocator: '9XZABC',
      carbonEmissions: 0.85,
      paxNo: 2,
      bookingClass: 'J',
      flightNumber: 'BA282',
      airlineLogo: '/images/airlines/ba.png',
      iataCode: 'BA',
      airlineName: 'British Airways',
      q: 'Business',
      cabin: 'Business',
      transitTime: null,
    };

    it('should validate valid flight', () => {
      const result = v.safeParse(FlightSchema, validFlight);
      expect(result.success).toBe(true);
    });

    it('should validate flight with transitTime', () => {
      const result = v.safeParse(FlightSchema, {
        ...validFlight,
        transitTime: { hours: 2, minutes: 30 },
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid flight IATA code length', () => {
      const result = v.safeParse(FlightSchema, {
        ...validFlight,
        iataCode: 'B',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PnrResponseSchema', () => {
    const validResponse = {
      success: 'true',
      data: {
        flights: [],
        passengers: [],
      },
      remaining: 2500,
    };

    it('should validate valid response', () => {
      const result = v.safeParse(PnrResponseSchema, validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject missing fields', () => {
      const result = v.safeParse(PnrResponseSchema, {
        success: 'true',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PnrErrorResponseSchema', () => {
    it('should validate error response', () => {
      const result = v.safeParse(PnrErrorResponseSchema, {
        error: 'Unauthorized PE433',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing error field', () => {
      const result = v.safeParse(PnrErrorResponseSchema, {});
      expect(result.success).toBe(false);
    });
  });
});
