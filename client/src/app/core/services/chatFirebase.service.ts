import { Injectable } from '@angular/core';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase from 'firebase/app'
import 'firebase/firestore'
import { UserFirebaseDto } from '../dtos/userFirebaseDto';
import { MessageFirebaseDto } from '../dtos/messageFirebaseDto';
import { ChatListDto } from '../dtos/chatListDto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatFirebaseService {
  currentUser?: UserFirebaseDto;
  users: UserFirebaseDto[];

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.users = [];
    this.currentUser = null;
    this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  }

  async signup(email: string, password: string): Promise<any> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user.uid;
    return this.afs.doc(`users/${uid}`).set({ uid, email: credential.user.email, });
  }

  signIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }

  addChatMessage(msg: string, recEmail: string) {
    if (this.users) {
      const fusr = this.getUserByEmail(recEmail);
      if (fusr) {
        return this.afs.collection('messages').add({
          msg: msg,
          from: this.currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          to: fusr.uid
        });
      }
    }
  }

  getChatListMessages(sysUsers: User[]) {
    return this.getUsers().pipe(
      switchMap(res => {
        this.users = res;
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<MessageFirebaseDto[]>;
      }),
      map(messages => {
        let clv: ChatListDto[] = [];
        for (let m of messages) {
          if (this.currentUser) {
            if (this.currentUser.uid === m.to || this.currentUser.uid === m.from) {
              m.fromName = 'Deleted';
              for (let usr of this.users) {
                if (usr.uid == m.from) {
                  m.fromName = usr.email;
                }
              }
              m.myMsg = this.currentUser.uid === m.from;
              let sysUser = null;
              if (this.currentUser.email.trim().toLowerCase() === m.fromName.trim().toLowerCase()) {
                const recUser = this.getUserByUid(m.to);
                if (recUser) {
                  sysUser = sysUsers.find(x => x.username.trim().toLowerCase() === recUser.email.trim().toLowerCase());
                }
              } else {
                sysUser = sysUsers.find(x => x.username.trim().toLowerCase() === m.fromName.trim().toLowerCase());
              }
              if (sysUser) {
                clv = clv.filter(x => x.senderEmail.trim().toLowerCase() !== sysUser.username.trim().toLowerCase());
                const chlm = new ChatListDto();
                chlm.firstname = sysUser.firstName;
                chlm.lastname = sysUser.lastName;
                chlm.lastMsg = m.msg;
                chlm.senderEmail = sysUser.username;
                clv.push(chlm);
              }
            }
          }
        }
        return clv;
      })
    )
  }

  getChatMessageBtwUsers(recEmail: string) {
    return this.getUsers().pipe(
      switchMap(res => {
        this.users = res;
        return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<MessageFirebaseDto[]>;
      }),
      map(messages => {
        const fMsg: MessageFirebaseDto[] = [];
        for (let m of messages) {
          const recFbDt = this.getUserByEmail(recEmail);
          if (recFbDt) {
            if (this.currentUser) {
              if ((this.currentUser.uid === m.from && recFbDt.uid === m.to) ||
                (this.currentUser.uid === m.to && recFbDt.uid === m.from)) {
                m.fromName = 'Deleted';
                for (let usr of this.users) {
                  if (usr.uid == m.from) {
                    m.fromName = usr.email;
                  }
                }
                m.myMsg = this.currentUser.uid === m.from;
                fMsg.push(m);
              }
            }
          }
        }
        return fMsg
      })
    )
  }

  private getUsers() {
    return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<UserFirebaseDto[]>;
  }

  private getUserByEmail(email: string): UserFirebaseDto {
    return this.users.find(x => x.email.trim().toLowerCase() === email.trim().toLowerCase());
  }

  private getUserByUid(uid: string): UserFirebaseDto {
    return this.users.find(x => x.uid === uid);
  }

  // getChatMessages() {
  //   return this.getUsers().pipe(
  //     switchMap(res => {
  //       this.users = res;
  //       return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<MessageFirebaseDto[]>;
  //     }),
  //     map(messages => {
  //       // Get the real name for each user
  //       for (let m of messages) {
  //         // m.fromName = this.getUserForMsg(m.from, this.users);
  //         m.fromName = 'Deleted';
  //         for (let usr of this.users) {
  //           if (usr.uid == m.from) {
  //             m.fromName = usr.email;
  //           }
  //         }
  //         m.myMsg = this.currentUser.uid === m.from;
  //       }
  //       return messages
  //     })
  //   )
  // }
}
