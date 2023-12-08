import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of} from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { isValid } from 'date-fns';
import axios from 'axios';
import { NotAuthError } from '../errors/NotAuthError';

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
      throw new NotAuthError("Non autenticato");   }

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
      if(response.status === 200){
        this.cookieService.set("accessToken", response.data.accessToken, undefined, '/');
        this.cookieService.set("refreshToken", response.data.refreshToken, undefined, '/');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      console.log("Azzeramento della sessione");
      this.cookieService.set("accessToken", "null", undefined, '/');
      this.cookieService.set("refreshToken", "null", undefined, '/');
      this.cookieService.set("username", "null", undefined, '/');

      return false;
    }
  }

  async check(username: string): Promise<Boolean> {
    try{
      const accessToken = this.cookieService.get("accessToken");
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      };
      const data = {
        username: username
      };
      const response = await axios.post('http://localhost:8081/user/check', data, {headers});
      if(response.status === 200){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try{
      const accessToken = this.cookieService.get("accessToken");
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${accessToken}`
      };

      const refreshToken = this.cookieService.get("refreshToken");
      const data = {
        refreshToken: refreshToken
      };
      const response = await axios.post('http://localhost:8081/user/logout', data, {headers});
      if(response.status === 200){
        this.cookieService.set("accessToken", response.data.accessToken, undefined, '/');
        this.cookieService.set("refreshToken", response.data.refreshToken, undefined, '/');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Errore durante il refresh del token:', error);
      console.log("Azzeramento della sessione");
      this.cookieService.set("accessToken", "null", undefined, '/');
      this.cookieService.set("refreshToken", "null", undefined, '/');
      this.cookieService.set("username", "null", undefined, '/');

      return false;
    }
  }
  }