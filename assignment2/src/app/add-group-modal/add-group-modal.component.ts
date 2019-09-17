import { Component, OnInit, Input } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { Response } from 'model/Response';

@Component({
  selector: 'app-add-group-modal',
  templateUrl: './add-group-modal.component.html',
  styleUrls: ['./add-group-modal.component.css']
})

export class AddGroupModalComponent implements OnInit {
  private inputField: string;
  @Input() public title;
  @Input() public placeholder;

  constructor(public activeModal: NgbActiveModal, public http: HttpClient ) { }

  ngOnInit() {}

  onSubmit(){
    // called when the modal form is submitted
    // closes the modal and returns form data

    if (this.inputField.length > 0){
      this.activeModal.close({closed: false, data: this.inputField});
    } else {
      console.log("Error: input most not be empty");
    }
  }
}
