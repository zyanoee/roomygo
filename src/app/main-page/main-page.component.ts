import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';

import { SearchCriteria } from '../entity/SearchCriteria';
import { ValidationService } from '../services/ValidationService';
import { PhotoService } from '../services/PhotoService';
import { Observable, distinctUntilChanged, map, of } from 'rxjs';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  stanze: Stanza[] = [];
  imageUrls: { [key: string]: string } = {};

  searchCriteria: SearchCriteria = new SearchCriteria();
  searchResults: any[] = [];

  ceil: number = 1;
  username : string = "";
  authenticated : boolean = false;
  showOverlayLogo = false;
  showCartoverlayLogo = false;

  constructor(
    private router: Router,
    private http: HttpClient, 
    private cookieService: CookieService, 
    private validationService: ValidationService,
    private photoService: PhotoService) {
    
  }


  async ngOnInit() {
    const accessToken = this.cookieService.get('accessToken');
    if (accessToken && (await this.validationService.validateToken(accessToken))) {
      this.username = this.cookieService.get('username');
      this.authenticated = true;
    } else {
      this.authenticated = false;
      this.username = "";
    }
  
    this.http.get<Stanza[]>('http://localhost:8081/room')
      .subscribe((data) => {
        this.stanze = data.map((item: any) => {
          return new Stanza(item.id, item.nome, item.tipoStanza, item.indirizzo, item.indirizzo, item.gestore, item.prezzo, item.descrizione, item.carserv, item.wifiserv, item.acserv);
        });
        this.ceil = Math.ceil(this.stanze.length / 5);
        this.stanze.forEach((stanza) => {
          this.getImageUrlObservable(stanza.nome, stanza.gestore).subscribe(url => {
            this.imageUrls[stanza.nome] = url;
          });
        });
      });
  }
  
  getImageUrlObservable(nomeStanza: string, gestore: string): Observable<string> {
    return this.photoService.downloadPhoto(nomeStanza, gestore).pipe(
      map((blob: Blob) => URL.createObjectURL(blob))
    );
  }

  goToRoom(stanza_id: number): void {
    this.router.navigate(["/room/"+stanza_id]);
  }

  searchRooms(criteria: SearchCriteria): any[] {
    // Implementa la logica di ricerca qui
    // Filtra this.rooms in base ai criteri e restituisci il risultato
    return this.stanze.filter(room => {
      return (
        (!criteria.regione || room.regione === criteria.regione) &&
        (!criteria.tipoStanza || room.tipoStanza === criteria.tipoStanza) &&
        (!criteria.parcheggio || room.carserv === criteria.parcheggio) &&
        (!criteria.ariacondizionata || room.acserv === criteria.ariacondizionata) &&
        (!criteria.wifi || room.wifiserv === criteria.wifi)

      );
    });
  }

  search() {
    this.searchResults = this.searchRooms(this.searchCriteria);
  }

}