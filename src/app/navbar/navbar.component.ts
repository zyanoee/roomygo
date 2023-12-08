import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { ValidationService } from '../services/ValidationService';
import { PhotoService } from '../services/PhotoService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  username : string = "";
  authenticated : boolean = false;
  showOverlayLogo = false;
  showCartoverlayLogo = false;

  constructor(
    private router: Router,
    private http: HttpClient, 
    private cookieService: CookieService, 
    private validationService: ValidationService,
    private photoService: PhotoService) {
      
      

    }

  

  async ngOnInit() {
    
  }

  goHome() {
    this.router.navigate(["/"])
    }

  async loginOrUser(){
    try{
      if(this.cookieService.get("accessToken") != "null"){
        await this.validationService.refresh()
      } else {
        this.router.navigate(["/login"])
      }
      if(this.cookieService.get("accessToken") != "null"){
        this.router.navigate(["/user/"+this.cookieService.get("username")]);
      } else {
        this.router.navigate(["/login"])
      }
    } catch(error) {
      this.router.navigate(["/login"])
    }
  }

  async loginOrCart(){
    try{
      if(this.cookieService.get("accessToken") != "null"){
        await this.validationService.refresh()
      } else {
        this.router.navigate(["/login"])
      }
      if(this.cookieService.get("accessToken") != "null"){
        this.router.navigate(["/user/"+this.cookieService.get("username")+"/cart"]);
      } else {
        this.router.navigate(["/login"])
      }
    } catch(error) {
      this.router.navigate(["/login"])
    }
  }

  async loginOrRoom(){
    try{
      if(this.cookieService.get("accessToken") != "null"){
        await this.validationService.refresh()
      } else {
        this.router.navigate(["/login"])
      }
      if(this.cookieService.get("accessToken") != "null"){
        this.router.navigate(["/user/"+this.cookieService.get("username")+"/addRoom"]);
      } else {
        this.router.navigate(["/login"])
      }
    } catch(error) {
      this.router.navigate(["/login"])
    }
  }

  async logout(){
    try{
      if(this.cookieService.get("accessToken") != "null"){
        await this.validationService.refresh()
      } else {
      }
      if(this.cookieService.get("accessToken") != "null" && this.cookieService.get("refreshToken") != "null"){
        await this.validationService.logout()
      }
    } catch(error){

    }
  }


}
