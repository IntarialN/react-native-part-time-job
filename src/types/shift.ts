export type Shift = {
  id: string;
  logo: string | null;
  address: string;
  companyName: string;
  dateStartByCity: string;
  timeStartByCity: string;
  timeEndByCity: string;
  currentWorkers: number;
  planWorkers: number;
  workTypes:
    | string
    | Array<
        | string
        | {
            id: number | string;
            name: string;
            nameGt5?: string;
            nameLt5?: string;
            nameOne?: string;
            [key: string]: unknown;
          }
      >;
  priceWorker: number;
  bonusPriceWorker?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  customerFeedbacksCount: number | string;
  customerRating: number;
  [key: string]: unknown;
};

export type ShiftListResponse =
  | Shift[]
  | {
      data?: Shift[];
      [key: string]: unknown;
    };
