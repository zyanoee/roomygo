import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Utente } from '../entity/Utente';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081'; 

  constructor(private http: HttpClient) { }

  getUser(username: string): Observable<Utente> {
    const url = `${this.apiUrl}/${username}`;
    return this.http.get<Utente>(url).pipe(
      map(data => new Utente(data.nome, data.username, data.telefono, data.descrizione))
    );
  }

  getUserLink(username: string): Observable<string[]> {
    const url = `${this.apiUrl}/${username}/links`;
    return this.http.get<string[]>(url);
  }
}