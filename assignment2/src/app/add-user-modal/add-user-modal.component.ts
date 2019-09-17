import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../../model/Response';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css']
})
export class AddUserModalComponent implements OnInit {
  radio: any;
  username: string;
  email: string;
  password: string;
  role: string;
  errorMessage: string;
  showError: boolean;

  constructor(public activeModal: NgbActiveModal, public http: HttpClient) {
    this.errorMessage = "";
    this.showError = false;
   }

  async ngOnInit() {
    this.role = localStorage.getItem("user-role");
  }

  async onSubmit(){
    // Called when the add user form is submitted
    // sends a http request to the server to create
    // a new user and close the modal of it responds
    // with a success code.
    console.log(this.radio);

    if (!this.username){
      // show enter username error
      this.displayError("Error: no username entered");
    } else if (!this.email){
      // show enter email error
      this.displayError("Error: no email entered");
    } else if (!this.password){
      this.displayError("Error: no password entered");
    } else if (this.radio == undefined){
      this.displayError("Error: no role selected");
    } else {
      // send request to server
      let obj = {
        username: this.username.toLowerCase(),
        password: this.password.toLowerCase(),
        email: this.email.toLowerCase(),
        role: this.radio
      };
      this.http.post<Response>("/api/user/create", obj).subscribe(res => {
          if (res.success){
            this.activeModal.close('Close click');
          } else {
            this.displayError(res.err);
          }
      });
    }
  }
  displayError(errorMessage){
    this.showError = true;
    this.errorMessage = errorMessage;
  }
}
