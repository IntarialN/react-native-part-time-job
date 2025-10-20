import {makeAutoObservable} from 'mobx';
import type {RootStore} from './RootStore';

export class FilterStore {
  includeFilled = true;

  constructor(private readonly root: RootStore) {
    makeAutoObservable(this);
  }

  setIncludeFilled(include: boolean) {
    if (this.includeFilled === include) {
      return;
    }

    this.includeFilled = include;
    this.root.shiftStore.loadShifts();
  }

  hydrateIncludeFilled(include: boolean) {
    this.includeFilled = include;
  }
}
