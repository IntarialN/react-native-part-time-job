import {FilterStore} from './FilterStore';
import {LocationStore} from './LocationStore';
import {ShiftStore} from './ShiftStore';

export class RootStore {
  readonly filterStore: FilterStore;
  readonly locationStore: LocationStore;
  readonly shiftStore: ShiftStore;

  constructor() {
    this.filterStore = new FilterStore(this);
    this.locationStore = new LocationStore(this);
    this.shiftStore = new ShiftStore(this);
  }
}
