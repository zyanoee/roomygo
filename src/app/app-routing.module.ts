import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterPageComponent } from './register-page/register-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { CreateRoomComponent } from './create-room/create-room.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RoomPageComponent } from './room-page/room-page2.component';
import { NotFoundPageComponent } from './errorpages/notfoundpage/notfoundpage.component';
import { CartPageComponent } from './cart-page/cart-page.component';
import { UserEditPageComponent } from './user-edit-page/user-edit-page.component';

const routes: Routes = [
  { path: 'room/:id', component: RoomPageComponent},
  { path: 'register', component: RegisterPageComponent },
  { path: 'notfound', component: NotFoundPageComponent },
  { path: '', component: MainPageComponent},
  { path: 'login', component: LoginPageComponent},
  { path: 'user', component: MainPageComponent},
  { path: 'user/:username', component: UserEditPageComponent},
  { path: 'user/:username/addRoom', component: CreateRoomComponent},
  { path: 'user/:username/cart', component: CartPageComponent},
  
 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }