export class StripeElementDto {
  constructor(
    public stripe: any = null,
    public nameOnCard: string = '',
    public cardNumber: any = null,
    public cardExpiry: any = null,
    public cardCvc: any = null,
    public isCardNumberValid: boolean = false,
    public isCardExpiryValid: boolean = false,
    public isCardCvcValid: boolean = false,
    public cardErrors: any = null // error message from stripe
  ) {}
}
