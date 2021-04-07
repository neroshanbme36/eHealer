import { User } from "../models/user";

export class AppoitmentUserDto {
  constructor(
    public id: number = 0,
    public slotDate: Date = new Date('1900-01-01'),
    public slotStartTime: Date = new Date('1900-01-01'),
    public slotEndTime: Date = new Date('1900-01-01'),
    public slotDurationInMins: number = 0,
    public fee: number = 0,
    public clientNote: string = '',
    // 0 - waiting, 1 - Accepted, 32 - Cancelled By Therapist, 3 - Cancelled by Client
    public statusType: number = 0,
    public cancellationReason: string = '',
    public createdOn: Date = new Date('1900-01-01'),
    public updatedOn: Date = new Date('1900-01-01'),
    public client: User = new User(),
    public therapist: User = new User(),
  ) {}
}
