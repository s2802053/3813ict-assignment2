import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Response } from 'model/Response';
import { User } from 'model/User';

@Component({
  selector: 'app-user-list-modal',
  templateUrl: './user-list-modal.component.html',
  styleUrls: ['./user-list-modal.component.css']
})

export class UserListModalComponent implements OnInit {
  private users: [User];
  constructor(public activeModal:NgbActiveModal, public http: HttpClient) { }

  async ngOnInit() {
    this.http.get<Response>('/api/user/list').subscribe(res => {
      if (res.success){
        this.users = res.data;
      }
    });
  }

  async deleteUser(i){
    // Called when the delete button is pressed
    // on a user. Sends a http request to the 
    // server to delete the indicated user. If
    // the request is successful the list of users
    // is updated to reflect the changes.


    let username = this.users[i].username;
    this.http.post<Response>("/api/user/delete", {username: username}).subscribe(res => {
      if (res.success){
        this.users.splice(i, 1);
      }
    });
  }
}


