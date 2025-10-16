import {makeAutoObservable} from 'mobx';

export class ShiftStore {
  shifts: unknown[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setShifts(shifts: unknown[]) {
    this.shifts = shifts;
  }
}

export const shiftStore = new ShiftStore();
