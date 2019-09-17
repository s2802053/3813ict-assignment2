import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ChatClientComponent } from './chat-client/chat-client.component';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserModalComponent } from './add-user-modal/add-user-modal.component';
import { UserListModalComponent } from './user-list-modal/user-list-modal.component';
import { AddGroupModalComponent } from './add-group-modal/add-group-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatClientComponent,
    AddUserModalComponent,
    UserListModalComponent,
    AddGroupModalComponent
  ],
  entryComponents: [AddUserModalComponent, UserListModalComponent, AddGroupModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
