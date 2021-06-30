export class ListConsultations {
  startAt?: StartAtConsultationsFilter = StartAtConsultationsFilter.All;
  page: number = 1;
}

export enum StartAtConsultationsFilter {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek
}