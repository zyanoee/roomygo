import { Component } from '@angular/core';
import { Stanza } from '../entity/Stanza';
import { Subscription } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { PhotoService } from '../services/PhotoService';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { RoomService } from '../services/RoomService';
import { ValidationService } from '../services/ValidationService';

@Component({
  selector: 'app-user-edit-stanze',
  templateUrl: './user-edit-stanze.component.html',
  styleUrls: ['./user-edit-stanze.component.scss']
})
export class UserEditStanzeComponent {

  constructor(private ref:MatDialogRef<UserEditStanzeComponent>, private router: Router, private photoService: PhotoService,private cookieService: CookieService, private stanzaService: RoomService, private validationService: ValidationService){}

  elementi: Stanza[] = [ ];
  fotoStanze = new Map<string, string>;
  stanze = new Map<string, Stanza>
  subscriptions: Subscription[] = [];

  async ngOnInit() {
    await this.validationService.refresh();
    if(this.cookieService.get("accessToken") == ""){
      this.router.navigate(['/login']);
    }
    const carrelloSubscription = this.stanzaService.getUserRooms(this.cookieService.get("username")).subscribe((data) => {
      this.elementi = data;
      for (const elm of this.elementi) {
        const stanza_id = elm.id
        const gestore_id = elm.gestore;
        this.photoService.showImage(stanza_id,gestore_id,0).subscribe((data: string)=>this.fotoStanze.set(stanza_id.toString(),data));

          
      }
    });
    this.subscriptions.push(carrelloSubscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
 
    
  

  getUrl(elm: Stanza): string{
    const url = this.fotoStanze.get(elm.id.toString());
    if(url){
      return url;
    } else {
      return "./assets/bs5/img/test/A.png";
    }
  }

  getRoom(elm: Stanza): Stanza{
    const room = this.stanze.get(elm.id.toString());
    if(room){
      return room;
    } else {
      return new Stanza(-1, "", "", "", "", "", 0, "", false, false, false);
    }
  }

  goToRoom(id: number){
    this.ref.close();
    this.router.navigate(["/room/"+id+"/"])
  }




}