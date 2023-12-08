import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Utente } from '../entity/Utente';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/user'; 


  constructor(private http: HttpClient, private cookieService: CookieService,) { }

  getUser(username: string): Observable<Utente> {
    const url = `${this.apiUrl}/${username}`;
    return this.http.get<Utente>(url).pipe(
      map(data => new Utente(data.username, data.nome, data.telefono, data.descrizione))
    );
  }

  

  getUserLink(username: string): Observable<string[]> {
    const url = `${this.apiUrl}/${username}/links`;
    return this.http.get<string[]>(url);
  }

  async setDescrizione(descrizione: string): Promise<Boolean> {
    try {
      const accessToken = this.cookieService.get('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
      const requestBody = {
        descrizione: descrizione
      };
      const response = await axios.post('http://localhost:8081/user/editdescription', requestBody, {headers});
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

  
}