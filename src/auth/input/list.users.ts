export class ListUsers {
  birthdate?: BirthdateUsersFilter = BirthdateUsersFilter.All;
  page: number = 1;
  id: number;
}

export enum BirthdateUsersFilter {
  All = 1,
  Today,
  Tommorow,
  ThisWeek,
  NextWeek
}