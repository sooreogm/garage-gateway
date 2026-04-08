import { GARAGE_ENDPOINTS, type EndpointName } from "./endpoints";
import { GarageApiError, GarageConnectionError } from "./errors";

function getConfig() {
  const url = process.env.GARAGE_ADMIN_API_URL;
  const token = process.env.GARAGE_ADMIN_TOKEN;
  if (!url || !token) {
    throw new Error(
      "Missing GARAGE_ADMIN_API_URL or GARAGE_ADMIN_TOKEN environment variables.",
    );
  }
  return { url: url.replace(/\/+$/, ""), token };
}

interface RequestOptions {
  params?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}

export async function garageRequest<T = unknown>(
  endpoint: EndpointName,
  options: RequestOptions = {},
): Promise<T> {
  const { url: baseUrl, token } = getConfig();
  const def = GARAGE_ENDPOINTS[endpoint];

  const urlObj = new URL(def.path, baseUrl);
  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      urlObj.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout ?? 10_000,
  );

  try {
    const fetchOptions: RequestInit = {
      method: def.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    };

    if (def.method === "POST") {
      fetchOptions.body = JSON.stringify(options.body ?? {});
    }

    const response = await fetch(urlObj.toString(), fetchOptions);

    if (!response.ok) {
      let garageMessage: string | undefined;
      try {
        const errBody = await response.json();
        garageMessage = errBody?.message ?? errBody?.error ?? undefined;
      } catch {
        // Response body is not JSON
      }
      throw new GarageApiError(
        `Garage API ${endpoint} returned ${response.status}`,
        response.status,
        garageMessage,
      );
    }

    const contentType = response.headers.get("content-type");
    if (
      response.status === 204 ||
      !contentType?.includes("application/json")
    ) {
      const text = await response.text();
      return text as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof GarageApiError) throw error;
    throw new GarageConnectionError(error);
  } finally {
    clearTimeout(timeoutId);
  }
}
