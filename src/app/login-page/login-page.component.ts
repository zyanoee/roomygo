import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  loginPressed: boolean = false;
  loginSuccess: boolean = false;
  inputError: boolean = false;

  showAlert = false;
  successAlert = false;
  duj7 = false;
  alertMessage = '';


  showNotification(message: string, success: boolean, warning: boolean) {
    this.alertMessage = message;
    this.successAlert = success;
    this.showAlert = true;
    this.duj7 = warning;

    setTimeout(() => {
      this.hideNotification();
    }, 2000);
  }

  hideNotification() {
    this.showAlert = false;
  }

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  login(): void {
    if (this.username && this.password) {
    const url = 'http://localhost:8081/user/login';
    const requestBody = new URLSearchParams();
    requestBody.set('username', this.username);
    requestBody.set('password', this.password);
    
    this.loginPressed = true;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    this.http.post(url, requestBody.toString(), { headers, observe: 'response'} ).pipe(
      catchError((error) => {
        if (error.status === 0) {
          // Qui puoi gestire l'errore di connessione rifiutata
          // Ad esempio, mostrare una notifica all'utente
          console.error('Errore di connessione rifiutata:', error);
          this.showNotification('Errore di connessione. Verifica la connessione di rete.', false, false);
        }
        // Ritorna un observable con un valore fittizio per continuare il flusso
        return of(error);
      })
    ).subscribe(
      (response: any) => {
        if(!response){
          this.showNotification('Errore durante il login, controlla le tue credenziali', false, false);
        }
        if (response.status == 200) {
            // Gestione per stato 200
            const accessToken = response.body.accessToken;
            const refreshToken = response.body.refreshToken;
            this.cookieService.set('accessToken', accessToken);
            this.cookieService.set('username', this.username);
            this.cookieService.set('refreshToken', refreshToken);
            console.log(accessToken);
            this.showNotification('Login avvenuto con successo!', true, false);
          } else {
            this.showNotification('Errore durante il login, controlla le tue credenziali', false, false);
            
           }
          })
    this.loginPressed = false;
    } else { 
    this.showNotification('Compila tutti i campi', false, true);

    }
  }

  goToRegister(): void {
    this.router.navigate(['../register']);
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}