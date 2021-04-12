import firebase from 'firebase/app'
import 'firebase/firestore'

export class MessageFirebaseDto {
  constructor(
    public id: string = '',
    public from: string = '',
    public msg: string = '',
    public fromName: string = '',
    public myMsg: boolean = false,
    public createdAt: any = firebase.firestore.FieldValue.serverTimestamp()
  ) {}
}
