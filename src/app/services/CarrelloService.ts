import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from './ValidationService';
import { ElementoCarrello } from '../entity/ElementoCarrello';
import axios, { AxiosResponse } from 'axios';

@Injectable({
  providedIn: 'root'
})export class CarrelloService {

    private apiUrl = 'http://localhost:8081/cart';

    constructor(private http: HttpClient, private cookieService: CookieService, private validationService: ValidationService) { }


    get(): Observable<ElementoCarrello[]> {
        this.validationService.refresh();
        const username: string = this.cookieService.get("username");
        const accessToken = this.cookieService.get("accessToken");
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        });
        return this.http.get<ElementoCarrello[]>(this.apiUrl+"/", { headers }).pipe(
            catchError((error) => {
              // Gestisci l'errore qui, ad esempio, puoi registrare l'errore o restituire un array vuoto.
              console.error('Errore durante la richiesta al carrello:', error);
              return of([] as ElementoCarrello[]); 
            }),
            map((data: ElementoCarrello[]) => {
              return data;
            })
          );
    }


    async add(stanza_id: string, giorno: Date, ngiorni: number): Promise<number> {
        try {
          await this.validationService.refresh();
          const url = `${this.apiUrl}/add/${stanza_id}`;
          const dateString = giorno.toISOString();
      
          const accessToken = this.cookieService.get('accessToken');
          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': `Bearer ${accessToken}`,
            },
          };
      
          const requestBody = new URLSearchParams();
          requestBody.append('giornoString', dateString);
          requestBody.append('ngiorni', ngiorni.toString());
      
          const response = await axios.post(url, requestBody.toString(), config);
      
          console.log('lo status response è ' + response.status);
          console.log('Il messaggio è: ' + response.data);
      
          if (response.status === 200) {
            console.log('aggiunto al carrello');
            return 1;
          }
          if (response.status === 452) {
            console.log('stanza gia prenotata nel range di date');
            return 2;
          }
          if (response.status === 400) {
            console.log('stanza inesistente');
            return 3;
          }
      
          return -2;
        } catch (error) {
          if (axios.isAxiosError(error) && error.response && error.response.status === 0) {
            console.error('Errore di connessione rifiutata:', error);
            return -1;
          }
          console.error('Errore durante la richiesta:', error);
          return -1;
        }
      }

    async remove(elm_id: string): Promise<number>{
      try {
        await this.validationService.refresh();
        const url = `${this.apiUrl}/remove`;
        const requestBody = new URLSearchParams();
        requestBody.set('id', elm_id);
        const accessToken = this.cookieService.get('accessToken');
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`,
          },
        };
        const response = await axios.post(url, requestBody.toString(), config);

        if (response.status === 200) {
          console.log('Rimosso dal Carrello');
          return 1;
        }
        
        if (response.status === 400) {
          console.log('Elemento inesistente');
          return 0;
        }
    
        return -1;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 0) {
          console.error('Errore di connessione rifiutata:', error);
          return -1;
        }
        console.error('Errore durante la richiesta:', error);
        return -1;
      }
    }


    



}