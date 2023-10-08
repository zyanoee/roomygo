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

@Component({
    selector: 'app-user-page',
    templateUrl: './user-page.component.html',
    styleUrls: ['./user-page.component.css']
  })
  export class UserPageComponent implements OnInit{

    @Input() username!: string;
    userDescription: string = "";
    userRooms: Stanza[] = [];
    user!: Utente;
    userLinks: string[] = [];

  constructor(private roomService: RoomService, private userService: UserService) { }

    ngOnInit(): void {
          // Ottieni le stanze dell'utente dal servizio
          this.roomService.getUserRooms(this.username).subscribe(data => {
            this.userRooms = data;
          });
          this.userService.getUser(this.username).subscribe(data => {this.user = data;});
          this.userService.getUserLink(this.username).subscribe(data => {this.userLinks = data;});
        
    }

    viewReservations() {
        //TODO
    }



  }