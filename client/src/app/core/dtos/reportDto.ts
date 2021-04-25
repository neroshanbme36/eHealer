import { Appointment } from '../models/appointment';
import { User } from '../models/user';

export class ReportDto {
    constructor(
        public index: number = 0,
        public id: number = 0,
        public appointment: Appointment = null,
        public therapist: User = null,
        public client: User = null,
        public chartLabels: string[] = [],
        public datas: number[] = [],
        public levels: number[] = []
    ) {}
  }
