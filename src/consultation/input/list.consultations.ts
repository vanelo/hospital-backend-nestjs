export class ListConsultations {
  startDate?: StartDateConsultationsFilter = StartDateConsultationsFilter.All;
  page: number = 1;
}

export enum StartDateConsultationsFilter {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek
}