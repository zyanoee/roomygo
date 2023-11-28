import {Component, Inject} from '@angular/core';
import {NgFor} from '@angular/common';
import {NgIf, JsonPipe} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry, MatIconModule} from '@angular/material/icon';
import { FormControl, FormGroup } from '@angular/forms';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Stanza } from '../entity/Stanza';
import { RoomService } from '../services/RoomService';
import { Utente } from '../entity/Utente';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map } from 'rxjs';
import { differenceInDays } from 'date-fns';
import { PhotoService } from '../services/PhotoService';
import { CarrelloService } from '../services/CarrelloService';

const WIFI_RED = `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.12 -5.12 522.24 522.24" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="8.192"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#ff0000;} </style> <g> <path class="st0" d="M0,180.942l52.247,52.248c112.324-112.334,295.181-112.334,407.505,0L512,180.942 C370.839,39.763,141.16,39.763,0,180.942z"></path> <path class="st0" d="M67.904,248.857l52.248,52.247c74.926-74.926,196.768-74.926,271.695,0l52.247-52.247 C340.388,145.16,171.612,145.16,67.904,248.857z"></path> <path class="st0" d="M135.828,316.781l52.248,52.238c37.454-37.454,98.393-37.454,135.848,0l52.247-52.238 C309.919,250.538,202.081,250.538,135.828,316.781z"></path> <path class="st0" d="M203.752,384.695L256,436.942l52.247-52.247C279.41,355.858,232.589,355.858,203.752,384.695z"></path> </g> </g></svg>`;
const WIFI_GREEN = `<svg height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.12 -5.12 522.24 522.24" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="8.192"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#4bcd42;} </style> <g> <path class="st0" d="M0,180.942l52.247,52.248c112.324-112.334,295.181-112.334,407.505,0L512,180.942 C370.839,39.763,141.16,39.763,0,180.942z"></path> <path class="st0" d="M67.904,248.857l52.248,52.247c74.926-74.926,196.768-74.926,271.695,0l52.247-52.247 C340.388,145.16,171.612,145.16,67.904,248.857z"></path> <path class="st0" d="M135.828,316.781l52.248,52.238c37.454-37.454,98.393-37.454,135.848,0l52.247-52.238 C309.919,250.538,202.081,250.538,135.828,316.781z"></path> <path class="st0" d="M203.752,384.695L256,436.942l52.247-52.247C279.41,355.858,232.589,355.858,203.752,384.695z"></path> </g> </g></svg>`;

const CAR_RED = `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.12 -5.12 74.24 74.24" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="2.2399999999999998"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#ff0000" d="M60,28c0-8.301-5.016-24-24-24h-8C9.016,4,4,19.699,4,28c-2.211,0-4,1.789-4,4v16c0,2.211,1.789,4,4,4h4v4 c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h24v4c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h4c2.211,0,4-1.789,4-4V32 C64,29.789,62.211,28,60,28z M16,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S18.211,44,16,44z M12,28c0-0.652,0.184-16,16-16 h8c15.41,0,15.984,14.379,16,16H12z M48,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S50.211,44,48,44z"></path> </g></svg>`

const CAR_GREEN = `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-5.12 -5.12 74.24 74.24" enable-background="new 0 0 64 64" xml:space="preserve" fill="#000000" stroke="#000000" stroke-width="2.2399999999999998"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill="#4bcd42" d="M60,28c0-8.301-5.016-24-24-24h-8C9.016,4,4,19.699,4,28c-2.211,0-4,1.789-4,4v16c0,2.211,1.789,4,4,4h4v4 c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h24v4c0,2.211,1.789,4,4,4h4c2.211,0,4-1.789,4-4v-4h4c2.211,0,4-1.789,4-4V32 C64,29.789,62.211,28,60,28z M16,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S18.211,44,16,44z M12,28c0-0.652,0.184-16,16-16 h8c15.41,0,15.984,14.379,16,16H12z M48,44c-2.211,0-4-1.789-4-4s1.789-4,4-4s4,1.789,4,4S50.211,44,48,44z"></path> </g></svg>`

const AC_RED = `<svg fill="#ff0000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#2e2e2e"><g id="SVGRepo_bgCarrier" stroke-width="0">
</g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21,2.5H3a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1v-8A1,1,0,0,0,21,2.5Zm-3,8H6a1,1,0,0,1,0-2H18a1,1,0,0,1,0,2Zm0-4H17a1,1,0,0,1,0-2h1a1,1,0,0,1,0,2Z"></path><path d="M12.793,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293L9.793,19.793a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414l-.293-.293,1.293-1.293a1,1,0,0,0-1.414-1.414Z"></path><path d="M18.293,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293-1.293,1.293a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414l-.293-.293,1.293-1.293a1,1,0,0,0-1.414-1.414Z">
</path><path d="M7.293,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293L4.293,19.793a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414L7.414,17.5l1.293-1.293a1,1,0,0,0-1.414-1.414Z">
</path></g></svg>`

const AC_GREEN = `<svg fill="#4bcd42" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="#2e2e2e"><g id="SVGRepo_bgCarrier" stroke-width="0">
</g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M21,2.5H3a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1v-8A1,1,0,0,0,21,2.5Zm-3,8H6a1,1,0,0,1,0-2H18a1,1,0,0,1,0,2Zm0-4H17a1,1,0,0,1,0-2h1a1,1,0,0,1,0,2Z"></path><path d="M12.793,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293L9.793,19.793a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414l-.293-.293,1.293-1.293a1,1,0,0,0-1.414-1.414Z"></path><path d="M18.293,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293-1.293,1.293a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414l-.293-.293,1.293-1.293a1,1,0,0,0-1.414-1.414Z">
</path><path d="M7.293,14.793l-2,2a1,1,0,0,0,0,1.414l.293.293L4.293,19.793a1,1,0,1,0,1.414,1.414l2-2a1,1,0,0,0,0-1.414L7.414,17.5l1.293-1.293a1,1,0,0,0-1.414-1.414Z">
</path></g></svg>`


export interface GridItem {
    component?: string;
    cols: number;
    rows: number;
    color: string;
    carousel?: boolean;
    information?: boolean;
    title?: string;
    
    imgUrl?: string;
  }

  export interface IconItem {
    component?: string;
    cols: number;
    rows: number;
    color: string;
    icon: string;
  }




@Component({
    selector: 'app-roompage',
    templateUrl: './room-page2.component.html',
    styleUrls: [
      './room-page.component.css',
      '../../assets/bs5/bootstrap/css/bootstrap.min.css',
    ],
  })

  export class RoomPageComponent {

    descrizione: string = "Il tuo testo qui";
    range = new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      });


    
    room!: Stanza;
    id!: string;
    roomName!: string;
    gestore!: Utente;
    numeroGiorni!: number;

    //Alert
    showAlert = false;
    successAlert = false;
    warningAlert = false;
    alertMessage = '';

    iconsRed: string[]=[
      'wifi-red',
      'car-red',
      'ac-red'
    ]

    iconsGreen: string[]=[
      'wifi-green',
      'car-green',
      'ac-green'
    ]


    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private roomService: RoomService, private photoService: PhotoService, private carrelloService: CarrelloService, private route: ActivatedRoute, private router: Router) {
        iconRegistry.addSvgIconLiteral('car-red', sanitizer.bypassSecurityTrustHtml(CAR_RED));
        iconRegistry.addSvgIconLiteral('car-green', sanitizer.bypassSecurityTrustHtml(CAR_GREEN));
        iconRegistry.addSvgIconLiteral('wifi-red', sanitizer.bypassSecurityTrustHtml(WIFI_RED));
        iconRegistry.addSvgIconLiteral('wifi-green', sanitizer.bypassSecurityTrustHtml(WIFI_GREEN));
        iconRegistry.addSvgIconLiteral('ac-red', sanitizer.bypassSecurityTrustHtml(AC_RED));
        iconRegistry.addSvgIconLiteral('ac-green', sanitizer.bypassSecurityTrustHtml(AC_GREEN));
      }

    tiles: GridItem[] = [
      {component: 'Informazioni', cols: 1, rows: 1, color: 'transparent',},
      {component: 'Datepicker', cols: 1, rows: 1, color: 'transparent'}, 
      {component: 'Servizi', cols: 2, rows: 1, color: 'transparent'}, 
    ];

    servizigrid: IconItem[] = [
        {component: 'Titolo',  cols: 3, rows: 1, color: 'transparent', icon: ''},
        {component: 'Wifi', cols: 1, rows: 1, color: 'transparent', icon: 'wifi-red'},
        {component: 'Car', cols: 1, rows: 1, color: 'transparent', icon: 'car-red'},
        {component: 'AC', cols: 1, rows: 1, color: 'transparent', icon: 'ac-red'},
    ];

    datepickergrid: GridItem[] = [
      {component: 'Prezzo', cols: 2, rows: 1, color: 'transparent'},
      {component: 'Picker', cols: 2, rows: 1, color: 'transparent'},
      {component: 'Button', cols: 2, rows: 1, color: 'transparent'},
      {component: 'PrezzoTot', cols: 2, rows: 1, color: 'transparent'}
    ]

    informazionigrid: GridItem[] = [
      {component: 'Nomestanza', cols: 2, rows: 1, color: 'transparent'},
      {component: 'Informazioni', cols: 2, rows: 2, color: 'transparent'},
      {component: 'Letti', cols: 2, rows: 1, color: 'transparent'}
    ]

    photos: string[]=[
      '/assets/bs5/img/test/A.png',
      '/assets/bs5/img/test/B.png',
      '/assets/bs5/img/test/C.png',
      
    ]




    ngOnInit(): void {
      this.getRoomId();
      
     
    }

    getRoomId(): void{
      this.route.paramMap.subscribe(params => {
        const roomId = params.get('id');
        if (roomId) {
          this.id = roomId;
          this.loadRoom(roomId);
        }
    });
    }

    loadRoom(id: string): void{
      this.roomService.getRoom(id).subscribe(
        (stanza: Stanza) => {
          this.room = stanza; 
          this.photoService.getImageUrlObservable(this.room.nome, this.room.gestore).subscribe(url => {
            this.photos.unshift(url);})
        },
        error => {
          this.goTo404();
        }
  
      );

    }

    goTo404(): void {
      this.router.navigate(['../notfound']);
    }

    calcolaDifferenzaInGiorni(): void {
      const startDate = this.range.get('start')?.value;
      const endDate = this.range.get('end')?.value;
      if (startDate && endDate) {
        this.numeroGiorni = differenceInDays(endDate, startDate);
      }

    }

    async prenota() {
      const startDate = this.range.get('start')?.value;
      const endDate = this.range.get('end')?.value;
  
      if (startDate && endDate) {
        try {
          const result = await this.carrelloService.add(this.id, startDate, this.numeroGiorni);
  
          console.log("il numero è:" + result);
  
          if (result === 1) {
            this.showNotification("Elemento aggiunto al carrello", true, false);
          } else if (result === 2) {
            this.showNotification("Operazione non riuscita: Stanza già occupata nel range delle date", false, false);
          } else if (result === 3) {
            this.showNotification("Operazione non riuscita: Stanza inesistente", false, false);
          } else {
            this.showNotification("Operazione non riuscita: Errore generico", false, false);
          }
        } catch (error) {
          this.showNotification("Operazione non riuscita: Errore dal server", false, false);
        }
      } else {
        this.showNotification("Seleziona un range di date per il pernottamento", false, true);
      }
    }



    getAriaLabel(iconName: string): string {
        switch (iconName) {
          case 'ac-red':
            return 'Aria condizionata non disponibile';
          case 'wifi-red':
            return 'WiFi non disponibile';
          case 'car-red':
            return 'Parcheggio non disponibile';
          default:
            return '';
        }
      }

      //Alert methods

      showNotification(message: string, success: boolean, warning: boolean) {
        this.alertMessage = message;
        this.successAlert = success;
        this.showAlert = true;
        this.warningAlert = warning;
    
        setTimeout(() => {
          this.hideNotification();
        }, 2000);
      }
    
      hideNotification() {
        this.showAlert = false;
      }
  
  }