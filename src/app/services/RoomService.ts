import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Stanza } from '../entity/Stanza';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient, private cookieService : CookieService) { }

  // Metodo per ottenere le stanze di un utente
  getUserRooms(username: string): Observable<Stanza[]> {
    const accessToken = this.cookieService.get("accessToken");
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`
  });
    const url = `${this.apiUrl}/user/${username}/rooms`;
    return this.http.get<Stanza[]>(url, {headers}).pipe(
        map(data => {
          // Ogni elemento di data è un oggetto stanza dal backend
          // Creiamo gli oggetti Stanza a partire dai dati ottenuti
          return data.map(item => new Stanza(
            item.id,
            item.nome,
            item.tipoStanza,
            item.indirizzo,
            item.regione,
            item.gestore,
            item.prezzo,
            item.descrizione,
            item.carserv,
            item.wifiserv,
            item.acserv
          ));
        })
      );
  }

  getRoom(id: string): Observable<Stanza>{
    const url = `${this.apiUrl}/room/${id}`;
    return this.http.get<Stanza>(url).pipe(
      map(data => new Stanza(
        data.id,
        data.nome,
        data.tipoStanza,
        data.indirizzo,
        data.regione,
        data.gestore,
        data.prezzo,
        data.descrizione,
        data.carserv,
        data.wifiserv,
        data.acserv
      )),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          console.error('La stanza non è stata trovata.');
          return throwError('La stanza non è stata trovata.'); // Restituisci un errore personalizzato in caso di errore 404
        } else {
          // Gestisci altri errori
          console.error('Si è verificato un errore durante il recupero della stanza.', error);
          return throwError('Si è verificato un errore durante il recupero della stanza.');
        }
      })
    );
  }

  async setDescrizione(id: number, descrizione: string): Promise<Boolean> {
    try {
      const accessToken = this.cookieService.get('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const requestBody = {
        descrizione: descrizione
      };
      const response = await axios.post('http://localhost:8081/room/'+id+'/editdescription', requestBody, {headers});
      if(response.status == 200){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Errore durante l'impostazione della descrizione:", error);
      return false;
    }
  }

  async setPrezzo(id: number, prezzo: number): Promise<Boolean> {
    try {
      const accessToken = this.cookieService.get('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      const requestBody = {
        prezzo: prezzo
      };
      const response = await axios.post('http://localhost:8081/room/'+id+'/editprice', requestBody, {headers});
      if(response.status == 200){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Errore durante l'impostazione della descrizione:", error);
      return false;
    }
  }

}