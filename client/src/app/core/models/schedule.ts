export class Schedule {
  constructor(
    public id: number = 0,
    public dayOfWeek: number = 0,
    public day: string = '',
    public openingTime: string = '',
    public closingTime: string = '',
    public user: number = 0
  ) {}
}
