import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isValid } from 'date-fns';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }


  getUsername(token: string) {
    const username = this.cookieService.get('username');
  }


  async refresh() {
    const accessToken = this.cookieService.get('accessToken');
    const refreshToken = this.cookieService.get('refreshToken');

    if (!accessToken || !refreshToken) {
      console.log('AccessToken o RefreshToken mancante. Impossibile eseguire il refresh.');
      return;
    }

    // Chiamata al metodo validate(token)
    const isTokenValid = await this.validateToken(accessToken);

    if (isTokenValid) {
      console.log('Il token è valido. Nessuna azione richiesta.');
      return;
    } else {
      // Chiamata al metodo di refresh con il refreshToken
      const isRefreshSuccessful = await this.refreshToken(refreshToken);

      if (isRefreshSuccessful) {
        console.log('Token refresh completato con successo.');
      } else {
        console.log('Il refresh del token ha fallito.');
      }
    }
  }

  // Metodo per validare il token
  async validateToken(accessToken: string): Promise<boolean> {
    try {
      
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      
      const data = {
        token: accessToken
      };

      const response = await axios.post('http://localhost:8081/user/token/validate', data, {headers});
      return response.data === false;
    } catch (error) {
      console.error('Errore durante la validazione del token:', error);
      return false;
    }
  }

  // Metodo per effettuare il refresh del token
  async refreshToken(refreshToken: string): Promise<boolean> {
    try {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
      };
      
      const data = {
        refreshToken: refreshToken 
      };
      const response = await axios.post('http://localhost:8081/user/refresh', data, {headers});
      return response.data === true;
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      console.log("Azzeramento della sessione");
      this.cookieService.deleteAll();
      this.cookieService.set("username", "");
      this.cookieService.set("accessToken", "");
      this.cookieService.set("refreshToken", "");
      return false;
    }
  }
  }