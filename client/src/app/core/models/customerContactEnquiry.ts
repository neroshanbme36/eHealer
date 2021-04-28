export class CustomerContactEnquiry {
  constructor(
    public id: number = 0,
    public name: string = '',
    public contactNo: string = '',
    public emailAddress: string = '',
    public message: string = '',
    public adminReplyMessage: string = '',
    public isAdminReplied: boolean = false,
    public createdOn: Date = new Date('1900-01-01'),
    public updatedOn: Date = new Date('1900-01-01')
  ){}
}
