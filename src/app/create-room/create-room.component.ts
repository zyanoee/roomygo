import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../services/ValidationService';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../services/PhotoService';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
    nome: string = '';
    indirizzo: string = '';
    prezzo: number = 0;
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

  ngOnInit(): void {
    const usernameFromUrl = this.route.snapshot.paramMap.get('username');
    const usernameFromCookie = this.cookieService.get('username');
    console.log(usernameFromUrl);
  
    if (usernameFromUrl === usernameFromCookie) {
      const accessToken = this.cookieService.get('accessToken');
      if (accessToken) {
        this.validationService.refresh(accessToken).subscribe((result: boolean)=> {
            if (!result) {
            this.router.navigate(['/login']);
            }
        });
    } else {
        this.router.navigate(['/login']);
        }
    } else {
        this.router.navigateByUrl(`/user/${usernameFromCookie}/addRoom`);
    }
}

  createRoom() {
    this.validationService.refresh(this.cookieService.get('refreshToken')).subscribe((result: boolean)=> {
      if (!result) {
      this.router.navigate(['/login']);
      }
  });
    const url = 'http://localhost:8081/room/create';
    const accessToken = this.cookieService.get('accessToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    console.log(headers);


    console.log(this.cookieService.get('accessToken'))

    console.log(this.prezzo);



    const roomData = {
      nome: this.nome,
      indirizzo: this.indirizzo,
      prezzo: this.prezzo
    };
    
  
    this.http.post(url, roomData, { headers, observe: 'response'}).subscribe(
      (response: any) => {
        console.log(response.status);
        if (response.status == 200) {
          this.roomCreated = true;
          this.uploadImage();
        } else {
          this.roomError = true;
        }
      },
      error => {
        console.log("Errore");
        this.roomError = true;
      }
    );
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