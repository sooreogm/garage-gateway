export class GarageApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly garageMessage?: string,
  ) {
    super(message);
    this.name = "GarageApiError";
  }

  get userMessage(): string {
    switch (this.statusCode) {
      case 401:
        return "Authentication failed. Check your admin token configuration.";
      case 403:
        return "Access denied. Your admin token may lack the required scope.";
      case 404:
        return this.garageMessage ?? "The requested resource was not found.";
      case 409:
        return this.garageMessage ?? "Conflict: the resource already exists or is in use.";
      default:
        if (this.statusCode >= 500) {
          return "Garage server error. Please check the cluster status.";
        }
        return this.garageMessage ?? "An unexpected error occurred.";
    }
  }
}

export class GarageConnectionError extends Error {
  constructor(cause?: unknown) {
    super("Unable to connect to Garage admin API.");
    this.name = "GarageConnectionError";
    this.cause = cause;
  }

  get userMessage(): string {
    return "Cannot reach the Garage cluster. Verify GARAGE_ADMIN_API_URL is correct and the cluster is running.";
  }
}

export class GarageS3Error extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly garageMessage?: string,
  ) {
    super(message);
    this.name = "GarageS3Error";
  }

  get userMessage(): string {
    switch (this.statusCode) {
      case 401:
        return "Authentication failed. Check the configured Garage S3 credentials.";
      case 403:
        return "Access denied. The configured Garage S3 key does not have permission to access this file.";
      case 404:
        return "The requested file was not found.";
      default:
        if (this.statusCode >= 500) {
          return "Garage file service error. Please check the S3 endpoint and bucket permissions.";
        }
        return this.garageMessage ?? "An unexpected file access error occurred.";
    }
  }
}

export class GarageS3ConnectionError extends Error {
  constructor(cause?: unknown) {
    super("Unable to connect to Garage S3 API.");
    this.name = "GarageS3ConnectionError";
    this.cause = cause;
  }

  get userMessage(): string {
    return "Cannot reach the Garage S3 API. Verify GARAGE_S3_API_URL and the configured S3 credentials.";
  }
}

export function toErrorResponse(error: unknown): {
  status: number;
  body: { error: string; code: string };
} {
  if (error instanceof GarageApiError) {
    return {
      status: error.statusCode,
      body: { error: error.userMessage, code: "GARAGE_API_ERROR" },
    };
  }
  if (error instanceof GarageConnectionError) {
    return {
      status: 502,
      body: { error: error.userMessage, code: "GARAGE_CONNECTION_ERROR" },
    };
  }
  if (error instanceof GarageS3Error) {
    return {
      status: error.statusCode,
      body: { error: error.userMessage, code: "GARAGE_S3_ERROR" },
    };
  }
  if (error instanceof GarageS3ConnectionError) {
    return {
      status: 502,
      body: { error: error.userMessage, code: "GARAGE_S3_CONNECTION_ERROR" },
    };
  }
  console.error("[garage-gateway] Unexpected error:", error);
  return {
    status: 500,
    body: { error: "Internal server error.", code: "INTERNAL_ERROR" },
  };
}
