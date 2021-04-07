export class User {
  constructor(
    public id: number = 0,
    public username: string = '',
    public password: string = '',
    public lastLogin: Date = new Date('1900-01-01'),
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public isActive: boolean = false,
    public dateJoined: Date = new Date('1900-01-01'),
    public birthDate: string = '1900-01-01',
    public gender: string = '',
    public martialStatus: string = '',
    public contactNo: string = '',
    public qualification: string = '',
    public roleType: string = '',
    public addressLine1: string = '',
    public addressLine2: string = '',
    public city: string = '',
    public postcode: string = '',
    public state: string = '',
    public country: string = '',
    public updatedOn: string = ''
  ) {}
}
