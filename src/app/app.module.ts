import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginPageComponent } from './login-page/login-page.component';
import { ValidationService } from './services/ValidationService';
import { CreateRoomComponent } from './create-room/create-room.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RoomPageComponent } from './room-page/room-page2.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { CarouselModule } from '@coreui/angular';
import { NotFoundPageComponent } from './errorpages/notfoundpage/notfoundpage.component';
import { differenceInDays } from 'date-fns';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { CartPageComponent } from './cart-page/cart-page.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UserEditPageComponent } from './user-edit-page/user-edit-page.component';
import { UserEditDialogComponent } from './user-edit-dialog/user-edit-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { UserEditPrenotazioniComponent } from './user-edit-prenotazioni/user-edit-prenotazioni.component';
import { UserEditStanzeComponent } from './user-edit-stanze/user-edit-stanze.component';
import { RoomEditPrenotazioniComponent } from './room-edit-prenotazioni/room-edit-prenotazioni.component';
import { RoomEditDialogComponent } from './room-edit-dialog/room-edit-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RegisterPageComponent,
    LoginPageComponent,
    CreateRoomComponent,
    UserPageComponent,
    NavbarComponent,
    RoomPageComponent,
    NotFoundPageComponent,
    CartPageComponent,
    SearchBarComponent,
    UserEditPageComponent,
    UserEditDialogComponent,
    UserEditPrenotazioniComponent,
    UserEditStanzeComponent,
    RoomEditPrenotazioniComponent,
    RoomEditDialogComponent,
    
    
  ],

  imports: [

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule, 
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatSlideToggleModule,
    MatDialogModule,
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule,
  ],
  
  providers: [CookieService, ValidationService, MatDatepicker],
  bootstrap: [AppComponent]
})
export class AppModule { }
