import type { ErrorSummary } from "./types.js";

/**
 * Base error class for PNR Expert SDK errors
 */
export class PnrError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number,
	) {
		super(message);
		this.name = "PnrError";
	}
}

/**
 * Error thrown when the API returns an unauthorized response (401)
 */
export class UnauthorizedError extends PnrError {
	constructor(message = "Unauthorized PE433") {
		super(message, 401);
		this.name = "UnauthorizedError";
	}
}

/**
 * Error thrown when the request limit has been reached (401)
 */
export class RequestLimitError extends PnrError {
	constructor(message = "Request Limit Reached") {
		super(message, 401);
		this.name = "RequestLimitError";
	}
}

/**
 * Error thrown when the request body contains invalid JSON (400)
 */
export class InvalidJsonError extends PnrError {
	constructor(
		message = "Invalid JSON in request body. Make sure your PNR is inside quotes and uses \\n for newlines.",
	) {
		super(message, 400);
		this.name = "InvalidJsonError";
	}
}

/**
 * Error thrown when no PNR is provided in the request (422)
 */
export class NoPnrProvidedError extends PnrError {
	constructor(message = "No PNR Provided") {
		super(message, 422);
		this.name = "NoPnrProvidedError";
	}
}

/**
 * Error thrown when the entry is unprocessable (422)
 */
export class UnprocessableEntryError extends PnrError {
	constructor(message = "Unprocessable Entry PE398") {
		super(message, 422);
		this.name = "UnprocessableEntryError";
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
		this.name = "ValidationError";
	}
}

/**
 * Error thrown when the request times out
 */
export class TimeoutError extends PnrError {
	constructor(message = "Request timed out") {
		super(message);
		this.name = "TimeoutError";
	}
}

/**
 * Error thrown for network-related issues
 */
export class NetworkError extends PnrError {
	constructor(message: string) {
		super(message);
		this.name = "NetworkError";
	}
}

const formatWithStatus = (
	title: string,
	message: string,
	statusCode?: number,
	extraDetails: unknown[] = [],
): [string, ...unknown[]] => [
	title,
	message,
	...extraDetails,
	{ status: statusCode },
];

export function getError(error: unknown): ErrorSummary {
	if (error instanceof ValidationError) {
		const [title, ...details] = formatWithStatus(
			"Validation error",
			error.message,
			error.statusCode,
			[error.issues],
		);
		return { title, details };
	}

	if (error instanceof UnauthorizedError) {
		const [title, ...details] = formatWithStatus(
			"Authentication failed",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof RequestLimitError) {
		const [title, ...details] = formatWithStatus(
			"Rate limit reached",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof InvalidJsonError) {
		const [title, ...details] = formatWithStatus(
			"Invalid JSON",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof NoPnrProvidedError) {
		const [title, ...details] = formatWithStatus(
			"No PNR provided",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof UnprocessableEntryError) {
		const [title, ...details] = formatWithStatus(
			"Cannot process PNR",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof TimeoutError) {
		const [title, ...details] = formatWithStatus(
			"Request timed out",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof NetworkError) {
		const [title, ...details] = formatWithStatus(
			"Network error",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof PnrError) {
		const [title, ...details] = formatWithStatus(
			"API error",
			error.message,
			error.statusCode,
		);
		return { title, details };
	}

	if (error instanceof Error) {
		if (error.name === "AbortError") {
			const [title, ...details] = formatWithStatus(
				"Request timed out",
				error.message,
			);
			return { title, details };
		}
		return {
			title: "Unexpected error",
			details: [error.message, { status: undefined }],
		};
	}

	return {
		title: "Unknown error",
		details: [String(error), { status: undefined }],
	};
}
