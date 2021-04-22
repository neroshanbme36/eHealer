import { Appointment } from "../models/appointment";
import { User } from "../models/user";

export class SessionReportDto {
  constructor(
    public id: number = 0,
    public summary: string = '',
    public file: File = null,
    public isStart: boolean = false,
    public isEnd: boolean = false,
    public angry: number = 0,
    public disgust: number = 0,
    public fear: number = 0,
    public happy: number = 0,
    public neutral: number = 0,
    public sad: number = 0,
    public surprise: number = 0,
    public depressionLevel: number = 0,
    public improvementLevel: number = 0,
    public appointment: Appointment = null,
    public therapist: User = null,
    public client: User = null
  ) {}
}
