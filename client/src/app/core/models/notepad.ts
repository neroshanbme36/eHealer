export class Notepad {
  constructor(
    public id: number = 0,
    public note: string = '',
    public createdOn: Date = new Date('1900-01-01'),
    public updatedOn: Date = new Date('1900-01-01'),
    public user: number = 0
  ) {}
}
