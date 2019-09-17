import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from 'model/Message';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  constructor() { }
  async initSocket(namespace){
    const user = await localStorage.getItem("username");
    this.socket = io('http://localhost:3000' + namespace, {query: "user=" + user});
    console.log(this.socket);
  }

  onMessageReceived(){
    return new Observable<Message>(observer => {
      this.socket.on('message', message => {
        observer.next(message);
      });
    });
  }

  onUserJoin(){
    return new Observable<string>(observer => {
      this.socket.on('user-joined', user => {
        observer.next(user);
      });
    });
  }

  sendMessage(message){
    this.socket.emit('message', message);
  }
}
