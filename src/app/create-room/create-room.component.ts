import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../services/ValidationService';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../services/PhotoService';
import axios from 'axios';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
    nome: string = '';
    tipo!: string;
    indirizzo: string = '';
    regione!: string;
    prezzo: number = 0;
    descrizione: string = '';
    carserv: boolean = false;
    wifiserv: boolean = false;
    acserv: boolean = false;

    //Alert
    showAlert = false;
    successAlert = false;
    duj7 = false;
    alertMessage = '';

    image: File | null = null;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit(): Promise<void> {
    const usernameFromUrl = this.route.snapshot.paramMap.get('username');
    const usernameFromCookie = this.cookieService.get('username');
    console.log(usernameFromUrl);
  
    if (usernameFromUrl === usernameFromCookie) {
      const accessToken = this.cookieService.get('accessToken');
      if (accessToken) {
        try {
          await this.validationService.refresh();

        } catch (error) {
          this.router.navigate(['/login']);
        }
      
    } else {
        this.router.navigate(['/login']);
        }
    } else {
        this.router.navigateByUrl(`/user/${usernameFromCookie}/addRoom`);
    }
}

    
    async createRoom() {
      try {
        await this.validationService.refresh();
        // Continua con il tuo flusso di lavoro dopo il refresh riuscito.
      } catch (error) {
        // Gestisci l'errore, ad esempio, reindirizzando l'utente alla pagina di login.
        this.router.navigate(['/login']);
      }
      const url = 'http://localhost:8081/room/create';
      const accessToken = this.cookieService.get('accessToken');
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      };
    
      console.log(headers);
      console.log(this.cookieService.get('accessToken'));
      console.log(this.prezzo);
    
      const roomData = {
        nome: this.nome,
        tipoStanza: this.tipo,
        indirizzo: this.indirizzo,
        regione: this.regione,
        prezzo: this.prezzo,
        descrizione: "Descrizione random ipsum cazzum palem ",
        carserv: this.carserv,
        wifiserv: this.wifiserv,
        acserv: this.acserv
      };
    
      try {
        const response = await axios.post(url, roomData, {
          headers,
          validateStatus: function (status) {
            return status === 200; 
          }
        });
    
        console.log(response.status);
    
        if (response.status === 200) {
          this.showNotification("Stanza creata con successo!", true, false);
          this.uploadImage();
        } else {
          this.showNotification("Errore durante la creazione della stanza", false, false);
        }
      } catch (error) {
        console.error("Errore", error);
        this.showNotification("Errore durante la creazione della stanza", false, false);
      }
    }

  handleImageInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.image = inputElement.files[0];
      console.log("si lo fa (HandleImageInput)");
    }
  }

  uploadImage(): void {
    if (this.image) {
      console.log("lo fa (upload)")
      this.photoService.uploadPhoto(this.image, this.nome, this.indirizzo).subscribe(
        () => {
          console.log('Immagine caricata con successo');
        },
        error => {
          console.error('Errore durante il caricamento dell\'immagine:', error);
        }
      );
    }
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  //Alert methods
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

}