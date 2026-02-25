# PNR Expert SDK

A TypeScript SDK for the [PNR Expert API](https://www.pnrexpert.com/guides/pnr/conversion-api-docs) - the most comprehensive PNR conversion API on the market. Transform raw PNRs from all major GDS (Amadeus, Sabre, Galileo, Travelport and more) into structured JSON.

## Features

- **Low dependencies** - Uses only native `fetch` and [valibot](https://valibot.dev) for validation
- **Fully typed** - Complete TypeScript support with inferred types
- **Runtime validation** - Request and response validation using valibot schemas
- **Type-safe errors** - Specific error classes for each API error type
- **Configurable timeout** - Built-in request timeout support
- **ESM ready** - Modern ES modules

## Installation

```bash
npm install pnr-expert-sdk
# or
yarn add pnr-expert-sdk
# or
pnpm add pnr-expert-sdk
```

## Quick Start

```typescript
import { PnrClient } from 'pnr-expert-sdk';

const client = new PnrClient({ token: 'your-api-token' });

const pnr = `RP/LON1A2345/LON1A2345            OM/SU  30MAR25/1430Z   9XZABC
  1.SMITH/JOHNMR   2.BROWN/ANNAMS
  3  BA 282 J 16SEP *LAXLHR SS1  340P 1005A 16SEP  E  BA/9XZABC`;

const result = await client.fetchPnr(pnr);

console.log(result.data.flights); // Flight details
console.log(result.data.passengers); // Passenger information
console.log(result.remaining); // Remaining API quota
```

## Configuration

```typescript
import { PnrClient } from 'pnr-expert-sdk';

const client = new PnrClient({
  // Required: Your API token
  token: 'your-api-token',

  // Optional: Custom base URL (defaults to https://www.pnrexpert.com)
  baseUrl: 'https://www.pnrexpert.com',

  // Optional: Request timeout in ms (defaults to 30000)
  timeout: 30000,
});
```

## Response Structure

The `fetchPnr` method returns a `PnrResponse` object with the following structure:

```typescript
interface PnrResponse {
  success: string; // 'Authorized' or similar
  data: {
    flights: Flight[];
    passengers: Passenger[];
  };
  remaining: number; // Remaining API quota
}
```

### Flight Object

Each flight contains comprehensive information:

```typescript
interface Flight {
  departingFrom: Location; // Departure airport details
  arrivingAt: ArrivalLocation; // Arrival airport details
  aircraftType: AircraftType; // Aircraft model and code
  distance: Distance; // Distance in miles and km
  flightDuration: FlightDuration;
  status: Status; // Booking status (e.g., SS = Seat Sold)
  operatedBy: OperatedBy; // Codeshare information
  techStop: string | null;
  airlineLocator: string; // Airline booking reference
  carbonEmissions: number; // CO₂ emissions in metric tons
  paxNo: number; // Number of passengers
  bookingClass: string; // Booking class code (Y, J, F, etc.)
  flightNumber: string;
  airlineLogo: string; // URL to airline logo
  iataCode: string;
  airlineName: string;
  q: string; // Booking class descriptor
  cabin: string; // Economy, Business, First
  transitTime: string | null; // Time between connecting flights
}
```

### Location Object

```typescript
interface Location {
  id: number;
  airportName: string;
  cityName: string;
  countryName: string;
  airportCode: string; // IATA code
  latitude: string;
  longitude: string;
  timezone: string; // IANA timezone (e.g., "America/Los_Angeles")
  type: string;
  multi_terminal: string | null;
  time: string; // ISO 8601 datetime
  terminal: string | null; // Terminal information
}
```

### Passenger Object

```typescript
interface Passenger {
  name: string; // Format: LASTNAME/FIRSTNAMEMR
  type: string; // ADT (Adult), CHD (Child), INF (Infant)
  dob: string | null;
  ticketNo: string;
  seatNumbers: Seat[];
}

interface Seat {
  segment: string; // e.g., "LAXLHR"
  seat: string; // e.g., "12A"
}
```

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test tests/client.test.ts
```

### Integration Tests

Integration tests require a valid API key. Create a `.env` file in the project root:

```bash
cp .env.example .env
# Edit .env and add your API_KEY
API_KEY=your-api-key-here
```

Then run the integration tests:

```bash
yarn test tests/integration.test.ts
```

### Test Files

- `tests/client.test.ts` - Client functionality and error handling
- `tests/schemas.test.ts` - Schema validation tests
- `tests/errors.test.ts` - Error class tests
- `tests/integration.test.ts` - Real API integration tests

## Error Handling

The SDK provides specific error classes for different API errors:

```typescript
import {
  PnrClient,
  UnauthorizedError,
  RequestLimitError,
  InvalidJsonError,
  NoPnrProvidedError,
  UnprocessableEntryError,
  ValidationError,
  TimeoutError,
  NetworkError,
  PnrError,
} from 'pnr-expert-sdk';

const client = new PnrClient({ token: 'your-token' });

const logError = (label: string, message: string, extra?: unknown) => {
  console.error(`${label}: ${message}`);
  if (extra !== undefined) {
    console.error('Details:', extra);
  }
};

try {
  const result = await client.fetchPnr(pnr);
  console.log('PNR parsed successfully:', result.data);
} catch (error) {
  if (error instanceof ValidationError) {
    logError('Validation error', error.message, error.issues);
  } else if (error instanceof UnauthorizedError) {
    logError('Authentication failed', error.message);
  } else if (error instanceof RequestLimitError) {
    logError('Rate limit reached', error.message);
  } else if (error instanceof InvalidJsonError) {
    logError('Invalid JSON', error.message);
  } else if (error instanceof NoPnrProvidedError) {
    logError('No PNR provided', error.message);
  } else if (error instanceof UnprocessableEntryError) {
    logError('Cannot process PNR', error.message);
  } else if (error instanceof TimeoutError) {
    logError('Request timed out', error.message);
  } else if (error instanceof NetworkError) {
    logError('Network error', error.message);
  } else if (error instanceof PnrError) {
    logError('API error', error.message, { status: error.statusCode });
  } else {
    const message = error instanceof Error ? error.message : String(error);
    logError('Unexpected error', message);
  }
}
```

### Error Classes

| Error Class               | HTTP Status | Description                        |
| ------------------------- | ----------- | ---------------------------------- |
| `UnauthorizedError`       | 401         | Invalid or missing Bearer token    |
| `RequestLimitError`       | 401         | Monthly API quota exceeded         |
| `InvalidJsonError`        | 400         | Request body is not valid JSON     |
| `NoPnrProvidedError`      | 422         | PNR field is missing or empty      |
| `UnprocessableEntryError` | 422         | PNR cannot be parsed               |
| `ValidationError`         | -           | Request/response validation failed |
| `TimeoutError`            | -           | Request exceeded timeout           |
| `NetworkError`            | -           | Network connectivity issue         |
| `PnrError`                | any         | Base class for all SDK errors      |

## Advanced Usage

### Using Valibot Schemas

For advanced use cases, you can import the valibot schemas directly:

```typescript
import * as v from 'valibot';
import { PnrResponseSchema, FlightSchema } from 'pnr-expert-sdk';

// Custom validation
const customFlightSchema = v.object({
  ...FlightSchema.entries,
  // Add custom fields
});

// Manual parsing
const result = v.safeParse(PnrResponseSchema, apiResponse);
if (result.success) {
  console.log(result.output);
}
```

### Available Schemas

- `PnrRequestSchema` - Request body validation
- `PnrResponseSchema` - Success response validation
- `PnrErrorResponseSchema` - Error response validation
- `FlightSchema` - Flight object validation
- `PassengerSchema` - Passenger object validation
- `LocationSchema` - Airport/location validation
- `ArrivalLocationSchema` - Arrival location with day offset
- `AircraftTypeSchema` - Aircraft type validation
- `DistanceSchema` - Distance (miles/km) validation
- `FlightDurationSchema` - Duration validation
- `StatusSchema` - Booking status validation
- `OperatedBySchema` - Codeshare validation
- `SeatSchema` - Seat assignment validation
- `AirportSchema` - Airport details validation

## API Reference

### `PnrClient`

#### Constructor

```typescript
new PnrClient(options: PnrClientOptions)
```

| Option    | Type     | Required | Default                     | Description                         |
| --------- | -------- | -------- | --------------------------- | ----------------------------------- |
| `token`   | `string` | Yes      | -                           | Bearer token for API authentication |
| `baseUrl` | `string` | No       | `https://www.pnrexpert.com` | API base URL                        |
| `timeout` | `number` | No       | `30000`                     | Request timeout in milliseconds     |

#### Methods

##### `fetchPnr(pnr: string): Promise<PnrResponse>`

Fetches and parses a PNR string.

**Parameters:**

- `pnr` - The raw PNR string to parse

**Returns:** `Promise<PnrResponse>` - Parsed PNR data with flights and passengers

**Throws:**

- `ValidationError` - If the PNR string is invalid
- `UnauthorizedError` - If the token is invalid or missing
- `RequestLimitError` - If the API quota has been exceeded
- `InvalidJsonError` - If the request body is malformed
- `NoPnrProvidedError` - If no PNR is provided
- `UnprocessableEntryError` - If the PNR cannot be processed
- `TimeoutError` - If the request times out
- `NetworkError` - If a network error occurs

## Requirements

- Node.js >= 18 (for native `fetch` support)
- TypeScript >= 5.0 (recommended)

## License

MIT

## Links

- [PNR Expert API Documentation](https://www.pnrexpert.com/guides/pnr/conversion-api-docs)
- [Get an API Key](https://www.pnrexpert.com/dashboard/api-signup)
