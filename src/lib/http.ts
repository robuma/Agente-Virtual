export class ExternalApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ExternalApiError";
  }
}

export async function parseJsonResponse<T>(response: Response, serviceName: string): Promise<T> {
  const text = await response.text();
  const payload = text ? safeJson(text) : undefined;

  if (!response.ok) {
    throw new ExternalApiError(
      `${serviceName} responded with status ${response.status}`,
      response.status,
      payload
    );
  }

  return payload as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
