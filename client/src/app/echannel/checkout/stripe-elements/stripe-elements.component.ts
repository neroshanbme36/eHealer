import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { StripeElementDto } from 'src/app/core/dtos/stripeElementDto';
declare var Stripe: any;

@Component({
  selector: 'app-stripe-elements',
  templateUrl: './stripe-elements.component.html',
  styleUrls: ['./stripe-elements.component.scss']
})

export class StripeElementsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() stripeElementToParent: EventEmitter<StripeElementDto> = new EventEmitter();
  stripeElementDto: StripeElementDto;

  publishableKey: string; // key will be given on stripe website
  // publishableKey = 'pk_test_LebSBrHBCgzx07CVmMvDV2BZ00LHXMWHQ7';
  cardHandler = this.onChange.bind(this); // change detection in the elements

  @ViewChild('cardNumberCtrl', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiryCtrl', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvcCtrl', { static: true }) cardCvcElement: ElementRef;

  constructor() {}

  ngOnInit() {
    this.publishableKey = '';
    this.stripeElementDto = new StripeElementDto();
  }

  ngAfterViewInit(): void {
    this.publishableKey = 'pk_test_LebSBrHBCgzx07CVmMvDV2BZ00LHXMWHQ7';
    this.stripeElementDto.stripe = Stripe(this.publishableKey);

    // elements are the interface framework of the stripe
    // which have numerous advantages to validate data on client side without writing the extra codes
    const elements = this.stripeElementDto.stripe.elements();

    this.stripeElementDto.cardNumber = elements.create('cardNumber');
    this.stripeElementDto.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.stripeElementDto.cardNumber.addEventListener('change', this.cardHandler);

    this.stripeElementDto.cardExpiry = elements.create('cardExpiry');
    this.stripeElementDto.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.stripeElementDto.cardExpiry.addEventListener('change', this.cardHandler);

    this.stripeElementDto.cardCvc = elements.create('cardCvc', {placeholder: '123'});
    this.stripeElementDto.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.stripeElementDto.cardCvc.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy(): void {
    this.stripeElementDto.cardNumber.destroy();
    this.stripeElementDto.cardExpiry.destroy();
    this.stripeElementDto.cardCvc.destroy();
  }

  onChange(event: any) {
    if (event.error) {
      this.stripeElementDto.cardErrors = event.error.message; // error message from stripe
    } else {
      this.stripeElementDto.cardErrors = null;
    }

    switch (event.elementType) {
      case 'cardNumber':
        this.stripeElementDto.isCardNumberValid = event.complete;
        break;
      case 'cardExpiry':
        this.stripeElementDto.isCardExpiryValid = event.complete;
        break;
      case 'cardCvc':
        this.stripeElementDto.isCardCvcValid = event.complete;
    }

    this.stripeElementToParent.emit(this.stripeElementDto);
  }
}
