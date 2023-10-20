import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../services/ValidationService';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../services/PhotoService';
import axios from 'axios';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
    nome: string = '';
    indirizzo: string = '';
    prezzo: number = 0;
    descrizione: string = '';
    carserv: boolean = false;
    wifiserv: boolean = false;
    acserv: boolean = false;

    image: File | null = null;
  roomCreated:boolean = false;
  roomError: boolean = false;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService
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
          // Continua con il tuo flusso di lavoro dopo il refresh riuscito.
        } catch (error) {
          // Gestisci l'errore, ad esempio, reindirizzando l'utente alla pagina di login.
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
        indirizzo: this.indirizzo,
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
            return status === 200; // Accetta solo lo stato 200 come successo
          }
        });
    
        console.log(response.status);
    
        if (response.status === 200) {
          this.roomCreated = true;
          this.uploadImage();
        } else {
          this.roomError = true;
        }
      } catch (error) {
        console.error("Errore", error);
        this.roomError = true;
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
      this.photoService.uploadPhoto(this.image, this.nome).subscribe(
        () => {
          console.log('Immagine caricata con successo');
          // Esegui qui eventuali azioni dopo il caricamento dell'immagine
        },
        error => {
          console.error('Errore durante il caricamento dell\'immagine:', error);
          // Gestisci l'errore qui
        }
      );
    }
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}