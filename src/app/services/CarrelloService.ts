import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from './ValidationService';
import { ElementoCarrello } from '../entity/ElementoCarrello';

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


    add(stanza_id: string, giorno: Date, ngiorni: number): Observable<number> {
        this.validationService.refresh();
        const url = `${this.apiUrl}/add/${stanza_id}`;
        const requestBody = new URLSearchParams();
        const dateString = giorno.toISOString();
        requestBody.set('giornoString', dateString);
        requestBody.set('ngiorni', ngiorni.toString());

        const accessToken = this.cookieService.get("accessToken");
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        });

        return this.http.post(url, requestBody.toString(), { headers, observe: 'response' }).pipe(
            catchError((error) => {
                if (error.status === 0) {
                    console.error('Errore di connessione rifiutata:', error);
                    return of(-1);
                }
                return of(-1);
            }),
            map((response: any) => {
                if (response.status === 200) {
                    console.log("aggiunto al carrello");
                    return 1;
                }
                if (response.status === 452) {
                    console.log("stanza gia prenotata nel range di date");
                    return 2;
                }
                if (response.status === 400) {
                    console.log("stanza inesistente");
                    return 3;
                }
                return -1;
            })
        );
    }


    remove(elm_id: string): Observable<number> {
        this.validationService.refresh();
        const url = `${this.apiUrl}/remove`;
        const requestBody = new URLSearchParams();
        requestBody.set('id', elm_id);

        const accessToken = this.cookieService.get("accessToken");
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${accessToken}`
        });

        return this.http.post(url, requestBody.toString(), { headers, observe: 'response' }).pipe(
            catchError((error) => {
                if (error.status === 0) {
                    console.error('Errore di connessione rifiutata:', error);
                    return of(-1);
                }
                return of(-1);
            }),
            map((response: any) => {
                if (response.status === 200) {
                    console.log("Rimosso dal carrello");
                    return 1;
                }
                if (response.status === 400) {
                    console.log("Elemento non esistente");
                    return 0;
                }
                return -1;
            })
        );
    }


    



}