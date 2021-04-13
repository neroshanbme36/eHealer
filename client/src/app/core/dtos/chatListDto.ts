export class ChatListDto {
  constructor(
    public firstname: string = '',
    public lastname: string = '',
    public lastMsg: string = '',
    public senderEmail: string = ''
  ) {}
}
