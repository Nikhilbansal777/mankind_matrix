/**
 * Custom error classes for the application
 */

/**
 * APIError - Custom error class for handling API-related errors
 * @extends Error
 */
export class APIError extends Error {
  constructor(status, message, endpoint, details = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.endpoint = endpoint;
    this.details = details;
  }

  /**
   * Creates an APIError from an axios error
   * @param {Error} error - The axios error object
   * @param {string} endpoint - The API endpoint that failed
   * @returns {APIError} A new APIError instance
   */
  static fromAxiosError(error, endpoint) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return new APIError(
        error.response.status,
        `Request failed: ${error.response.statusText}`,
        endpoint,
        error.response.data
      );
    } else if (error.request) {
      // The request was made but no response was received
      return new APIError(
        503,
        'Service unavailable - No response from server',
        endpoint,
        error.request
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return new APIError(
        500,
        'Internal error while making request',
        endpoint,
        error.message
      );
    }
  }
}

/**
 * ValidationError - Custom error class for handling validation errors
 * @extends Error
 */
export class ValidationError extends Error {
  constructor(message, field, details = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.details = details;
  }
}

/**
 * AuthenticationError - Custom error class for handling authentication errors
 * @extends Error
 */
export class AuthenticationError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = 'AuthenticationError';
    this.details = details;
  }
} 