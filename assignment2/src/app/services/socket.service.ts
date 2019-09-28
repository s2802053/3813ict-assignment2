import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from 'model/Message';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private connected: boolean;
  
  constructor() {
    this.connected = false;
   }

  async initSocket(namespace){
    const user = await localStorage.getItem("username");
    this.socket = io('http://localhost:3000' + namespace, {query: "user=" + user});
    this.connected = true;
  }

  isConnected(){
    return this.connected;
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

  disconnect(){
    this.socket.disconnect();
    this.connected = false;
  }
}
