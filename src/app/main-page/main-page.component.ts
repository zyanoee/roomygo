import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';

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
    const accessToken = this.cookieService.get('accessToken');


    if (accessToken && this.validationService.validate(accessToken)) {
      this.username = this.cookieService.get('username');
      this.authenticated = true;
    } else {
      this.authenticated = false;
      this.username = "";
    }
  }


  ngOnInit(): void {
    this.http.get<Stanza[]>('http://localhost:8081/room')
      .subscribe((data) => {
        this.stanze = data.map((item: any) => {
          return new Stanza(item.id, item.nome, item.indirizzo, item.gestore, item.prezzo, item.descrizione, item.carserv, item.wifiserv, item.acserv);
        });
  
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

}