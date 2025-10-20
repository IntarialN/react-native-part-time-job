import {Platform} from 'react-native';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
};

type HttpClientConfig = {
  baseUrl: string;
  defaultHeaders?: Record<string, string>;
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const buildQueryString = (params: Record<string, unknown> | undefined) => {
  if (!params) {
    return '';
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export class HttpClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;

  constructor({baseUrl, defaultHeaders = {}}: HttpClientConfig) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.defaultHeaders = defaultHeaders;
  }

  async request<TResponse>(
    path: string,
    {method = 'GET', signal, headers, query, body}: RequestOptions = {},
  ): Promise<TResponse> {
    const url =
      path.startsWith('http') || path.startsWith('https')
        ? path
        : `${this.baseUrl}/${path.replace(/^\//, '')}`;

    const queryString = buildQueryString(query);
    const requestUrl = `${url}${queryString}`;

    const requestInit: RequestInit = {
      method,
      headers: {
        Accept: 'application/json',
        ...this.defaultHeaders,
        ...headers,
      },
      signal,
    };

    if (body !== undefined && body !== null) {
      requestInit.body = isObject(body) ? JSON.stringify(body) : String(body);
      requestInit.headers = {
        'Content-Type': 'application/json',
        ...requestInit.headers,
      };
    }

    const response = await fetch(requestUrl, requestInit);

    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.debug(
        '[HTTP]',
        method,
        requestUrl,
        response.status,
        Platform.OS,
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => null);
      const error = new Error(
        errorText
          ? `HTTP ${response.status}: ${errorText}`
          : `HTTP ${response.status}`,
      );
      throw error;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as TResponse;
    }

    // @ts-expect-error allow returning string/empty for non-json responses
    return response.text();
  }
}
