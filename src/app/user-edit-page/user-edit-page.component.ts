import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';

import { ValidationService } from '../services/ValidationService';
import { PhotoService } from '../services/PhotoService';
import { Observable, distinctUntilChanged, map, of } from 'rxjs';
import { RoomService } from '../services/RoomService';
import { UserService } from '../services/UserService';
import { Utente } from '../entity/Utente';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';
import { UserEditStanzeComponent } from '../user-edit-stanze/user-edit-stanze.component';
import { UserEditPrenotazioniComponent } from '../user-edit-prenotazioni/user-edit-prenotazioni.component';

@Component({
    selector: 'app-user-edit-page',
    templateUrl: './user-edit-page.component.html',
    styleUrls: ['./user-edit-page.component.scss']
  })
  export class UserEditPageComponent implements OnInit{

    username!: string;
    userDescription: string = "";
    userRooms: Stanza[] = [];
    user!: Utente;
    userNome!:string;
    userTelefono!:string;
    userLinks: string[] = [];
    userPhotoUrl: string = "";

  constructor(private dialog: MatDialog, private roomService: RoomService,private photoService: PhotoService, private validationService: ValidationService, private router: Router, private cookieService: CookieService, private userService: UserService) {
    
   }

    async ngOnInit(): Promise<void> {
      try{
        await this.validationService.refresh();
      }catch (error) {
        this.router.navigate(['/login'])
      }
      this.username = this.cookieService.get("username");
      this.userService.getUser(this.username).subscribe(
        (user: Utente) => {
          this.user = user;
          this.userDescription = user.descrizione? user.descrizione : " ";
          this.photoService.showImagePropic(this.username).subscribe((data: string)=>this.userPhotoUrl=data);
          this.userNome = user.nome;
          this.userTelefono = user.telefono.toString();
        }
      );
    }
    
    edita() {
      var _popup=this.dialog.open(UserEditDialogComponent, {
        width:"60%",
        height:"80%"
      })
      _popup.afterClosed().subscribe(()=>{
        location.reload();
      })
    }

    stanze() {
      var _popup=this.dialog.open(UserEditStanzeComponent, {
        width:"60%",
        height:"80%"
      })
    }

    prenotazioni() {
      var _popup=this.dialog.open(UserEditPrenotazioniComponent, {
        width:"60%",
        height:"80%"
      })
    }



  }