import { User } from "../models/user";

export class FavouriteTherapistDto {
  constructor(
    public id: number = 0,
    public client: number = 0,
    public therapist: User = null
  ) {}
}
