import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Response } from '../../../model/Response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  username: string;
  password: string;
  showError: boolean;
  constructor(private http: HttpClient, public router: Router) {
    this.showError = false;
  }

  ngOnInit() {
  }

  login(){
    // Sends http request to server to authenticate user, if
    // request is successful store the username in local storage
    // and navigate to the chat-client.
    this.http.post<Response>("/api/auth/login", {username: this.username, password: this.password})
      .subscribe(res => {
        if (res.success){
            let user = res.data;
            localStorage.setItem("username", user.username);
            localStorage.setItem("user-id", user.id);
            localStorage.setItem("user-role", user.role);
            this.router.navigateByUrl("chat-client");
        } else {
          this.showError = true;
        }
      })
  }

}
