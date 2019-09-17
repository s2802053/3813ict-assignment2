import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ChatClientComponent } from './chat-client/chat-client.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'chat-client', component: ChatClientComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
