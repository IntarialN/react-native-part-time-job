import type {Coordinates, Shift, ShiftListResponse} from '../types';

const API_BASE_URL = 'https://mobile.handswork.pro/api';
const SHIFTS_ENDPOINT = `${API_BASE_URL}/shifts/map-list-unauthorized`;

type FetchShiftsParams = Coordinates & {
  signal?: AbortSignal;
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
}: FetchShiftsParams): Promise<Shift[]> => {
  const url = new URL(SHIFTS_ENDPOINT);
  url.searchParams.set('latitude', String(latitude));
  url.searchParams.set('longitude', String(longitude));

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => null);
    throw new Error(
      `Не удалось получить список смен (status ${response.status})${
        errorBody ? `: ${errorBody}` : ''
      }`,
    );
  }

  const payload = (await response.json()) as ShiftListResponse;
  return parseShiftResponse(payload);
};
