import { Component, Inject } from '@angular/core';
import { Prenotazione } from '../entity/Prenotazione';
import { PrenotazioneService } from '../services/PrenotazioneService';
import { Router } from '@angular/router';
import { PhotoService } from '../services/PhotoService';
import { CookieService } from 'ngx-cookie-service';
import { RoomService } from '../services/RoomService';
import { ValidationService } from '../services/ValidationService';
import { Stanza } from '../entity/Stanza';
import { Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-room-edit-prenotazioni',
  templateUrl: './room-edit-prenotazioni.component.html',
  styleUrls: ['./room-edit-prenotazioni.component.scss']
})
export class RoomEditPrenotazioniComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:any,private ref:MatDialogRef<RoomEditPrenotazioniComponent>,private prenotazioneService: PrenotazioneService, private router: Router, private photoService: PhotoService,private cookieService: CookieService, private stanzaService: RoomService, private validationService: ValidationService){}

  elementi: Prenotazione[] = [ ];
  fotoStanze = new Map<string, string>;
  stanze = new Map<string, Stanza>
  subscriptions: Subscription[] = [];

  room: Stanza = this.data.room;




  async ngOnInit() {
    await this.validationService.refresh();
    if(this.cookieService.get("accessToken") == ""){
      this.router.navigate(['/login']);
    }
    const carrelloSubscription = this.prenotazioneService.getByRoom(this.room.id).subscribe((data) => {
      this.elementi = data;
      for (const elm of this.elementi) {
        const stanza_id = elm.room_id
        const gestore_id = elm.gestore_id;

        const stanzaSubscription = this.stanzaService
          .getRoom(stanza_id.toString())
          .subscribe((stanza: Stanza) => {
            this.stanze.set(stanza_id.toString(), stanza);
            this.photoService.showImage(stanza.id,stanza.gestore,0).subscribe((data: string)=>this.fotoStanze.set(stanza_id.toString(),data));
          });
          
      }
    });
    this.subscriptions.push(carrelloSubscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
 
    
  

  getUrl(elm: Prenotazione): string{
    const url = this.fotoStanze.get(elm.room_id.toString());
    if(url){
      return url;
    } else {
      return "./assets/bs5/img/test/A.png";
    }
  }

  getRoom(elm: Prenotazione): Stanza{
    const room = this.stanze.get(elm.room_id.toString());
    if(room){
      return room;
    } else {
      return new Stanza(-1, "", "", "", "", "", 0, "", false, false, false);
    }
  }

}


