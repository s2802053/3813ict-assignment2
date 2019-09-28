import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../../model/Response';
import { Group } from '../../../model/Group';
import { Message } from '../../../model/Message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from '../add-user-modal/add-user-modal.component';
import { UserListModalComponent } from '../user-list-modal/user-list-modal.component';
import { AddGroupModalComponent} from '../add-group-modal/add-group-modal.component';
import { Router } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chat-client',
  templateUrl: './chat-client.component.html',
  styleUrls: ['./chat-client.component.css']
})
export class ChatClientComponent implements OnInit {
  private groups: Group[] = [];
  private activeGroup: number;
  private channels: {id: string, name: string}[] = [];
  private activeChannel: number;
  private user: string;
  public showGroups: boolean;
  private showHideAnimation: boolean;
  private role: string;
  private userId: string;
  private subscription: any;

  private messageInput: string = "";

  private history: Message[] = [];

  constructor(private http: HttpClient, public modal: NgbModal, public router: Router, public socketService: SocketService) {
    this.role = "";
    this.userId="";
    this.activeGroup = -1;
    this.activeChannel = -1;
    this.groups;
    this.showGroups = false;
    this.showHideAnimation = false;
  }

  async ngOnInit() {
    this.user = await localStorage.getItem("username");
    this.userId = await localStorage.getItem("user-id");
    this.role = await localStorage.getItem("user-role");

    await this.loadGroups((data) => {
      if (this.activeGroup >= 0){
        this.loadChannels(this.activeGroup, (data) => {
          if (this.activeChannel >= 0){
            this.getMessages(this.activeChannel);
          }
        });
      }
    });
  }

  loadGroups(onSuccess = data => { return }){
    this.http.get<Response>('/api/user/getGroups', {withCredentials: true})
      .subscribe(res => {
        if (!res.success){ return }
          this.groups = res.data;
          this.activeGroup = res.data.length > 0 ? 0 : -1;
          onSuccess(res.data);
      });
  }

  async loadChannels(index: number, onSuccess = data => { return }){
    // load the channels associated with the group
    // stored at the given index of groups.

    this.activeGroup = index;
    if (this.showGroups){
      this.toggleGroupList();
    }
    this.http.get<Response>(`/api/group/getChannels?groupId=${this.groups[this.activeGroup].id}`).subscribe(res => {
      if (!res.success){ return }
      this.channels = res.data;
      this.activeChannel = res.data.length > 0 ? 0 : -1;
      onSuccess(res.data);
    })
  }

  async getMessages(index: number){
    if (this.subscription){
      this.subscription.unsubscribe();
    }
    if (this.socketService.isConnected()){
      this.socketService.disconnect();
    }// set the selected channel as the active
    // channel and retrieve messages for it.
    // retrieve message history from api
    const groupId = this.groups[this.activeGroup].id;
    const channelId = this.channels[index].id;
    this.http.get<Response>(`/api/channel/getMessages?groupId=${groupId}&channelId=${channelId}`)
      .subscribe(async res => {
        if (res.success){
          this.activeChannel = index;
          this.history = res.data;
          // connect to socket
          await this.socketService.initSocket('/' + this.channels[this.activeChannel].id);
          // set callback when message is received
          this.subscription = this.socketService.onMessageReceived().subscribe(message => {
            this.history.push(message)
          });
          // set callback when user joins the channel
          this.socketService.onUserJoin().subscribe(user => {
            const d = new Date();
            this.history.push({
              username: null,
              timestamp: d.toLocaleString(),
              message: `${user} has joined the channel`
            });
          });
        } else {
          console.log(res.err);
        }
      })
  }

  addMessage(){
    // construct the message object
    const msg: Message = {
      username: this.user,
      timestamp: new Date().toLocaleString(),
      message: this.messageInput
    }
    const body = {
      groupId: this.groups[this.activeGroup].id,
      channelId: this.channels[this.activeChannel].id,
      message: msg
    }

    this.http.post<Response>("/api/channel/addMessage", body).subscribe(res => {
      if (res.success){
        console.log(res);
      } else if (res.err){
        console.log(res.err);
      }
    });
    this.socketService.sendMessage(msg);
  }

  createUser(){
    // display the add user modal
    this.modal.open(AddUserModalComponent);
  }

  listUsers(){
    // display the user list modal
    this.modal.open(UserListModalComponent);
  }

  async createGroup(){
    // Sends a http request to the server to create a group.
    // If the request is successful, the returned group data
    // is inserted into the groups array and set as the active
    // group, else an error is logged to the console.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Create group";
    modal.componentInstance.placeholder = "Enter group name";
    modal.result.then(async val=>{
      if (!val.closed){
        this.http.post<Response>("/api/group/create", {groupId: val.data}).subscribe(res => {
          console.log(res);
          if (res.success){
            const group: Group = {
              id: res.data._id,
              groupId: res.data.groupId,
              isAdmin: true,
              isAssistant: false
            }
            console.log(group);
            this.groups.push(group);
            this.loadChannels(this.groups.length - 1);
          } else {
            console.log(res.err);
          }
        });
      }
    });
  }

  async createChannel(){
    // Sends a http request to the server to create a channel.
    // If the request is successful, the returned channel data
    // is inserted into the channels array and set as the active
    // channel, else an error is logged to the console.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Create channel";
    modal.componentInstance.placeholder = "Enter channel name";
    modal.result.then(async val=> {
      if (!val.closed){
        let obj = {groupId: this.groups[this.activeGroup].id, channelId: val.data};
        this.http.post<Response>("/api/group/createChannel", obj).subscribe(res => {
          if (res.success){
            this.loadChannels(this.activeGroup);
          } else {
            console.log(res.err)
          }
        });
      }
    });
  }

  async delGroup(){
    // Sends a http request to the server to delete a group.
    // If the request is successful, the active group is 
    // updated and the list of groups is reloaded.

    let caller = await localStorage.getItem("username");
    let groupId = this.groups[this.activeGroup].id;
    this.http.post<Response>("/api/group/delete", { groupId: groupId }).subscribe(res => {
      if (res.success){
        this.activeGroup--;
        this.loadGroups();
      } else {
        console.log(res.err);
      }
    });
  }

  async delChannel(){
    // Sends a http request to the server to delete a channel.
    // If the request is successful, the active channel is 
    // updated and the list of channels is reloaded.

    let groupId = this.groups[this.activeGroup].id;
    let channelId = this.channels[this.activeChannel].id;
    this.http.post<Response>("/api/group/deleteChannel", {groupId: groupId, channelId: channelId}).subscribe(res => {
      if (res.success){
        this.activeChannel--;
        this.loadChannels(this.activeGroup);
      } else {
        console.log(res.err);
      }
    });
  }

  addUserToGroup(){
    // Sends a http request to the server to add a user
    // to a group.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Add user to group";
    modal.componentInstance.placeholder = "Enter username";
    modal.result.then(async val=> {
      if (val.closed) { return }
      let obj = {
        groupId: this.groups[this.activeGroup].id,
        username: val.data
      }
      this.http.post<Response>("/api/group/addUser", obj).subscribe(res => {
        if (!res.success){
          console.log(res.err);
        }
      });
    });
  }

  removeUserFromGroup(){
    // Sends a http request to the server to remove a user
    // from a group.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Remove user from group";
    modal.componentInstance.placeholder = "Enter user to remove";
    modal.result.then(async val=> {
      if (val.closed) { return }
      let obj = {
        groupId: this.groups[this.activeGroup].id,
        username: val.data
      }
      this.http.post<Response>("/api/group/removeUser", obj).subscribe(res => {
        if (!res.success){
          console.log(res.err);
        }
      });
    });
  }

  addUserToChannel(){
    // Sends a http request to the server to add a user
    // to a channel.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Add user to channel";
    modal.componentInstance.placeholder = "Enter user to add";
    modal.result.then(async val=> {
      if (val.closed) { return }
      let obj = {
        groupId: this.groups[this.activeGroup].id,
        channelId: this.channels[this.activeChannel].id,
        username: val.data
      }
      this.http.post<Response>("/api/channel/addUser", obj).subscribe(res => {
        if (!res.success){
          console.log(`Error: ${res.err}`);
        }
      });
    });
  }

  removeUserFromChannel(){
    // Sends a http request to the server to remove a user
    // from a channel.

    let modal = this.modal.open(AddGroupModalComponent);
    modal.componentInstance.title = "Remove user from channel";
    modal.componentInstance.placeholder = "Enter user to remove";
    modal.result.then(async val=> {
      if (val.closed) { return }
      let obj = {
        groupId: this.groups[this.activeGroup].id,
        channelId: this.channels[this.activeChannel].id,
        username: val.data
      }
      this.http.post<Response>("/api/channel/removeUser", obj).subscribe(res => {
        if (!res.success){
          console.log(`Error: ${res.err}`);
        }
      });
    });
  }

  logout(){
    // Logs out the logged in user and redirects
    // to the login page.
    localStorage.setItem("username", null);
    localStorage.setItem("user-role", null);
    this.http.post("/api/auth/logout", {}).subscribe(res => {
      console.log(res);
    });
    this.router.navigateByUrl("/login");
  }

  channelName(){
    // Returns the name of the active channel or 
    // an empty string if channels have not yet
    // been retrieved.
    if (!this.channels[this.activeChannel]){ return ""}
    return this.channels[this.activeChannel].name.charAt(0).toUpperCase() + this.channels[this.activeChannel].name.slice(1);
  }

  groupName(){
    // Returns the name of the active group or 
    // an empty string if groups have not yet
    // been retrieved.
    if(!this.groups[this.activeGroup]){ return ""}
    return this.groups[this.activeGroup].groupId.charAt(0).toUpperCase() + this.groups[this.activeGroup].groupId.slice(1);
  }

  showGroupControls(): boolean {
    if (!this.role){ return false }
    if (!this.groups[this.activeGroup]) { return false }
    return this.role === "0" || ( this.groups[this.activeGroup].isAdmin || this.groups[this.activeGroup].isAssistant );
  }

  toggleGroupList(){
    this.showHideAnimation = true;
    this.showGroups = !this.showGroups;
  }
}