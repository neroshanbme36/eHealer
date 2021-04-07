export class Session {
  constructor(
    public id: number = 0,
    public summary: string = '',
    public appointment: number = 0,
    public client: number = 0,
    public therapist: number = 0
  ) {}
}
