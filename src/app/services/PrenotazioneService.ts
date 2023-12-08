import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Stanza } from '../entity/Stanza';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { Prenotazione } from '../entity/Prenotazione';
import { ValidationService } from './ValidationService';

@Injectable({
  providedIn: 'root'
})export class PrenotazioneService {
  
  private apiUrl = 'http://localhost:8081/prenotazioni';
  
  constructor(private cookieService: CookieService, private validationService: ValidationService, private http: HttpClient){}


  async ordina(accessToken: string): Promise<Boolean> {
    try {
      const accessToken = this.cookieService.get('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const data = {
      };
      const response = await axios.post('http://localhost:8081/cart/order', data, {headers});
      if(response.status == 200){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Errore durante l'ordine:", error);
      return false;
    }
  }


  get(): Observable<Prenotazione[]> {
    this.validationService.refresh();
    const username: string = this.cookieService.get("username");
    const accessToken = this.cookieService.get("accessToken");
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<Prenotazione[]>(this.apiUrl+"/", { headers }).pipe(
        catchError((error) => {
          // Gestisci l'errore qui, ad esempio, puoi registrare l'errore o restituire un array vuoto.
          console.error('Errore durante la richiesta al carrello:', error);
          return of([] as Prenotazione[]); 
        }),
        map((data: Prenotazione[]) => {
          return data;
        })
      );
  }
  getByRoom(id: number): Observable<Prenotazione[]> {
    this.validationService.refresh();
    const username: string = this.cookieService.get("username");
    const accessToken = this.cookieService.get("accessToken");
    const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get<Prenotazione[]>(this.apiUrl+"/"+id, { headers }).pipe(
        catchError((error) => {
          // Gestisci l'errore qui, ad esempio, puoi registrare l'errore o restituire un array vuoto.
          console.error('Errore durante la richiesta al carrello:', error);
          return of([] as Prenotazione[]); 
        }),
        map((data: Prenotazione[]) => {
          return data;
        })
      );
}




}