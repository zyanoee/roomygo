import { Component } from '@angular/core';
import { ElementoCarrello } from '../entity/ElementoCarrello';
import { CarrelloService } from '../services/CarrelloService';
import { PhotoService } from '../services/PhotoService';
import { Stanza } from '../entity/Stanza';
import { RoomService } from '../services/RoomService';
import { Subscription } from 'rxjs';
import { ValidationService } from '../services/ValidationService';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { PrenotazioneService } from '../services/PrenotazioneService';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {
//Alert
showAlert = false;
successAlert = false;
warningAlert = false;
alertMessage = '';

  constructor(private carrelloService: CarrelloService,private prenotazioneService: PrenotazioneService, private router: Router, private photoService: PhotoService,private cookieService: CookieService, private stanzaService: RoomService, private validationService: ValidationService){}

  elementi: ElementoCarrello[] = [ ];
  fotoStanze = new Map<string, string>;
  stanze = new Map<string, Stanza>
  subscriptions: Subscription[] = [];

  async ngOnInit() {
    await this.validationService.refresh();
    if(this.cookieService.get("accessToken") == ""){
      this.router.navigate(['/login']);
    }
    const carrelloSubscription = this.carrelloService.get().subscribe((data) => {
      this.elementi = data;
      for (const elm of this.elementi) {
        const stanza_id = parseInt(elm.stanza_id)
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
  async rimuovi(elm_id: string): Promise<void>{
    try {
      const result = await this.carrelloService.remove(elm_id);

      if(result===1){
        this.elementi = this.elementi.filter(item=> item.id !== elm_id);
      }
    } catch (error) {
      console.log(error);
    }
    
  }

  

  getUrl(elm: ElementoCarrello): string{
    const url = this.fotoStanze.get(elm.stanza_id.toString());
    if(url){
      return url;
    } else {
      return "./assets/bs5/img/test/A.png";
    }
  }

  getRoom(elm: ElementoCarrello): Stanza{
    const room = this.stanze.get(elm.stanza_id);
    if(room){
      return room;
    } else {
      return new Stanza(-1, "", "", "", "", "", 0, "", false, false, false);
    }
  }

  async ordina(){
    try{
      await this.validationService.refresh();
    }catch (error) {
      this.router.navigate(['/login'])
    }
    try{
    if(this.elementi.length>0){
      
      const esito = await this.prenotazioneService.ordina(this.cookieService.get("accessToken"));
      if(esito){
        this.showNotification("Ordine andato a buon fine", true, false);
      } else {
        this.showNotification("Ordine non andato a buon fine controlla gli elementi non validi", false, false)
      }
    } else {
      this.showNotification("Ordine non eseguito, il carrello è vuoto", false, true);
    }
    } catch (error) {
      this.showNotification("Ordine non andato a buon fine controlla gli elementi non validi", false, false)
    }
    location.reload();
  }


  //Alert methods

  showNotification(message: string, success: boolean, warning: boolean) {
    this.alertMessage = message;
    this.successAlert = success;
    this.showAlert = true;
    this.warningAlert = warning;

    setTimeout(() => {
      this.hideNotification();
    }, 2000);
  }

  hideNotification() {
    this.showAlert = false;
  }

}
