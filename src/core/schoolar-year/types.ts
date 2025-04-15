export interface ScholarCourt {
  startDate: string;
  endDate: string;
}

export interface Lapse {
  startDate: string;
  endDate: string;
  scholarCourts: ScholarCourt[];
}

export interface SchoolarYear {
  id: number;
  code: string,
  startDate: string,
  endDate: string,
  lapses: Lapse[],
}

export interface SchoolarYearPayload {
  schoolarYear: {
    code: string;
    startDate: string;
    endDate: string;
  };
  lapses: Lapse[];
}
