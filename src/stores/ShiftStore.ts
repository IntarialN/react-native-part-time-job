import {makeAutoObservable, runInAction} from 'mobx';
import {fetchShifts} from '../services/shiftsApi';
import {
  getCurrentCoordinates,
  requestLocationPermission,
  type LocationPermissionStatus,
} from '../services/location';
import type {AsyncState, Coordinates, Shift} from '../types';

export class ShiftStore {
  shifts: Shift[] = [];
  status: AsyncState = 'idle';
  error: string | null = null;
  permissionStatus: LocationPermissionStatus | 'unknown' = 'unknown';
  location: Coordinates | null = null;
  selectedShiftId: string | null = null;
  lastUpdatedAt: number | null = null;

  private abortController: AbortController | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get hasShifts(): boolean {
    return this.shifts.length > 0;
  }

  get selectedShift(): Shift | undefined {
    if (!this.selectedShiftId) {
      return undefined;
    }

    return this.shifts.find(shift => shift.id === this.selectedShiftId);
  }

  selectShift(shiftId: string | null) {
    this.selectedShiftId = shiftId;
  }

  cancelOngoingRequest() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  async loadShifts() {
    this.cancelOngoingRequest();
    this.status = 'loading';
    this.error = null;

    try {
      const permission = await requestLocationPermission();

      runInAction(() => {
        this.permissionStatus = permission;
      });

      if (permission !== 'granted') {
        throw new Error(
          'Для продолжения предоставьте доступ к геолокации в настройках устройства.',
        );
      }

      const coordinates = await getCurrentCoordinates();

      runInAction(() => {
        this.location = coordinates;
      });

      this.abortController = new AbortController();
      const shifts = await fetchShifts({
        ...coordinates,
        signal: this.abortController.signal,
      });

      runInAction(() => {
        this.shifts = shifts;
        this.status = 'success';
        this.error = null;
        this.lastUpdatedAt = Date.now();
      });
    } catch (unknownError) {
      const normalizedError =
        unknownError instanceof Error
          ? unknownError
          : new Error('Произошла неизвестная ошибка при загрузке смен.');

      if (normalizedError.name === 'AbortError') {
        return;
      }

      console.warn('Failed to load shifts', normalizedError);

      runInAction(() => {
        this.status = 'error';
        this.error = normalizedError.message;
      });
    } finally {
      this.abortController = null;
    }
  }
}

export const shiftStore = new ShiftStore();
