import { Component } from '@angular/core';
import { ElementoCarrello } from '../entity/ElementoCarrello';
import { CarrelloService } from '../services/CarrelloService';
import { PhotoService } from '../services/PhotoService';
import { Stanza } from '../entity/Stanza';
import { RoomService } from '../services/RoomService';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent {

  constructor(private carrelloService: CarrelloService, private photoService: PhotoService, private stanzaService: RoomService){}

  elementi: ElementoCarrello[] = [ ];
  fotoStanze = new Map<string, string>;
  stanze = new Map<string, Stanza>

  ngOnInit() {
    this.carrelloService.get().subscribe((data) => {
      this.elementi = data;
      for(const elm of this.elementi){
        const stanza_id = elm.stanza_id;
        const gestore_id = elm.gestore_id;
        this.stanzaService.getRoom(stanza_id).subscribe((stanza: Stanza)=>{
          this.stanze.set(stanza_id,stanza);
        })
        this.photoService.getImageUrlObservable(stanza_id, gestore_id).subscribe((url: string)=>{
          this.fotoStanze.set(stanza_id,url);
        })
      }
    })
  }
  rimuovi(elm_id: string): void{
    this.carrelloService.remove(elm_id).subscribe((value)=>{
      if(value===1){
        this.elementi = this.elementi.filter(item=> item.id === elm_id);
      }
    })
  }

  getUrl(elm: ElementoCarrello): string{
    const url = this.fotoStanze.get(elm.stanza_id);
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
      return new Stanza(-1, "", "", "", 0, "", false, false, false);
    }
  }

}
