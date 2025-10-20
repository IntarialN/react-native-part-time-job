import type {Coordinates, Shift, ShiftListResponse} from '../types';
import {HttpClient} from './httpClient';

const API_BASE_URL = 'https://mobile.handswork.pro/api';
const SHIFTS_ENDPOINT = '/shifts/map-list-unauthorized';

const apiClient = new HttpClient({
  baseUrl: API_BASE_URL,
});

type FetchShiftsParams = Coordinates & {
  signal?: AbortSignal;
  page?: number;
  pageSize?: number;
  includeFilled?: boolean;
};

const parseShiftResponse = (payload: ShiftListResponse): Shift[] => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload?.data && Array.isArray(payload.data)) {
    return payload.data;
  }

  if ((payload as {shifts?: Shift[]})?.shifts) {
    const maybeShifts = (payload as {shifts?: Shift[]}).shifts;
    if (Array.isArray(maybeShifts)) {
      return maybeShifts;
    }
  }

  return [];
};

export const fetchShifts = async ({
  latitude,
  longitude,
  signal,
  page,
  pageSize,
  includeFilled,
}: FetchShiftsParams): Promise<Shift[]> => {
  const payload = await apiClient.request<ShiftListResponse>(SHIFTS_ENDPOINT, {
    signal,
    query: {
      latitude,
      longitude,
      page,
      perPage: pageSize,
      includeFilled,
    },
  });

  return parseShiftResponse(payload);
};
