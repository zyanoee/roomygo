import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  validate(token: string): Observable<boolean> {
    const url = 'http://localhost:8080/user/token/validate';
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    const body = new URLSearchParams();
    body.set('token', token);

    return this.http.post(url, body.toString(), { headers, observe: 'response' })
    .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200) {

            return response.body === true;
          }
          return false;
        })
      );
  }

  getUsername(token: string) {
    const username = this.cookieService.get('username');
  }


  refresh(token: string): Observable<boolean>{
  
    if(!this.validate(this.cookieService.get('accessToken'))){
    const url = 'http://localhost:8080/user/refresh';
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    
    const body = new URLSearchParams();
    body.set('refreshToken', token);
    return this.http.post(url, body.toString(), { headers, observe: 'response' })
    .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === 200 && response.body.accessToken) {
            const accessToken = response.body.accessToken;
            this.cookieService.set('accessToken', accessToken);
            console.log("Token refreshato");
            return true;
          }
          console.log("Errore nell'upload del token");
          return false;
        })
      )
    }
    console.log("Token Non scaduto");
    return of(true);
  }
 

}