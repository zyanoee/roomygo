import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../services/ValidationService';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PhotoService } from '../services/PhotoService';
import axios from 'axios';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../services/UserService';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss']
})
export class UserEditDialogComponent implements OnInit {
    inputdata: any;
    descrizione: string = '';

    //Alert
    showAlert = false;
    successAlert = false;
    duj7 = false;
    alertMessage = '';

    image: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private http: HttpClient,
    private cookieService: CookieService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private formBuilder: FormBuilder,
    private ref:MatDialogRef<UserEditDialogComponent>,
    private userService: UserService
  ) {}

  async ngOnInit(): Promise<void> {
    this.inputdata = this.data;
  }

  async edit(){
    try{
      if(this.descrizione && this.descrizione != ''){
        console.log("CI VA??????")
        console.log(this.descrizione);
        const descrizionefatta = await this.userService.setDescrizione(this.descrizione); 
      } else {
        if(!this.image){
          console.log(!this.image);
          this.showNotification("Nulla da modificare", false, true);
          return;
        }
      }
      this.uploadImage();
      this.showNotification("Modificati con successo", true, false);

    } catch (error) {
      this.showNotification("Errore durante la modifica della descrizione", false, false);
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
      this.photoService.uploadPhotoPropic(this.image).subscribe(
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