import type { PnrApiResponse } from '../../src/types.js';

export const mockSuccessResponse: PnrApiResponse = {
  success: 'true',
  data: {
    flights: [
      {
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
          multi_terminal: 'TBIT',
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
        aircraftType: {
          name: 'Boeing 777-300ER',
          code: '77W',
        },
        distance: {
          miles: 5456,
          km: 8781,
        },
        flightDuration: {
          years: 0,
          months: 0,
          days: 0,
          hours: 10,
          minutes: 25,
        },
        status: {
          code: 'SS',
          name: 'Seat Sold',
        },
        operatedBy: {
          airlineName: null,
          iataCode: null,
          flightNo: null,
        },
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
      },
    ],
    passengers: [
      {
        name: 'SMITH/JOHNMR',
        type: 'ADT',
        dob: null,
        ticketNo: '1252345678901',
        seatNumbers: [
          {
            segment: 'LAXLHR',
            seat: '12A',
          },
        ],
      },
      {
        name: 'BROWN/ANNAMS',
        type: 'ADT',
        dob: null,
        ticketNo: '1252345678902',
        seatNumbers: [
          {
            segment: 'LAXLHR',
            seat: '12B',
          },
        ],
      },
    ],
  },
  remaining: 2498,
};

export const samplePnr = `RP/LON1A2345/LON1A2345            OM/SU  30MAR25/1430Z   9XZABC
  1.SMITH/JOHNMR   2.BROWN/ANNAMS
  3  BA 282 J 16SEP *LAXLHR SS1  340P 1005A 16SEP  E  BA/9XZABC`;
