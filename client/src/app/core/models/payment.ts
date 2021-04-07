export class Payment {
  constructor(
    public id: number = 0,
    public transType: number = 0,
    public cardName: string = '',
    public cardNumber: string = '',
    public cardExpDate: Date = new Date('1900-01-01'),
    public createdOn: Date = new Date('1900-01-01'),
    public updatedOn: Date = new Date('1900-01-01'),
    public appointment: number = 0,
    public client: number = 0,
    public therapist: number = 0
  ) {}
}
