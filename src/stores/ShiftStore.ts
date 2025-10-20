import {makeAutoObservable, runInAction} from 'mobx';
import {fetchShifts} from '../services/shiftsApi';
import {
  readShiftsCache,
  saveShiftsCache,
  clearShiftsCache,
} from '../services/storage';
import type {AsyncState, Shift} from '../types';
import type {RootStore} from './RootStore';

export class ShiftStore {
  shifts: Shift[] = [];
  status: AsyncState = 'idle';
  error: string | null = null;
  selectedShiftId: string | null = null;
  lastUpdatedAt: number | null = null;
  isOffline = false;
  pageSize = 20;
  currentPage = 1;
  hasMore = true;
  isLoadingMore = false;

  private abortController: AbortController | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this, {root: false}, {autoBind: true});
    this.hydrateFromCache();
  }

  get hasShifts(): boolean {
    return this.shifts.length > 0;
  }

  get includeFilled(): boolean {
    return this.root.filterStore.includeFilled;
  }

  get visibleShifts(): Shift[] {
    if (this.includeFilled) {
      return this.shifts.slice();
    }

    return this.shifts.filter(shift => shift.currentWorkers < shift.planWorkers);
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
    this.isOffline = false;
    this.currentPage = 1;
    this.hasMore = true;
    this.isLoadingMore = false;

    try {
      const coords = await this.root.locationStore.refreshCoordinates();

      this.abortController = new AbortController();
      const shifts = await fetchShifts({
        ...coords,
        signal: this.abortController.signal,
        includeFilled: this.includeFilled,
        page: 1,
        pageSize: this.pageSize,
      });

      runInAction(() => {
        this.shifts = shifts;
        this.status = 'success';
        this.error = null;
        this.lastUpdatedAt = Date.now();
        this.isOffline = false;
        this.currentPage = 1;
        this.hasMore = shifts.length >= this.pageSize;
      });

      await saveShiftsCache({
        shifts,
        location: coords,
        includeFilled: this.includeFilled,
        timestamp: Date.now(),
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

      const cached = await readShiftsCache();

      if (cached) {
        runInAction(() => {
          this.shifts = cached.shifts;
          this.status = 'success';
          this.error = normalizedError.message;
          this.lastUpdatedAt = cached.timestamp;
          this.isOffline = true;
          this.root.locationStore.setCoordinates(cached.location);
          this.root.filterStore.hydrateIncludeFilled(cached.includeFilled);
          this.hasMore = false;
        });
      } else {
        runInAction(() => {
          this.status = 'error';
          this.error = normalizedError.message;
          this.isOffline = false;
        });
      }
    } finally {
      this.abortController = null;
    }
  }

  async loadMoreShifts() {
    if (
      this.isLoadingMore ||
      this.status === 'loading' ||
      !this.hasMore ||
      this.isOffline
    ) {
      return;
    }

    const coords = this.root.locationStore.coordinates;
    if (!coords) {
      await this.loadShifts();
      return;
    }

    this.isLoadingMore = true;

    try {
      const nextPage = this.currentPage + 1;
      const shifts = await fetchShifts({
        ...coords,
        includeFilled: this.includeFilled,
        page: nextPage,
        pageSize: this.pageSize,
      });

      runInAction(() => {
        if (shifts.length === 0) {
          this.hasMore = false;
          this.isLoadingMore = false;
          return;
        }

        const existing = new Set(this.shifts.map(shift => shift.id));
        const deduped = shifts.filter(shift => !existing.has(shift.id));

        this.shifts = [...this.shifts, ...deduped];
        this.currentPage = nextPage;
        this.hasMore = shifts.length >= this.pageSize;
        this.isLoadingMore = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoadingMore = false;
        this.hasMore = false;
        this.error =
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить дополнительные смены.';
      });
    }
  }

  async hydrateFromCache() {
    const cached = await readShiftsCache();
    if (!cached) {
      return;
    }

    runInAction(() => {
      this.shifts = cached.shifts;
      this.lastUpdatedAt = cached.timestamp;
      this.status = cached.shifts.length > 0 ? 'success' : 'idle';
      this.root.locationStore.setCoordinates(cached.location);
      this.root.filterStore.hydrateIncludeFilled(cached.includeFilled);
      this.currentPage = 1;
      this.hasMore = false;
    });
  }

  async clearCache() {
    await clearShiftsCache();
  }
}
