export class ListExams {
    startDate?: StartDateExamsFilter = StartDateExamsFilter.All;
    page: number = 1;
    patientId: number;
    doctorId: number;
  }
  
  export enum StartDateExamsFilter {
    All = 1,
    Today,
    Tommorow,
    ThisWeek,
    NextWeek
  }