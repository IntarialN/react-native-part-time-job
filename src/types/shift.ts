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
  workTypes: string[] | string;
  priceWorker: number;
  customerFeedbacksCount: number;
  customerRating: number;
  [key: string]: unknown;
};

export type ShiftListResponse =
  | Shift[]
  | {
      data?: Shift[];
      [key: string]: unknown;
    };
