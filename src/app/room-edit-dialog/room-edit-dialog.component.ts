import { Component, Inject } from '@angular/core';
import { PhotoService } from '../services/PhotoService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ValidationService } from '../services/ValidationService';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { UserService } from '../services/UserService';
import { RoomService } from '../services/RoomService';
import { Stanza } from '../entity/Stanza';

@Component({
  selector: 'app-room-edit-dialog',
  templateUrl: './room-edit-dialog.component.html',
  styleUrls: ['./room-edit-dialog.component.scss']
})
export class RoomEditDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private http: HttpClient,
    private cookieService: CookieService,
    private validationService: ValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService,
    private formBuilder: FormBuilder,
    private ref:MatDialogRef<RoomEditDialogComponent>,
    private userService: UserService,
    private roomService: RoomService) {}



    room: Stanza = this.data.room;
    descrizione: string='';
    prezzo: number=0;
  
   //Alert
   showAlert = false;
   successAlert = false;
   duj7 = false;
   alertMessage = '';

   image: File | null = null;

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
      this.photoService.uploadPhoto(this.image, this.room.nome, this.room.indirizzo).subscribe(
        () => {
          console.log('Immagine caricata con successo');
        },
        error => {
          console.error('Errore durante il caricamento dell\'immagine:', error);
        }
      );
    }
  }

  async edit(){
    try{
      if((this.descrizione=='')&&(this.prezzo==0 || this.prezzo == this.room.prezzo)&&(!this.image)){
        this.showNotification("Nulla da modificare", false, true);
      }
      var message: string = '';
      var descrizioneNo: boolean = false;
      var prezzoNo: boolean = false;
      if(this.descrizione!=''){
        const descrizioneSì = await this.roomService.setDescrizione(this.room.id, this.descrizione);
        if(!descrizioneSì){
          descrizioneNo = true;
          message+=" [Descrizione] "
        }
      }
      if(this.prezzo!=0 && this.prezzo != this.room.prezzo){
        const prezzoSì = await this.roomService.setPrezzo(this.room.id, this.prezzo);
        if(!prezzoSì){
          prezzoNo = true;
          message+= " [Prezzo] "
        }
      }
      if(this.image){
        this.uploadImage();
      }
      if(prezzoNo || descrizioneNo){
        this.showNotification("Ci sono stati problemi nella modifica di "+message, false, false);
      } else {
        this.showNotification("Modificati con successo", true, false);
      }

    } catch (error) {
      this.showNotification("Errore durante la modifica della descrizione", false, false);
    }
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
