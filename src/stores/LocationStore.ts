import {makeAutoObservable, runInAction} from 'mobx';
import type {RootStore} from './RootStore';
import {
  getCurrentCoordinates,
  requestLocationPermission,
  type LocationPermissionStatus,
} from '../services/location';
import type {Coordinates} from '../types';

export class LocationStore {
  coordinates: Coordinates | null = null;
  permissionStatus: LocationPermissionStatus | 'unknown' = 'unknown';
  lastUpdatedAt: number | null = null;
  isRequesting = false;
  private pendingRequest: Promise<Coordinates> | null = null;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this);
  }

  async ensureCoordinates(): Promise<Coordinates> {
    if (this.coordinates) {
      return this.coordinates;
    }

    return this.refreshCoordinates();
  }

  async refreshCoordinates(): Promise<Coordinates> {
    if (this.pendingRequest) {
      return this.pendingRequest;
    }

    this.isRequesting = true;
    const request = (async () => {
      const permission = await requestLocationPermission();

      runInAction(() => {
        this.permissionStatus = permission;
      });

      if (permission !== 'granted') {
        throw new Error(
          'Для продолжения предоставьте доступ к геолокации в настройках устройства.',
        );
      }

      const coords = await getCurrentCoordinates();

      runInAction(() => {
        this.coordinates = coords;
        this.lastUpdatedAt = Date.now();
      });

      return coords;
    })()
      .finally(() => {
        runInAction(() => {
          this.isRequesting = false;
        });
        this.pendingRequest = null;
      });

    this.pendingRequest = request;

    return request;
  }

  setCoordinates(coords: Coordinates | null) {
    this.coordinates = coords;
    this.lastUpdatedAt = coords ? Date.now() : null;
  }
}
