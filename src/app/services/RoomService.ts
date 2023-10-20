import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Stanza } from '../entity/Stanza';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8081'; // Sostituisci con l'URL effettivo del tuo backend

  constructor(private http: HttpClient) { }

  // Metodo per ottenere le stanze di un utente
  getUserRooms(username: string): Observable<Stanza[]> {
    const url = `${this.apiUrl}/${username}/room`;
    return this.http.get<any[]>(url).pipe(
        map(data => {
          // Ogni elemento di data è un oggetto stanza dal backend
          // Creiamo gli oggetti Stanza a partire dai dati ottenuti
          return data.map(item => new Stanza(
            item.id,
            item.nome,
            item.indirizzo,
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

  //Metodo per ottenere una certa stanza
  getRoom(id: string): Observable<Stanza>{
    const url = `${this.apiUrl}/room/${id}`;
    return this.http.get<Stanza>(url).pipe(
      map(data => new Stanza(
        data.id,
        data.nome,
        data.indirizzo,
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
}