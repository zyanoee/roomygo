import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  username: string = '';
  password: string = '';
  nome: string = '';
  telefono!: number;
  registrationSuccess: boolean = false;
  registrationError: boolean = false;
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

  constructor(private http: HttpClient, private cookieService: CookieService) {

  }

  register(): void {
    this.cookieService.set("username","null",undefined, '/');
    this.cookieService.set("accessToken", "null", undefined, '/');
    this.cookieService.set("refreshToken", "null", undefined, '/');
    if (this.username && this.password && this.nome && this.telefono) {
      const url = 'http://localhost:8081/user/signup';

const requestBody = new URLSearchParams();
requestBody.set('username', this.username);
requestBody.set('nome', this.nome);
requestBody.set('password', this.password);
requestBody.set('telefono', this.telefono.toString());


const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

this.http.post(url, requestBody.toString(), { headers, observe: 'response'} ).subscribe(
  (response: any) => {
    console.log(response.status);
    if (response.status == 201) {
      // Gestione per stato 200
      this.showNotification('Registrazione avvenuta con successo!', true, false);

      this.inputError = false;
    } else {
      this.showNotification('Errore durante la registrazione', false, false);
      this.inputError = false;
     }

    })
  
  } else {
    this.showNotification('Compila tutti i campi', false, true);
    this.inputError = false;
  }
}
}
