export class JwtTokenDto {
  constructor(
    public refresh: string = '',
    public access: string = ''
  ) {}
}
